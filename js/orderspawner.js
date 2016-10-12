var OrderSpawner = function(game) {
    this.timer_ = game.time.create(false);
    this.orderManager_ = game.state.orderManager;

    // Set scripted orders
    for(var i = 0; i < SCRIPTED_ORDERS.length; i++) {
        var scriptedOrder = SCRIPTED_ORDERS[i];
        this.timer_.add(scriptedOrder.spawnTime, function() {
            this.orderManager_.addOrder({
                temp: scriptedOrder.temperature,
                cup: scriptedOrder.cup,
                price: scriptedOrder.price
            }, scriptedOrder.timeLimit);
        }, this);
    }
};

OrderSpawner.prototype.start = function() {
    this.timer_.start();
    console.log('orders incoming!');
};