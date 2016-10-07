/**
 * Created by Patrick on 10/7/2016.
 */

beanGrinder = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'grinder');
    this.name = "grinder";
    this.extended = true;
    this.anchor.set(.5,1);
    this.inputEnabled = true;
    game.physics.arcade.enable(this);
    this.body.immovable = true;

    //game.debug.body(spritename);
};

beanGrinder.prototype = Object.create(Phaser.Sprite.prototype);
beanGrinder.prototype.constructor = beanGrinder;

beanGrinder.prototype.update = function() {

};
