var OrderSpawner = function(game) {
    this.game = game;
    this.timer_ = game.time.create(false);
    this.spawnTimer_ = null;
    this.orderManager_ = game.state.orderManager;

    // Current game settings
    this.currentPrice_ = SPAWN_SPECS[0].price;
    this.currentMinSpawnRate_ = SPAWN_SPECS[0].spawnRate.min;
    this.currentMaxSpawnRate_ = SPAWN_SPECS[0].spawnRate.max;
    this.currentTimeLimit_ = SPAWN_SPECS[0].timeLimit;
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
        this.marker_ += scriptedOrder.spawnTime;
    }
    this.marker_ += BETWEEN_TIME;
    // Set difficulty changes
    this.timer_.add(this.marker_, this.spawnOrder, this);
    for(i = 0; i < SPAWN_SPECS.length; i++) {
        var spawnSpec = SPAWN_SPECS[i];
        this.timer_.add(this.marker_, function() {
            that.currentPrice_ = this.price;
            that.currentMinSpawnRate_ = this.spawnRate.min;
            that.currentMaxSpawnRate_ = this.spawnRate.max;
            that.currentTimeLimit_ = this.timeLimit;
        }, spawnSpec);
        this.timer_.add(this.marker_, function() {
            this.game.state.machine.needsReboot = true;
        }, this);
        this.marker_ += spawnSpec.duration;
    }
};

OrderSpawner.prototype.start = function() {
    this.timer_.start();
};

OrderSpawner.prototype.spawnOrder = function() {
    this.orderManager_.addOrder({
        cup:  game.rnd.integerInRange(0, 1),
        temp: game.rnd.integerInRange(0, 1),
        price: this.currentPrice_
    }, this.currentTimeLimit_);
    this.spawnTimer_ = this.game.time.create(true);
    var nextTime = this.game.rnd.integerInRange(this.currentMinSpawnRate_, this.currentMaxSpawnRate_);
    this.spawnTimer_.add(nextTime, this.spawnOrder, this);
    this.spawnTimer_.start();
};

OrderSpawner.prototype.stop = function() {
    if(this.spawnTimer_ !== null) {
        this.spawnTimer_.stop();
    }
    this.timer_.stop();
};