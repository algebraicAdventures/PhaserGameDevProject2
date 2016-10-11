var OrderManager = function(game) {
    this.game = game;
    this.timer_ = new Phaser.Timer(game, false);

    this.maxOrders_ = 5;
    this.activeOrders_ = [];
    this.expiringOrders_ = 0;
};

OrderManager.prototype.start = function() {
    this.timer_.start();
};

/**
 * @return int Number of active orders.
 */
OrderManager.prototype.numOrders = function() {
    return this.activeOrders_.length;
};

/**
 * @param components An object containing the drink requirements
 */
OrderManager.prototype.addOrder = function(components) {
    var numOrders = this.numOrders();
    if(numOrders >= this.maxOrders_) {
        return;
    }

    // Sounds
    game.musicManager.increaseStem();
    game.sound.play("bell",.75);

    // Temporary for refactoring - move back into dropdown class and add an event listener for new order.
    var dropDown = this.game.state.dropDown;
    if (!dropDown.open_) {
        dropDown.textAlertTime = TEXT_VISIBLE_TIME;
        dropDown.textAlert.alpha = 0; //Reset text alert
        game.add.tween(dropDown.textAlert).to({alpha: 1}, TEXT_FLICKER_RATE, Phaser.Easing.Sinusoidal.InOut,true,0,3,true);
    }

    var newOrder = new DrinkOrder(this.game, 0, -(TAB_SIZE + SPACING * (numOrders + 1)) + OFFSET, ORDER_TIME, components);
    newOrder.anchor.set(0.5, 0);
    newOrder.addCrunchEvent(function() {
        if(this.expiringOrders_ === 0) {
            this.game.musicManager.toggleEmergency();
        }
        this.expiringOrders_ += 1;
        if(!dropDown.open_) {
            dropDown.open(this.activeOrders_.indexOf(newOrder));
            window.setTimeout(function() {
                dropDown.close();
            }, PEEK_TIME);
        }
    }, this);
    newOrder.addEndEvent(function() {
        this.removeOrder(newOrder);
    }, this);
    dropDown.addChild(newOrder);
    this.activeOrders_.push(newOrder);

    // If the menu is currently open, slide it down to reveal the newly added order.
    if(dropDown.open_) {
        dropDown.open(this.numOrders());
    }
};

/**
 * @param order The order to remove.
 */
OrderManager.prototype.removeOrder = function(order) {
    var index = this.activeOrders_.indexOf(order)
    if(index >= this.maxOrders_ || index === null) {
        return;
    }
    this.activeOrders_.splice(index, 1);
    if(order.expiring) {
        this.expiringOrders_ -= 1;
        if(this.expiringOrders_ === 0) {
            this.game.musicManager.toggleEmergency();
        }
    }
    order.kill();
    // If the menu is currently open, slide it up to hide the empty slot.
    var dropDown = this.game.state.dropDown;
    var numOrders = this.numOrders();
    if(dropDown.open_) {
        dropDown.open(numOrders);
    }
    if (numOrders === 0) {
        return;
    }
    // Shift all the other orders' positions to fill the gap.
    for(var i = index; i < numOrders; i++) {
        this.activeOrders_[i].y = -(TAB_SIZE + SPACING * (i+1));
    }
};

OrderManager.prototype.submitOrder = function(drink) {
    for(var i = 0; i < this.numOrders(); i++) {
        var order = this.activeOrders_[i];
        if(order.checkOrder(drink)) {
            this.game.musicManager.decreaseStem();
            order.timer_.stop();
            this.removeOrder(order);
            game.sound.play('orderSuccess');
            this.game.state.score.addScore(order.price);
            drink.kill();
            return;
        }
    }
    game.sound.play('orderFail');
    game.state.score.removeLife();
    drink.kill();
};