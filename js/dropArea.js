/**
 * Created by Patrick on 10/9/2016.
 */
dropArea = function(game, x, y, name){
    Phaser.Sprite.call(this, game, x, y, 'dashedBox');
    this.name = name;
    this.tint = 0x888888;
    this.anchor.set(.5,0);
    this.alpha = 55;
    game.physics.arcade.enable(this);
    game.state.triggers.push(this);
};
dropArea.prototype = Object.create(Phaser.Sprite.prototype);
dropArea.prototype.constructor = dropArea;
dropArea.prototype.update = function() {

};