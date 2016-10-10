var Garbage = function(game) {
    Phaser.Sprite.call(this, game, game.width - 4, 4, 'garbage');
    this.anchor.set(1, 0);
};
Garbage.prototype = Object.create(Phaser.Sprite.prototype);
Garbage.prototype.constructor = Garbage;