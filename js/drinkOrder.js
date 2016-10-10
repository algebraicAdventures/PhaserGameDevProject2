DrinkOrder = function(game, x, y, timeLimit, components) {
    Phaser.Sprite.call(this, game, x, y, 'order');
    this.anchor.set(0.5, 0);

    this.timer_ = game.time.create(false);
    this.signal_ = new Phaser.Signal();

    this.timerText_ = this.addChild(new Phaser.Text(game, -192, 11, util.formatTime(timeLimit), {
        align: 'center',
        fill: 'white',
    }));
    this.timerText_.anchor.set(0.5, 0);
    this.timer_.add(timeLimit, this.onTimerEnd, this);
    this.timer_.start();

    // Order components
    this.components_ = {
        volume: components.volume,
        temp: components.temp
    };
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
    if (d.volume !== o.volume) {
        return false;
    } else if (d.temp !== o.temp) {
        return false;
    }
    return true;
};