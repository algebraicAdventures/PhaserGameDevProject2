/**
 * Created by Patrick on 10/8/2016.
 */
var COFFEE_FILL = 2; //How much coffee is added when grounds are added
var COFFEE_CAPACITY = 3;
var COFFEE_DRAIN = .5; //How much coffee is used up per "shot"
var DISPENSE_TIME = 3.5;
var STARTING_COFFEE = 1;
coffeeMachine = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'coffeeMachineBase');
    this.name = "coffeeMachine";
    this.anchor.set(0,1);
    //Add pieces
    this.dial = this.addChild(new coffeeDial(game,119,-this.height+152));
    this.indicator = this.addChild(new Phaser.Sprite(game,697,-this.height + 20,"coffeeIndicator"));
    this.indicator.anchor.x = .5;
    //Power button
    this.coffeePowerButton = this.addChild(new coffeePowerButton(game,697,-this.height + 180));

    //Screen
    this.screen = this.addChild(new Phaser.Sprite(game,261,-this.height + 28,"screen"));
    //dispenser buttons
    this.dispensers = [];
    this.boxes = [];
    for(var i = 0; i < 3; i++){
        var box = this.addChild(new dropArea(game,119 + 292 * i, -this.height + 430,"machineBox"));
        this.boxes.push(box);
        this.dispensers.push(this.addChild(new coffeeDispenserButton(game, 119 + 292 * i, -this.height + 272,box)));
    }
    //chute
    this.chute = this.addChild(new Phaser.Sprite(game,this.width,-this.height + 40,"coffeeChute"));
    this.chute.anchor.x = 0;
    this.chute.name = "coffeeChute";
    game.physics.arcade.enable(this.chute);
    game.state.triggers.push(this.chute);

    this.totalCoffee = STARTING_COFFEE;
};
coffeeMachine.prototype = Object.create(Phaser.Sprite.prototype);
coffeeMachine.prototype.constructor = coffeeMachine;
coffeeMachine.prototype.update = function() {
    for(var i = 0; i < this.children.length; i++){
        this.children[i].update();
        if(DEBUG_INFO) game.debug.body(this.children[i]);
    }
    this.indicator.frame = Math.ceil((this.totalCoffee / COFFEE_CAPACITY) * 3);
};

coffeeDial = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'coffeeDial');
    this.name = "coffeeDial";
    this.anchor.set(.5,.5);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.toggled = false;
    this.events.onInputDown.add(function (dial) {
        var dispensers = dial.parent.dispensers;
        for(var i = 0; i < dispensers.length; i++){
            if(dispensers[i].dispenseTime > 0) return;
        }
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

coffeeDispenserButton = function(game, x, y, box){
    Phaser.Sprite.call(this, game, x, y, 'dispenserButton');
    this.name = "dispenserButton";
    this.box = box;
    this.anchor.setTo(.5,.5);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.frame = 1;
    this.dispenseTime = 0;
    this.events.onInputDown.add(function (button) {
        if(button.dispenseTime == 0 && button.parent.totalCoffee > 0){ //Could check for greater than 0 instead, for rounding errors
            button.frame = 0;
            game.sound.play("pourLong");
            button.dispenseTime = DISPENSE_TIME;
            button.parent.totalCoffee = Math.max(button.parent.totalCoffee - COFFEE_DRAIN, 0);
        }

        var cup = button.box.attachedSprite;
        if(cup != null){
            cup.inputEnabled = false;
            cup.input.useHandCursor = false;
        }
    });

};
coffeeDispenserButton.prototype = Object.create(Phaser.Sprite.prototype);
coffeeDispenserButton.prototype.constructor = coffeeDispenserButton;
coffeeDispenserButton.prototype.update = function() {
    var pouring = this.dispenseTime > 0;
    this.dispenseTime = Math.max(this.dispenseTime - deltaTime, 0);
    var cup = this.box.attachedSprite;
    if(pouring && this.dispenseTime <= 0){
        //Give control back to cup and add liquid
        if(cup != null){
            cup.inputEnabled = true;
            cup.input.useHandCursor = true;
            cup.addCoffee(this.parent.dial.toggled ? 0 : 1);
        }
    }
    if(!pouring){ //Or power off
        this.frame = this.parent.totalCoffee <= 0 ? 0 : 1;
    }
};
