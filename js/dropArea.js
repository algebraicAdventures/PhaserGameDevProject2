/**
 * Created by Patrick on 10/9/2016.
 */

var dropArea = function(game, x, y, name){
    Phaser.Sprite.call(this, game, x, y, 'dashedBox');
    this.name = name;
    this.tint = dropArea.DEFAULT_TINT;
    this.anchor.set(.5,.5);
    this.alpha = 55;
    game.physics.arcade.enable(this);
    game.state.triggers.push(this);
    this.body.immovable = true;
    var scale = 1;
    this.body.setSize(this.width * scale,this.height * scale , this.width*(.5 -scale*.5), this.height*(.5 -scale*.5));
    game.add.tween(this.scale).to({x: .9,y:.9}, 333, Phaser.Easing.Cubic.InOut, true,0,-1,true);
    this.attachedSprite = null; //sprite attached to this area
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
    } else if(this.name == "grinderBox"){
        setVisible = (heldObject != null && heldObject.name == "paperDish");
    } else if(this.name == 'orderDropoff') {
        setVisible = (heldObject != null && heldObject.name =='coffeeCup');
    }
    else if(this.name == 'menuDropoff'){
        setVisible = heldObject != null;
    }
    setVisible = this.attachedSprite == null ? setVisible : false;
    if(this.visible != setVisible){
        this.visible = setVisible;
    }
};

var OrderDropoff = function(game, x, y) {
    dropArea.call(this, game, x, y, 'orderDropoff');
    this.anchor.set(0.5, 1);
    this.text_ = this.addChild(new Phaser.Text(game, 0, - this.height - 35, 'Order Dropoff', {
        align: 'center',
        fill: '#222222'
    }));
    this.text_.anchor.set(0.5, 0);
};

OrderDropoff.prototype = Object.create(dropArea.prototype);
OrderDropoff.prototype.constructor = OrderDropoff;

var menuDropoff = function(game, x, y) {
    dropArea.call(this, game, x, y, 'menuDropoff');
    this.anchor.set(0.5, .5);
    this.text_ = this.addChild(new Phaser.Text(game, 0, - this.height - 35, 'Start Game', {
        align: 'center',
        fill: '#ffffff'
    }));
    this.text_.anchor.set(0.5, 0);
};
menuDropoff.prototype = Object.create(dropArea.prototype);
menuDropoff.prototype.constructor = menuDropoff;