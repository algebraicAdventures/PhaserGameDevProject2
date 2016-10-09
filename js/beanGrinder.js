/**
 * Created by Patrick on 10/7/2016.
 */

beanGrinder = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'grinder');
    this.name = "grinder";
    this.extended = true;
    this.anchor.set(.5,1);
    //this.inputEnabled = true;
    //game.physics.arcade.enable(this);
    //this.body.immovable = true;
    this.addChild(new grinderHandle(game,0,-this.height+328));
};

beanGrinder.prototype = Object.create(Phaser.Sprite.prototype);
beanGrinder.prototype.constructor = beanGrinder;
beanGrinder.prototype.update = function() {
    for(var i = 0; i < this.children.length; i++){
        this.children[i].update();
        if(DEBUG_INFO) this.game.debug.body(this.children[i]);
    }
};
grinderHandle = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'grinderHandle');
    this.name = "grinderHandle";
    this.anchor.set(.5,0.70454545454); // /r/theydidthemath
    this.inputEnabled = true;
    //this.game.physics.p2.enable(this);
    //this.body.setSize(40,40,0,104);
    this.input.useHandCursor = true;
    this.hitArea = new Phaser.Circle(0, -103, 40);
    this.angle = 45;

    this.grabbed = false;
};
grinderHandle.prototype = Object.create(Phaser.Sprite.prototype);
grinderHandle.prototype.constructor = grinderHandle;
grinderHandle.prototype.update = function() {
   // if(this.input.pointerOver()) {
    var pointerPos = this.game.input.activePointer.position;
    //If handle is being pulled or was pulled last frame, and mouse is down
    if((this.grabbed || this.input.checkPointerOver(this.game.input.activePointer)) && this.game.input.activePointer.isDown){
        var angle = Phaser.Point.angle(this.worldPosition, pointerPos) / Math.PI * 180 - 90;
        this.angle = angle;
        this.grabbed = true;
    }
    else{
        this.grabbed = false;
    }
};