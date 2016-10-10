var TEXT_OFFSET_VERTICAL = 11;
var TEXT_OFFSET_HORIZONTAL = -192;
var ORDER_OFFSET_HORIZONTAL = -75;
var ORDER_OFFSET_VERTICAL = 45;
var ICON_SPACING = 55;

DrinkOrder = function(game, x, y, timeLimit, components) {
    Phaser.Sprite.call(this, game, x, y, 'order');
    this.anchor.set(0.5, 0);

    this.timer_ = game.time.create(false);
    this.signal_ = new Phaser.Signal();

    this.timerText_ = this.addChild(new Phaser.Text(game, TEXT_OFFSET_HORIZONTAL, TEXT_OFFSET_VERTICAL, util.formatTime(timeLimit), {
        align: 'center',
        fill: 'white',
    }));
    this.timerText_.anchor.set(0.5, 0);
    this.timer_.add(timeLimit, this.onTimerEnd, this);
    this.timer_.start();

    // Order components
    this.components_ = {
        cup: components.cup,
        temp: components.temp
    };

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
    var timeLeft = this.timer_.duration;
    if (timeLeft < 5000) {
        this.timerText_.text.fillColor = 'red';
    }
    this.timerText_.text = util.formatTime(this.timer_.duration);
};

DrinkOrder.prototype.onTimerEnd = function() {
    this.signal_.dispatch(this);
    this.game.state.score.removeLife();
    this.game.sound.play('orderFail', 0.9);
    this.kill();
};

/**
 * Adds an event for when the timer expires.
 * @param callback Function to call when the timer expires
 * @param context The context in which the callback is called
 */
DrinkOrder.prototype.addEvent = function(callback, context) {
    this.signal_.add(callback, context);
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