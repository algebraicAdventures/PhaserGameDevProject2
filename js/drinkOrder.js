DrinkOrder = function(game, x, y, timeLimit) {
    Phaser.Sprite.call(this, game, x, y);

    this.timer_ = new Phaser.Timer(game, /* autoDestroy */ false);
    this.signal_ = new Phaser.Signal();

    this.timerText_ = this.addChild(new Phaser.Text(game, x, y, timeLimit.toString(), {
        align: 'center',
        fill: 'white',
    }));
    this.timer_.add(timeLimit, function() {
        console.log('wtf');
    });
    this.timer_.start();
    console.log(this.timer_);
    // Populate with drink order requirements when we figure out how we're representing that.
};
DrinkOrder.prototype = Object.create(Phaser.Sprite.prototype); /* Do we make this a sprite group? */
DrinkOrder.prototype.constructor = DrinkOrder;

DrinkOrder.prototype.update = function() {
    Phaser.Sprite.prototype.update.call(this);
    console.log(this.timer_.duration);
    this.timerText_.text = this.timer_.duration;
};

DrinkOrder.prototype.onTimerEnd = function() {
    console.log("hello?");
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
