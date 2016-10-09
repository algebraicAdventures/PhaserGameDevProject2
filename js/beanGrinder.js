/**
 * Created by Patrick on 10/7/2016.
 */

beanGrinder = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'grinder');
    this.name = "grinder";
    this.extended = true;
    this.anchor.set(.5,1);
    this.game.physics.arcade.enable(this);
    this.body.setSize(this.width,this.height/2,0, 0);
    var mask = this.addChild(new Phaser.Graphics(this.game,0,0)); //Mask to cover up the grounds
    mask.beginFill('white');
    mask.drawPolygon([[-92,269-this.height],[-138, 34 - this.height],[134,34 - this.height],[90,269-this.height]]);
    this.beans = this.addChild(new Phaser.Sprite(this.game,-1,-this.height + 50,"beanPile"));
    this.beans.anchor.set(.5,-1);
    this.beans.mask = mask;
    this.totalBeans = 1;

    this.snapBox = this.addChild(new Phaser.Sprite(this.game,0,-100,"dashedBox"));
    this.snapBox.tint = 0x888888;
    this.snapBox.anchor.set(.5,0);
    this.snapBox.alpha = 55;
    this.snapBox.name = "grinderBox";
    this.game.physics.arcade.enable(this.snapBox);
    this.game.state.triggers.push(this.snapBox);

    this.handle = this.addChild(new grinderHandle(game,0,-this.height+328));


};

beanGrinder.prototype = Object.create(Phaser.Sprite.prototype);
beanGrinder.prototype.constructor = beanGrinder;
beanGrinder.prototype.update = function() {
    if(DEBUG_INFO) this.game.debug.body(this);
    for(var i = 0; i < this.children.length; i++){
        this.children[i].update();
        if(DEBUG_INFO) this.game.debug.body(this.children[i]);
    }
    this.beans.y = this.beans.y + this.game.time.elapsed/500 * -(this.beans.y -( -this.height + 50 - 210 * this.totalBeans));
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
};
grinderHandle.prototype = Object.create(Phaser.Sprite.prototype);
grinderHandle.prototype.constructor = grinderHandle;
grinderHandle.prototype.update = function() {
   // if(this.input.pointerOver()) {
    var pointerPos = this.game.input.activePointer.position;
    //If handle is being pulled or was pulled last frame, and mouse is down
    if((this.grabbed || this.input.checkPointerOver(this.game.input.activePointer)) && this.game.input.activePointer.isDown){
        var angle = Phaser.Point.angle(this.worldPosition, pointerPos) / Math.PI * 180 - 90;
        var change = Math.abs(angle - this.angle);
        change = Math.min(change, 60) * this.game.time.elapsed/180000 / 2;
        this.parent.totalBeans = Math.max(0, this.parent.totalBeans - change);
        this.angle = angle;
        this.grabbed = true;
    }
    else{
        this.grabbed = false;
    }
};