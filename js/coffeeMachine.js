/**
 * Created by Patrick on 10/8/2016.
 */

coffeeMachine = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'coffeeMachineBase');
    this.name = "coffeeMachine";
    this.anchor.set(0,1);
    //Add pieces
    this.addChild(new coffeeDial(game,119,-this.height+152));

};
coffeeMachine.prototype = Object.create(Phaser.Sprite.prototype);
coffeeMachine.prototype.constructor = coffeeMachine;
coffeeMachine.prototype.update = function() {
    for(var i = 0; i < this.children.length; i++){
        this.children[i].update();
        if(DEBUG_INFO) this.game.debug.body(this.children[i]);
    }
};

coffeeDial = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'coffeeDial');
    this.name = "coffeeDial";
    this.anchor.set(.5,.5);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.toggled = false;
    this.events.onInputDown.add(function (dial) {
        dial.toggled = dial.angle != 90;
        dial.angle = dial.toggled ? 90 : 0;
    });

};
coffeeDial.prototype = Object.create(Phaser.Sprite.prototype);
coffeeDial.prototype.constructor = coffeeDial;
coffeeDial.prototype.update = function() {};