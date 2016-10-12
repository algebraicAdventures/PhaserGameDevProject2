/**
 * Created by Patrick on 10/8/2016.
 */
var COFFEE_FILL = 9; //How much coffee is added when grounds are added
var COFFEE_CAPACITY = 9;
var COFFEE_DRAIN = 1; //How much coffee is used up per "shot"
var DISPENSE_TIME = 3.5;
var STARTING_COFFEE = 6;
var REBOOT_TIME = 5;
var BLINK_TIME = 6000; //Time in between each blink in ms
var DOUBLE_BLINK = 4; //Every 4th blink is a double blink
coffeeMachine = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'coffeeMachineBase');
    this.name = "coffeeMachine";
    this.anchor.set(0,1);
    //Custom variables
    this.totalCoffee = STARTING_COFFEE;
    this.powerOn = false;
    this.needsReboot = false;
    this.faceOffset = 1; //Can be set to 3 to make it sad, or farther for upsideDown etc
    //Add pieces
    this.dial = this.addChild(new coffeeDial(game,119,-this.height+152));
    this.indicator = this.addChild(new Phaser.Sprite(game,697,-this.height + 20,"coffeeIndicator"));
    this.indicator.anchor.x = .5;


    //Screen
    this.screen = this.addChild(new Phaser.Sprite(game,261,-this.height + 28,"screen"));
    //dispenser buttons
    this.dispensers = [];
    this.boxes = [];
    for(var i = 0; i < 3; i++){
        var offset = i < 2 ? 290 : 292;
        var box = this.addChild(new dropArea(game,119 + offset * i, -this.height + 430,"machineBox"));
        this.boxes.push(box);
        this.dispensers.push(this.addChild(new coffeeDispenserButton(game, 119 + offset * i, -this.height + 272,box)));
    }
    //chute
    this.chute = this.addChild(new Phaser.Sprite(game,this.width,-this.height + 40,"coffeeChute"));
    this.chute.anchor.x = 0;
    this.chute.name = "coffeeChute";
    game.physics.arcade.enable(this.chute);
    game.state.triggers.push(this.chute);
    //Power button
    this.coffeePowerButton = this.addChild(new coffeePowerButton(game,697,-this.height + 180,this));


};
coffeeMachine.prototype = Object.create(Phaser.Sprite.prototype);
coffeeMachine.prototype.constructor = coffeeMachine;
coffeeMachine.prototype.update = function() {
    for(var i = 0; i < this.children.length; i++){
        this.children[i].update();
        if(DEBUG_INFO) game.debug.body(this.children[i]);
    }

    if(this.powerOn) {
        if(this.needsReboot){
            var remainder =  timePlayed % 2200;
            var remainder2 = timePlayed % 2300;
            var tintAmount = remainder <= 50 ||(remainder2 <=50) ? 220   : 255;
            var t = Phaser.Color.componentToHex(tintAmount);
            this.screen.tint = "0x"+t+t+t;
            if(timePlayed % 1200 == 0 || timePlayed % 1500 == 0){
                coffeeDial.toggle(this.dial);
                console.log("ticked");
            }
            this.screen.frame = 0;
        }
        else{
            var remainder = timePlayed % (BLINK_TIME); //3 normal blinks before every double blink
            var blink;
            if(timePlayed % (BLINK_TIME*DOUBLE_BLINK) < BLINK_TIME){
                blink = remainder <= 50 || (remainder <= 300 && remainder > 250) ? 1 : 0; //Blink twice
            }
            else{
                blink = remainder <= 100 ? 1 : 0; //Blink once
            }
            this.screen.frame = blink + this.faceOffset;
            this.indicator.frame = Math.ceil((this.totalCoffee / COFFEE_CAPACITY) * 3);
            this.screen.tint = 0xffffff;
        }
    }
    else{
        this.indicator.frame = 0;
    }
};

coffeeDial = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'coffeeDial');
    this.name = "coffeeDial";
    this.anchor.set(.5,.5);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.toggled = false;
    this.events.onInputDown.add(coffeeDial.toggle);

};
coffeeDial.toggle = function(dial){
    var dispensers = dial.parent.dispensers;
    for(var i = 0; i < dispensers.length; i++){
        if(dispensers[i].dispenseTime > 0) return;
    }
    dial.toggled = dial.angle != 60;
    dial.angle = dial.toggled ? 60 : 0;
    //Play noise
    game.sound.play("dialTurn",.5);
}
coffeeDial.prototype = Object.create(Phaser.Sprite.prototype);
coffeeDial.prototype.constructor = coffeeDial;
coffeeDial.prototype.update = function() {};

coffeePowerButton = function(game, x, y, parent){
    Phaser.Sprite.call(this, game, x, y, 'powerButton');
    this.name = "coffeePowerButton";
    this.anchor.setTo(.5,.5);
    if(!parent.powerOn){
        parent.screen.tint = 0x000000;
    }
    this.frame = parent.powerOn ? 1 : 0;
    this.inputEnabled = true;
    this.hitArea = new Phaser.Circle(0, this.worldPosition.y, 96);
    this.input.useHandCursor = true;
    this.rebootTime = 0;
    this.events.onInputDown.add(function (button) {
        button.frame = button.frame == 0 ? 1 : 0;
        //Play sounds
        game.sound.play("buttonPress",.75);
        if(button.frame == 0){
            if(button.rebootTime <= 0){
                game.sound.play("machineOff");
            }
            button.parent.powerOn = false;
            //Turn off machine, play sound
            button.parent.screen.tint = 0x000000;
            button.rebootTime = 0;
        }
        else{
            button.rebootTime = REBOOT_TIME;
            button.parent.screen.tint = 0xffffff;
            button.parent.screen.frame = 5;
        }
        //Turning on and off, play noise etc
    });
};
coffeePowerButton.prototype = Object.create(Phaser.Sprite.prototype);
coffeePowerButton.prototype.constructor = coffeePowerButton;
coffeePowerButton.prototype.update = function() {
    if(this.rebootTime > 0){
        this.rebootTime = Math.max(this.rebootTime - deltaTime,0);
        //Machine is turning on
        //Machine has chance to lose progress (I think this is actually a geometric mean but it probabilistically will complete
        if(game.rnd.realInRange(0,REBOOT_TIME * 2)< deltaTime){
            this.rebootTime = Math.min(this.rebootTime + REBOOT_TIME/2, REBOOT_TIME);
            this.parent.screen.tint = 0x888888;
        }
        else{
            this.parent.screen.tint = 0xffffff;
        }
        this.parent.screen.frame = 5 + Math.floor((1-this.rebootTime / REBOOT_TIME) * 10);

        if(this.rebootTime == 0){
            //machine turns on
            this.parent.needsReboot = false;
            game.sound.play("machineOn");
            this.parent.powerOn = true;
        }
    }
};

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
        if(button.frame != 0) { //Could check for greater than 0 instead, for rounding errors
            game.sound.play("buttonPress",.5);
            button.frame = 0;
            game.sound.play("pourLong");
            button.dispenseTime = DISPENSE_TIME;
            button.parent.totalCoffee = Math.max(button.parent.totalCoffee - COFFEE_DRAIN, 0);
            //create animation
            var pouring = button.addChild(new Phaser.Sprite(game,-8,80,'pouring'));
            pouring.animations.add('pour');
            pouring.animations.play('pour',20);
            game.time.events.add(DISPENSE_TIME*1000,function(){pouring.destroy();},pouring); //Destroy particle emitter later
            //create steam
            if(button.parent.dial.toggled)
                coffeeMachine.createEmitter(button.world.x,button.world.y+100);
            //game.state.machineLayer.addChild(emitter);

            var cup = button.box.attachedSprite;
            if (cup != null) {
                cup.inputEnabled = false;
                cup.input.useHandCursor = false;
            }
        }
    });

};
coffeeMachine.createEmitter = function(x,y){
    var life = DISPENSE_TIME * 1000;

    var frequency = 250;
    var perLoop = 2; //particles emitted after every frequency

    var iterations = (life / frequency) ;

    var numParticles = perLoop * iterations;
    var particleLife = 3000;

    var emitter = game.add.emitter(x,y,numParticles);
    emitter.makeParticles("steam");
    emitter.autoAlpha = true;
    emitter.setAlpha(.75,0,3000);
    emitter.gravity = -100;
    emitter.setScale(.25,.5,.25,.5,3000);
    emitter.autoScale = true;
    emitter.setXSpeed(-20,20);
    emitter.setYSpeed(-40,0);
    emitter.setSize(20,10);
    emitter.flow(particleLife,frequency,perLoop,numParticles);
    game.state.machineLayer.addChild(emitter);
    game.time.events.add(life+particleLife,function(){this.pendingDestroy = true;},emitter); //Destroy particle emitter later
};
coffeeDispenserButton.prototype = Object.create(Phaser.Sprite.prototype);
coffeeDispenserButton.prototype.constructor = coffeeDispenserButton;
coffeeDispenserButton.prototype.update = function() {
    var pouring = this.dispenseTime > 0;
    this.dispenseTime = Math.max(this.dispenseTime - deltaTime, 0);
    var cup = this.box.attachedSprite;
    if(pouring && this.dispenseTime <= 0){
        //Give control back to cup and add liquid
        game.sound.play("buttonRelease",.25);
        if(cup != null){
            cup.inputEnabled = true;
            cup.input.useHandCursor = true;
            var filled = !cup.isFull();
            cup.addCoffee(this.parent.dial.toggled ? 0 : 1);
            if(filled && cup.isFull()){
                //Now it's filled
                game.sound.play("voiceButton"+game.rnd.integerInRange(1,5),.5);
            }
        }
    }
    if(!pouring){ //Or power off
        this.frame = this.parent.totalCoffee > 0 && this.parent.powerOn && !this.parent.needsReboot? 1 : 0;
    }
};
