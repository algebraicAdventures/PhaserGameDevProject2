/**
 * Created by wrighp on 10/5/2016.
 */


draggableObject = function(game, x, y){

    Phaser.Sprite.call(this, game, x, y, 'testSprite');
    this.dragged = false;
    this.inputEnabled = true;
    this.input.enableDrag(true); //False means it does NOT snap to center
    this.game.physics.arcade.enable(this);
    this.anchor.set(.5,1); //Remember we moved the anchor
    this.events.onDragStart.add(draggableObject.onDragStart);
    this.events.onDragUpdate.add(draggableObject.onDragUpdate);
    this.events.onDragStop.add(draggableObject.onDragStop);

};

draggableObject.prototype = Object.create(Phaser.Sprite.prototype);
draggableObject.prototype.constructor = draggableObject;

draggableObject.prototype.preUpdate = function(){
    //Objects bounding off of walls
    if(!this.dragged){
        var onScreen = Math.floor(this.x / this.game.width);
        var cameraScreen = Math.floor(this.game.camera.x/this.game.width);
        var newScreen = Math.floor((this.x + this.body.velocity.x * this.game.time.physicsElapsed)/this.game.width);
        if(newScreen != onScreen){
            this.body.velocity.x *= -1;
        }
    }

    //Perform physics after
    Phaser.Graphics.prototype.preUpdate.call(this);
};

draggableObject.prototype.update = function(){
    var deltaTime = this.game.time.elapsed / 1000;
    var floorHeight = 600;
    if(this.dragged){
        this.body.velocity.set(0,0);
        var hudElements = this.game.hudLayer.children;
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

        if(this.body.velocity.x + this.x)

        this.body.velocity.y += 2000 * deltaTime;
        if(this.y >= floorHeight){
            this.y = floorHeight;
            this.body.velocity.y = 0;
            //this.body.acceleration.y = 0;
        }
        var drag = this.y < floorHeight ? 1 : .2; //Has less drag when in the air.
        this.body.velocity.x *= 1.0 - Math.min(deltaTime / drag,1);
    }

};

draggableObject.onDragStart = function(sprite, pointer, dragX, dragY, snapPoint){
    sprite.dragged = true;
};
var lastPosition = {x : 0, y: 0};
var dragAmount = {x : 0, y: 0};
draggableObject.onDragUpdate = function(sprite, pointer, dragX, dragY, snapPoint){
    dragAmount.x = dragX - lastPosition.x;
    dragAmount.y = dragY - lastPosition.y;
    lastPosition.x = dragX;
    lastPosition.y = dragY;

    //Check for overlap with things here

};

draggableObject.onDragStop = function(sprite, pointer){
    var dragStrength = 100;
    var maxForce = 1000;
    sprite.dragged = false;
    sprite.body.velocity.add(Phaser.Math.clamp(dragAmount.x*dragStrength,-maxForce,maxForce),Phaser.Math.clamp(dragAmount.y*dragStrength,-maxForce,maxForce));
};