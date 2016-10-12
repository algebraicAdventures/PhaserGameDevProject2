var OrderSpawner = function(game) {
    this.game = game;
    this.timer_ = game.time.create(false);
    this.orderManager_ = game.state.orderManager;

    // Current game settings
    this.currentPrice_ = 0;
    this.currentMinSpawnRate_ = 0;
    this.currentMaxSpawnRate_ = 0;
    this.currentTimeLimit_ = 0;
    this.marker_ = 0;

    // Set scripted orders
    var that = this;
    for(var i = 0; i < SCRIPTED_ORDERS.length; i++) {
        var scriptedOrder = SCRIPTED_ORDERS[i];
        this.timer_.add(scriptedOrder.spawnTime, function() {
            that.orderManager_.addOrder({
                temp: this.temperature,
                cup: this.cup,
                price: this.price
            }, this.timeLimit);
        }, scriptedOrder);
    }

    //
    this.timer_.add(this.marker_, this.spawnOrder, this);
    // Set difficulty changes
    for(i = 0; i < SPAWN_SPECS.length; i++) {
        var spawnSpec = SPAWN_SPECS[i];
        this.timer_.add(this.marker_, function() {
            that.currentPrice_ = this.price;
            that.currentMinSpawnRate_ = this.spawnRate.min;
            that.currentMaxSpawnRate_ = this.spawnRate.max;
            that.currentTimeLimit_ = this.timeLimit;
            console.log(that.timer_.ms);
        }, spawnSpec);
        this.marker_ += spawnSpec.duration;
    }
};

OrderSpawner.prototype.start = function() {
    this.timer_.start();
    console.log('orders incoming!');
};

OrderSpawner.prototype.spawnOrder = function() {
    this.orderManager_.addOrder({
        cup:  game.rnd.integerInRange(0, 1),
        temp: game.rnd.integerInRange(0, 1),
        price: this.currentPrice_
    });
    var spawnTimer = this.game.time.create(true);
    var nextTime = this.game.rnd.integerInRange(this.currentMinSpawnRate_, this.currentMaxSpawnRate_);
    spawnTimer.add(nextTime, this.spawnOrder, this);
};