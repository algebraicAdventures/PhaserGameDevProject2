/**
 * Created by Patrick on 10/7/2016.
 */

beanGrinder = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'grinder');
    this.name = "grinder";
    this.extended = true;
    this.anchor.set(.5,1);
    game.physics.arcade.enable(this);
    this.body.setSize(this.width,this.height/2,0, 0);
    this.body.immovable = true;
    var mask = this.addChild(new Phaser.Graphics(game,0,0)); //Mask to cover up the grounds
    mask.beginFill('white');
    mask.drawPolygon([[-92,269-this.height],[-138, 34 - this.height],[134,34 - this.height],[90,269-this.height]]);
    this.beans = this.addChild(new Phaser.Sprite(game,-1,-this.height + 50,"beanPile"));
    this.beans.anchor.set(.5,-1);
    this.beans.mask = mask;
    this.totalBeans = 1;

    this.snapBox = this.addChild(new dropArea(game,0,-90,"grinderBox"));
    this.handle = this.addChild(new grinderHandle(game,0,-this.height+328));
    game.state.triggers.push(this); //Add this so beans can be added to it
};

beanGrinder.prototype = Object.create(Phaser.Sprite.prototype);
beanGrinder.prototype.constructor = beanGrinder;
beanGrinder.prototype.update = function() {
    if(DEBUG_INFO) game.debug.body(this);
    for(var i = 0; i < this.children.length; i++){
        this.children[i].update();
        if(DEBUG_INFO) game.debug.body(this.children[i]);
    }
    //Manual interpolation of bean position
    this.beans.y = this.beans.y + game.time.elapsed/500 * -(this.beans.y -( -this.height + 50 - 210 * this.totalBeans));
};
grinderHandle = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'grinderHandle');
    this.name = "grinderHandle";
    this.anchor.set(.5,0.70454545454); // /r/theydidthemath
    this.inputEnabled = true;
    //this.body.setSize(40,40,0,104);
    this.input.useHandCursor = true;
    this.hitArea = new Phaser.Circle(0, -103, 40);
    this.angle = 45;
    this.grabbed = false;
    this.grinderSound = game.add.audio("grinderSound");
    this.grinderSound.play('',0,true);
};
grinderHandle.prototype = Object.create(Phaser.Sprite.prototype);
grinderHandle.prototype.constructor = grinderHandle;
grinderHandle.prototype.update = function() {

   // if(this.input.pointerOver()) {
    var pointerPos = game.input.activePointer.position;
    //If handle is being pulled or was pulled last frame, and mouse is down
    //AND no object is being held
    if(heldObject == null && (this.grabbed || this.input.checkPointerOver(game.input.activePointer)) && game.input.activePointer.isDown){
        var angle = Phaser.Point.angle(this.worldPosition, pointerPos) / Math.PI * 180 - 90;
        angle = angle < -180 ? angle + 360 : angle;
        var change = Math.abs(angle - this.angle);
        change = Math.min(change, 90) * deltaTime/180 / 2;
        if(change > 0){
            this.grinderSound.resume();
            this.grinderSound.loop = true;
        }
        else    this.grinderSound.pause();
        this.parent.totalBeans = Math.max(0, this.parent.totalBeans - change);
        this.angle = angle;
        this.grabbed = true;
    }
    else{
        this.grabbed = false;
        this.grinderSound.pause();
    }
};

