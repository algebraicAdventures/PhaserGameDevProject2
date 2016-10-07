DrinkOrder = function(game, x, y, timeLimit) {
    Phaser.Sprite.call(this, game, x, y);

    this.timer_ = game.time.create(false);
    this.signal_ = new Phaser.Signal();

    this.timerText_ = this.addChild(new Phaser.Text(game, x, y, util.formatTime(timeLimit), {
        align: 'center',
        fill: 'white',
    }));
    this.timer_.add(timeLimit, this.onTimerEnd, this);
    this.timer_.start();
    // Populate with drink order requirements when we figure out how we're representing that.
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
 */
DrinkOrder.prototype.addEvent = function(callback, context) {
    this.signal_.add(callback, context);
};