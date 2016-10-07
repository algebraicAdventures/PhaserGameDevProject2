/**
 * Created by wrighp on 10/5/2016.
 */

var FLOOR_HEIGHT = 750;
var WALL_BOUNCE = 1;
var heldObject; //object being dragged, null if no object is being dragged

draggableObject = function(game, x, y, image){
    if(image == null) image = 'testSprite';
    Phaser.Sprite.call(this, game, x, y, image);
    //custom variables
    this.dragged = false;

    this.inputEnabled = true;
    this.input.enableDrag(true); //False means it does NOT snap to center
    game.physics.arcade.enable(this);
    this.anchor.set(.5,.5); //Remember we moved the anchor

    this.events.onDragStart.add(draggableObject.onDragStart);
    this.events.onDragUpdate.add(draggableObject.onDragUpdate);
    this.events.onDragStop.add(draggableObject.onDragStop);

};

draggableObject.prototype = Object.create(Phaser.Sprite.prototype);
draggableObject.prototype.constructor = draggableObject;

draggableObject.prototype.preUpdate = function(){
    //Objects bounding off of walls
    if(!this.dragged){
        var onScreen = Math.floor(this.x / game.width);
        var cameraScreen = Math.floor(game.camera.x/game.width);
        var newScreen = Math.floor((this.x + this.body.velocity.x * game.time.physicsElapsed)/game.width);
        if(newScreen != onScreen){
            this.body.velocity.x *= -1 * WALL_BOUNCE;
            //Play bounce sound
            //this.bouncesound
        }
    }

    //Perform physics after
    Phaser.Graphics.prototype.preUpdate.call(this);
};

draggableObject.prototype.update = function(){
    var deltaTime = game.time.elapsed / 1000;
    if(this.dragged){ //Called if object is being dragged, here it checks for hovering over an arrow
        this.body.velocity.set(0,0);
        var hudElements = game.state.hudLayer.children;
        for (var i = 0; i < hudElements.length; i++) {
            if(hudElements[i].name === "slideButton"){
                if(slideButton.triggerButton(hudElements[i], this)){
                    hudElements[i].intervalTime = .5;
                    this.x += hudElements[i].direction;
                }
            }
        }
    }
    else{
        //"Physics"
        this.body.velocity.y += 2000 * deltaTime;
        var heightStop = FLOOR_HEIGHT - this.height * (1 - this.anchor.y);
        if(this.y >= heightStop){
            this.y = heightStop;
            this.body.velocity.y = 0;
            //this.body.acceleration.y = 0;
        }
        var drag = this.y < heightStop ? 1 : .2; //Has less drag when in the air.
        this.body.velocity.x *= 1.0 - Math.min(deltaTime / drag,1);
    }

};

draggableObject.onDragStart = function(sprite, pointer, dragX, dragY, snapPoint){
    sprite.dragged = true;
    heldObject = sprite;
};
var lastPosition = {x : 0, y: 0};
var dragAmount = {x : 0, y: 0};
draggableObject.onDragUpdate = function(sprite, pointer, dragX, dragY, snapPoint){
    dragAmount.x = dragX - lastPosition.x;
    dragAmount.y = dragY - lastPosition.y;
    lastPosition.x = dragX;
    lastPosition.y = dragY;
};

//Return true if interaction happens, return false if object should be thrown
draggableObject.prototype.dragStopped = function(sprite,pointer){return false;}
draggableObject.onDragStop = function(sprite, pointer){
    //Check for overlap with things here
    heldObject = null;
    if(draggableObject.prototype.dragStopped(sprite, pointer)){

    }
    else {
        //Else throw
        //Can have different forces for heavier objects (or different drag)
        var DRAG_STRENGTH = 100;
        var MAX_FORCE = 1000;
        sprite.dragged = false;
        sprite.body.velocity.add(Phaser.Math.clamp(dragAmount.x * DRAG_STRENGTH, -MAX_FORCE, MAX_FORCE), Phaser.Math.clamp(dragAmount.y * DRAG_STRENGTH, -MAX_FORCE, MAX_FORCE));
    }
};