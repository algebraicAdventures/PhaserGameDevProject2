/**
 * Created by wrighp on 10/4/2016.
 */
testObject = function(game, x, y){
    draggableObject.call(this, game, x, y, 'testSprite');

};

testObject.prototype = Object.create(draggableObject.prototype);
testObject.prototype.constructor = testObject;