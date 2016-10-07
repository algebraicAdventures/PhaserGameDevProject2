/**
 * Created by Patrick on 10/5/2016.
 */



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
};

slideButton.prototype = Object.create(Phaser.Sprite.prototype);
slideButton.prototype.constructor = slideButton;

slideButton.prototype.update = function() {
    var camera = game.camera;
    this.visible = Phaser.Rectangle.containsPoint(camera.bounds,new Phaser.Point(camera.x + this.direction,camera.y));
    if(this.intervalTime > 0){
        var deltaTime = game.time.elapsed /1000;
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
slideButton.triggerButton = function(button, sprite){
    if(button.canUse && (sprite == null || checkOverlap(button,sprite))){
        button.game.camera.x += button.direction;
        return true;
    }
    else{
        return false;
    }
};
