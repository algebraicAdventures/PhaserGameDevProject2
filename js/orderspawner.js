var OrderSpawner = function(game) {
    this.timer_ = new Phaser.Timer(game, false);
};

OrderSpawner.prototype.start = function() {
    this.timer_.start();
    console.log('orders incoming!');
};