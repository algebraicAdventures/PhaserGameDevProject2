/**
 * Created by Patrick on 10/8/2016.
 */

coffeeMachine = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'coffeeMachineBase');
    this.name = "coffeeMachine";
    this.anchor.set(0,1);
    //Add pieces
    this.addChild(new coffeeDial(game,119,-this.height+152));
    this.indicator = this.addChild(new Phaser.Sprite(this.game,697,-this.height + 20,"coffeeIndicator"));
    this.indicator.anchor.x = .5;
    //Power button
    this.coffePowerButton = this.addChild(new coffeePowerButton(this.game,697,-this.height + 180));

    //Screen
    this.screen = this.addChild(new Phaser.Sprite(this.game,261,-this.height + 28,"screen"));
    //dispenser buttons
    this.dispensers = [];
    for(var i = 0; i < 3; i++){
        this.dispensers.push(this.addChild(new coffeeDispenserButton(this.game, 119 + 290 * i, -this.height + 272)));
    }

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
        dial.toggled = dial.angle != 60;
        dial.angle = dial.toggled ? 60 : 0;
        //Play noise
    });

};
coffeeDial.prototype = Object.create(Phaser.Sprite.prototype);
coffeeDial.prototype.constructor = coffeeDial;
coffeeDial.prototype.update = function() {};

coffeePowerButton = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'powerButton');
    this.name = "coffeePowerButton";
    this.anchor.setTo(.5,.5);
    this.inputEnabled = true;
    this.hitArea = new Phaser.Circle(0, this.worldPosition.y, 96);
    this.input.useHandCursor = true;
    this.events.onInputDown.add(function (button) {
        button.frame = button.frame == 0 ? 1 : 0;
        //Turning on and off, play noise etc
    });
};
coffeePowerButton.prototype = Object.create(Phaser.Sprite.prototype);
coffeePowerButton.prototype.constructor = coffeePowerButton;
coffeePowerButton.prototype.update = function() {};

coffeeDispenserButton = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'dispenserButton');
    this.name = "dispenserButton";
    this.anchor.setTo(.5,.5);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.frame = 1;
    this.events.onInputDown.add(function (button) {
        button.frame = button.frame == 0 ? 1 : 0;
        //Turning on and off, play noise etc
    });
};
coffeeDispenserButton.prototype = Object.create(Phaser.Sprite.prototype);
coffeeDispenserButton.prototype.constructor = coffeeDispenserButton;
coffeeDispenserButton.prototype.update = function() {};
