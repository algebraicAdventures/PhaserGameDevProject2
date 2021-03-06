/**
 * Created by Patrick on 10/5/2016.
 */
var CAMERA_TWEEN_TIME = 333;
var DELAY_TIME = .5;
slideButton = function(game, x, y, direction){
    Phaser.Sprite.call(this, game, x, y, 'testArrow');
    this.name = "slideButton";
    this.direction = direction;
    this.anchor.set(1,.5);
    this.canUse = true;
    if(direction <= 0){
        this.scale.x = -1;
    }
    this.inputEnabled = true;
    game.physics.arcade.enable(this);
    game.state.triggers.push(this);
    this.intervalTime = 0;
    var scale = .4;
    //The bounding box looks off, but that's because the scale X scal is negative
    this.body.setSize(this.width * scale,this.height * scale , this.width*(1 -scale) *this.scale.x, this.height*(.5 -scale*.5));
    this.events.onInputDown.add(slideButton.onInputDown);
    this.input.useHandCursor = true;
};

slideButton.prototype = Object.create(Phaser.Sprite.prototype);
slideButton.prototype.constructor = slideButton;

slideButton.prototype.update = function() {
    if(DEBUG_INFO) game.debug.body(this);
    var camera = game.camera;
    this.visible = Phaser.Rectangle.containsPoint(camera.bounds,new Phaser.Point(camera.x + this.direction,camera.y));
    if(this.intervalTime > 0){
        this.intervalTime= Math.max( this.intervalTime - deltaTime,0);
        this.canUse = false;
    }
    else {
        this.canUse = this.visible;
    }
};
slideButton.onInputDown = function(button){
    slideButton.triggerButton(button);
};
//Returns true if button was interacted with or not
slideButton.triggerButton = function(button, sprite){
    if(button.canUse && (sprite == null || checkOverlap(button,sprite))){
        game.state.cameraGoal += button.direction;
        game.add.tween(game.camera).to({x: game.state.cameraGoal}, CAMERA_TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
        game.add.tween(game.state.backgroundLayer.cameraOffset).to({x: -game.state.cameraGoal*BACKGROUND_PARALLAX}, CAMERA_TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
        //game.state.backgroundLayer.cameraOffset.x
        if(sprite != null && checkOverlap(button,sprite)){
            button.intervalTime = DELAY_TIME; //A delay in between button tweens
        }
        return true;
    }
    else{
        return false;
    }
};
