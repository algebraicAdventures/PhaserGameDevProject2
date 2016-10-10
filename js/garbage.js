var Garbage = function(game) {
    this.name = 'garbage';
    Phaser.Sprite.call(this, game, game.width - 4, 4, 'garbage');
    game.physics.arcade.enable(this);
    game.state.triggers.push(this);
    this.anchor.set(1, 0);
};
Garbage.prototype = Object.create(Phaser.Sprite.prototype);
Garbage.prototype.constructor = Garbage;