var OrderManager = function(game) {
    this.timer_ = new Phaser.Timer(game, false);
};

OrderManager.prototype.start = function() {
    this.timer_.start();
}