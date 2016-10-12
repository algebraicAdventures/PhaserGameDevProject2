var Garbage = function(game) {
    this.name = 'garbage';
    Phaser.Sprite.call(this, game, game.width - 4, 4, 'garbage');
    game.physics.arcade.enable(this);
    game.state.triggers.push(this);
    this.anchor.set(1, 0);
    this.hovered = false;
};
Garbage.prototype = Object.create(Phaser.Sprite.prototype);
Garbage.prototype.constructor = Garbage;
Garbage.prototype.update = function() {
    if(DEBUG_INFO)game.debug.body(this);
    var size = this.hovered ? 1.25 : 1;
    this.scale.set(size,size);
    var squareSize = size*size;
    //In order to keep the dimensions the right size;
    var HITBOX_SCALE = .75;
    this.body.setSize(this.width/squareSize * HITBOX_SCALE, this.height/squareSize * HITBOX_SCALE,-this.width/squareSize * (HITBOX_SCALE-size));
    this.hovered = false;
};