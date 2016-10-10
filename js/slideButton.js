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

    this.intervalTime = 0;
    this.events.onInputDown.add(slideButton.onInputDown);
    this.input.useHandCursor = true;
};

slideButton.prototype = Object.create(Phaser.Sprite.prototype);
slideButton.prototype.constructor = slideButton;

slideButton.prototype.update = function() {
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
        game.add.tween(button.game.camera).to({x: game.state.cameraGoal}, CAMERA_TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
        if(sprite != null && checkOverlap(button,sprite)){
            button.intervalTime = DELAY_TIME; //A delay in between button tweens
        }
        return true;
    }
    else{
        return false;
    }
};
