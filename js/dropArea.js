/**
 * Created by Patrick on 10/9/2016.
 */

dropArea = function(game, x, y, name){
    Phaser.Sprite.call(this, game, x, y, 'dashedBox');
    this.name = name;
    this.tint = dropArea.DEFAULT_TINT;
    this.anchor.set(.5,.5);
    this.alpha = 55;
    game.physics.arcade.enable(this);
    game.state.triggers.push(this);
    this.body.immovable = true;
    var scale = .1;
    this.body.setSize(this.width * scale,this.height * scale , this.width/(2+scale*2), this.height/(2+scale*2));
    game.add.tween(this.scale).to({x: .9,y:.9}, 333, Phaser.Easing.Cubic.InOut, true,0,-1,true);
};
dropArea.HOVER_TINT = 0x444444;
dropArea.DEFAULT_TINT = 0x888888;
dropArea.prototype = Object.create(Phaser.Sprite.prototype);
dropArea.prototype.constructor = dropArea;
dropArea.prototype.preUpdate = function(){
    Phaser.Graphics.prototype.preUpdate.call(this);
    this.tint = dropArea.DEFAULT_TINT;
};
dropArea.prototype.update = function() {
    var setVisible;
    if(this.name == "machineBox"){
        setVisible = (heldObject != null && heldObject.name == "coffeeCup");
    }
    else if(this.name == "grinderBox"){
        setVisible = (heldObject != null && heldObject.name == "paperDish");
    }
    if(this.visible != setVisible){
        this.visible = setVisible;
    }
};