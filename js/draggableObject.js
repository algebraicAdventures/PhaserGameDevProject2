/**
 * Created by wrighp on 10/5/2016.
 */


draggableObject = function(game, x, y){

    Phaser.Sprite.call(this, game, x, y, 'testSprite');
    this.dragged = false;
    this.inputEnabled = true;
    this.input.enableDrag(true); //False means it does NOT snap to center
    this.game.physics.arcade.enable(this);
    this.anchor.set(.5,1); //Remember we moved the achor
    this.events.onDragStart.add(onDragStart);
    this.events.onDragUpdate.add(onDragUpdate);
    this.events.onDragStop.add(onDragStop);

};

draggableObject.prototype = Object.create(Phaser.Sprite.prototype);
draggableObject.prototype.constructor = draggableObject;

draggableObject.prototype.update = function(){
    var delta = this.game.time.elapsed;
    if(this.dragged){
        this.body.velocity.set(0,0);
    }
    else{
        this.body.velocity.y += 1300 / delta;
        if(this.y >= 500){
            this.y = 500;
            this.body.velocity.y = 0;
            //this.body.acceleration.y = 0;
        }
    }
    this.body.velocity.x *= 1.0 - (1.0 / delta);
};

function onDragStart(sprite, pointer, dragX, dragY, snapPoint){
    sprite.dragged = true;
}
var lastPosition = {x : 0, y: 0};
var dragAmount = {x : 0, y: 0};
function onDragUpdate(sprite, pointer, dragX, dragY, snapPoint){
    dragAmount.x = dragX - lastPosition.x;
    dragAmount.y = dragY - lastPosition.y;
    lastPosition.x = dragX;
    lastPosition.y = dragY;
}
function onDragStop(sprite, pointer){
    sprite.dragged = false;
    sprite.body.velocity.add(Phaser.Math.clamp(dragAmount.x*100,-1000,1000),Phaser.Math.clamp(dragAmount.y*100,-1000,1000));
}
