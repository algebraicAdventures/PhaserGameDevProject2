/**
 * Created by wrighp on 10/5/2016.
 */

coffeeCup = function(game, x, y){
    draggableObject.call(this, game, x, y, 'testSprite');
};

coffeeCup.prototype = Object.create(draggableObject.prototype);
coffeeCup.prototype.constructor = coffeeCup;

coffeeCup.prototype.update = function(){
    draggableObject.prototype.update.call(this);

    var deltaTime = game.time.elapsed / 1000;
};

//Return true if interaction happens, return false if object should be thrown
coffeeCup.prototype.dragStopped = function(sprite,pointer){
    return false;
}