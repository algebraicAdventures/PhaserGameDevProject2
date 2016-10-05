/**
 * Created by wrighp on 10/5/2016.
 */

draggableObject = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'testSprite');
    //
}

draggableObject.prototype = Object.create(Phaser.Sprite.prototype);
draggableObject.prototype.constructor = draggableObject;

draggableObject.prototype.update = function(){

}