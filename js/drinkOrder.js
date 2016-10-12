var TEXT_OFFSET_VERTICAL = 11;
var TEXT_OFFSET_HORIZONTAL = -192;
var ORDER_OFFSET_HORIZONTAL = -75;
var ORDER_OFFSET_VERTICAL = 45;
var ICON_SPACING = 55;
var CRUNCH_TIME = 10000; // 10 seconds left triggers emergency music

DrinkOrder = function(game, x, y, timeLimit, components) {
    Phaser.Sprite.call(this, game, x, y, 'order');
    this.anchor.set(0.5, 0);

    this.timeLimit_ = timeLimit;
    this.timer_ = game.time.create(false);
    this.doneSignal_ = new Phaser.Signal();
    this.crunchSignal_ = new Phaser.Signal();

    this.timerText_ = this.addChild(new Phaser.Text(game, TEXT_OFFSET_HORIZONTAL, TEXT_OFFSET_VERTICAL, util.formatTime(timeLimit), {
        align: 'center',
        fill: 'white',
    }));
    this.timerText_.anchor.set(0.5, 0);
    this.timer_.add(timeLimit - CRUNCH_TIME, this.onCrunchTime, this);
    this.timer_.add(timeLimit, this.onTimerEnd, this);
    this.timer_.start();
    this.expiring = false;

    // Order components
    this.components_ = {
        cup: components.cup,
        temp: components.temp,
    };
    this.price = components.price;

    // Add icons to order components
    var image;
    switch(this.components_.cup) {
        case(CoffeeCup.Type.GLASS):
            image = 'GlassCup'; break;
        case(CoffeeCup.Type.PAPER):
            image = 'PaperCup'; break;
    }
    var sprite = game.make.sprite(ORDER_OFFSET_HORIZONTAL + ICON_SPACING, ORDER_OFFSET_VERTICAL, image);
    sprite.anchor.set(0.5, 1);
    sprite.scale.setTo(0.25, 0.25);
    this.addChild(sprite);

    switch(this.components_.temp) {
        case(CoffeeCup.Temp.COLD):
            image = 'cold'; break;
        case(CoffeeCup.Temp.HOT):
            image = 'hot'; break;
    }
    sprite = game.make.sprite(ORDER_OFFSET_HORIZONTAL + ICON_SPACING*2, ORDER_OFFSET_VERTICAL, image);
    sprite.anchor.set(0.5, 1);
    this.addChild(sprite);
};
DrinkOrder.prototype = Object.create(Phaser.Sprite.prototype); /* Do we make this a sprite group? */
DrinkOrder.prototype.constructor = DrinkOrder;

DrinkOrder.prototype.update = function() {
    Phaser.Sprite.prototype.update.call(this);
    this.timerText_.text = util.formatTime(this.timeLimit_ - this.timer_.ms);
};

DrinkOrder.prototype.onTimerEnd = function() {
    this.doneSignal_.dispatch(this);
    this.game.state.score.removeLife();
    this.game.sound.play('orderFail', 0.9);
    this.kill();
};

DrinkOrder.prototype.onCrunchTime = function() {
    this.timerText_.setStyle({
        fill: '#222222'
    });
    this.expiring = true;
    game.add.tween(this.timerText_).to({alpha: 0.5}, TEXT_FLICKER_RATE, Phaser.Easing.Sinusoidal.InOut,true,0,3,true);
    this.crunchSignal_.dispatch(this);
};

/**
 * Adds an event for when the timer expires.
 * @param callback Function to call when the timer expires
 * @param context The context in which the callback is called
 */
DrinkOrder.prototype.addEndEvent = function(callback, context) {
    this.doneSignal_.add(callback, context);
};

/**
 * Adds an event for when crunch time starts.
 * @param callback Function to call when the timer eis at crunch time
 * @param context The context in which the callback is called
 */
DrinkOrder.prototype.addCrunchEvent = function(callback, context) {
    this.crunchSignal_.add(callback, context);
};


/**
 * Returns true if the drink matches the order requirements.
 * @param drink coffeeCup sprite to check for accuracy.
 */
DrinkOrder.prototype.checkOrder = function(drink) {
    var d = drink.components_;
    var o = this.components_;
    if (d.cup !== o.cup) {
        return false;
    } else if (d.temp !== o.temp) {
        return false;
    } else if (!drink.isFull()) {
        return false;
    }
    return true;
};

/**
 * returns the components for a randomly generated order
 */
DrinkOrder.randomOrderReq = function() {
    return {
        cup: game.rnd.integerInRange(0, 1),
        temp: game.rnd.integerInRange(0, 1)
    };
};