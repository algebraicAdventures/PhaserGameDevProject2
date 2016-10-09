/**
 * Created by wrighp on 10/5/2016.
 */

var FLOOR_HEIGHT = 750;
var WALL_BOUNCE = .5; //velocity transferred after hitting a wall, < 0 reduces velocity
var heldObject; //object being dragged, null if no object is being dragged. Used for trigger collision in play.

draggableObject = function(game, x, y, image){
    Phaser.Sprite.call(this, game, x, y, image);
    //custom variables
    this.dragged = false;
    this.inputEnabled = true;
    this.input.enableDrag(true); //False means it does NOT snap to center
    this.input.useHandCursor = true;
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
        //Check if object will move off screen in this frame, if so reverse it's velocity and multiply it by WALL_BOUNCE;
        var onScreen = Math.floor(this.x / game.width);
        var cameraScreen = Math.floor(game.camera.x/game.width);
        var newScreen = Math.floor((this.x + this.body.velocity.x * game.time.physicsElapsed + Math.sign(this.body.velocity.x)*this.width*.5)/game.width);
        if(newScreen != onScreen){
            this.body.velocity.x *= -1 * WALL_BOUNCE;
            //Play bounce sound
            //this.bouncesound
        }
    }

    //Perform physics after
    Phaser.Graphics.prototype.preUpdate.call(this);
};

var lastPosition = {x : 0, y: 0}; //For dragging
var dragAmount = {x : 0, y: 0};

draggableObject.prototype.update = function(){
    var deltaTime = game.time.elapsed / 1000;
    if(this.dragged){ //Called if object is being dragged, here it checks for hovering over an arrow

        //Used to be called onDragUpdate, but the frequency was based on the poll rate of your device, which was inconsistent
        dragAmount.x = (this.x - lastPosition.x)*deltaTime *.5 + dragAmount.x*.5; //New frame drag for this frame is a weighted average of previous frames
        dragAmount.y = (this.y - lastPosition.y)*deltaTime *.5 + dragAmount.y*.5;
        lastPosition.x = this.x
        lastPosition.y = this.y;

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
        var drag = this.y < heightStop ? 100 : .2; //Has less drag when in the air.
        this.body.velocity.x *= 1.0 - Math.min(deltaTime / drag,1);
    }
};

draggableObject.onDragStart = function(sprite, pointer, dragX, dragY, snapPoint){
    sprite.dragged = true;
    heldObject = sprite;
};

draggableObject.onDragUpdate = function(sprite, pointer, dragX, dragY, snapPoint){

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
        var DRAG_STRENGTH = 2000;
        var MAX_FORCE = 1500;
        sprite.dragged = false;
        var vector = new Phaser.Point(dragAmount.x , dragAmount.y);
        var force = Phaser.Math.clamp(vector.getMagnitude()*DRAG_STRENGTH, -MAX_FORCE, MAX_FORCE);
        vector = vector.normalize().multiply(force,force);
        sprite.body.velocity.add(vector.x,vector.y);
    }
};