/**
 * Order manager logic.
 */
var TAB_SIZE = 42;
var SPACING = 81;
var OFFSET = 9;
var TWEEN_TIME = 333;
var TEXT_VISIBLE_TIME = 3; //Should be a multiple of TEXT_FLICKER_RATE
var TEXT_FLICKER_RATE = 500;
var PEEK_TIME = 4000; // How long does the menu stay open when warning about the time

var OrderManager = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'dropdownImage');
    this.game = game;
    this.name = "dropdown";
    this.y = TAB_SIZE;
    this.anchor.set(0.5, 1);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.game.physics.arcade.enable(this);
    this.events.onInputDown.add(OrderManager.onTap);

    // Custom properties
    this.open_ = false;
    this.maxOrders_ = 5;
    this.activeOrders_ = [];
    this.expiringOrders_ = 0;

    //Manually centered
    this.textAlert =this.addChild(new Phaser.Text(this.game,-68,20,"New Order.",{fill: '#222222', align: 'center'}));
    this.textAlert.alpha = 1;
    this.textAlertTime = 0;
};

OrderManager.prototype = Object.create(Phaser.Sprite.prototype);
OrderManager.prototype.constructor = OrderManager;

OrderManager.prototype.update = function() {
    Phaser.Group.prototype.update.call(this);
    this.textAlertTime = Math.max(this.textAlertTime - deltaTime, 0);
    this.textAlert.visible = this.textAlertTime > 0;
};

/**
 * @return int Number of active orders.
 */
OrderManager.prototype.numOrders = function() {
    return this.activeOrders_.length;
};

OrderManager.prototype.addOrder = function(components, timeLimit) {
    var numOrders = this.numOrders();
    if(numOrders >= this.maxOrders_) {
        return;
    }
    game.sound.play("bell",.75);
    game.musicManager.increaseStem(0.25);
    if (!this.open_) {
        this.textAlertTime = TEXT_VISIBLE_TIME;
        this.textAlert.alpha = 0; //Reset text alert
        game.add.tween(this.textAlert).to({alpha: 1}, TEXT_FLICKER_RATE, Phaser.Easing.Sinusoidal.InOut,true,0,3,true);
    }
    var newOrder = new DrinkOrder(this.game, 0, -(TAB_SIZE + SPACING * (numOrders + 1)) + OFFSET, timeLimit, components);
    newOrder.anchor.set(0.5, 0);
    newOrder.addCrunchEvent(function() {
        if(this.expiringOrders_ === 0) {
            this.game.musicManager.toggleEmergency();
        }
        this.expiringOrders_ += 1;
        if(!this.open_) {
            this.open(this.activeOrders_.indexOf(newOrder));
            var that = this;
            window.setTimeout(function() {
                that.close();
            }, PEEK_TIME);
        }
    }, this);
    newOrder.addEndEvent(function() {
        this.removeOrder(newOrder);
    }, this);
    this.addChild(newOrder);
    this.activeOrders_.push(newOrder);

    // If the menu is currently open, slide it down to reveal the newly added order.
    if(this.open_) {
        this.open();
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
    if(this.open_) {
        this.open();
    }
    var numOrders = this.numOrders();
    if (numOrders == 0) {
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
            this.game.musicManager.decreaseStem(0.25);
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

OrderManager.prototype.toggle = function() {
    this.open_ ? this.close() : this.open();
    //Turn off alert when opening
    if(this.open_) this.textAlertTime = 0;
};

/**
 * @param openNumber number of orders to show.
 * If undefined, the menu will open to however many orders there are.
 * If there are also no active orders, the menu will only slide to one space.
 */
OrderManager.prototype.open = function(openNumber) {
    openNumber = openNumber === undefined ? this.numOrders() : openNumber;
    openNumber = openNumber === 0 ? 1 : openNumber;
    var goal = SPACING * openNumber + TAB_SIZE;
    this.game.add.tween(this).to({y: goal}, TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
    this.open_ = true;
};

OrderManager.prototype.close = function() {
    this.game.add.tween(this).to({y: TAB_SIZE}, TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
    this.open_ = false;
};

/**
 * Event handler for tapping the dropdown.
 */
OrderManager.onTap = function(sprite, _) {
    sprite.toggle();
};