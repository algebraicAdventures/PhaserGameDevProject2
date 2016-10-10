/**
 * Created by wrighp on 10/5/2016.
 */
var CoffeeCup = function(game, x, y, type){
    this.name = 'coffeeCup';
    var image;
    switch(type) {
        case CoffeeCup.Type.GLASS:
            image = 'GlassCup'; break;
        case CoffeeCup.Type.PAPER:
            image = 'PaperCup'; break;
    }
    draggableObject.call(this, game, x, y, image);

    this.currentVolume_ = 0;
    this.maxVolume_ = 2;
    this.components_ = {
        cup: type,
        temp: null
    };

    this.meter_ = new CoffeeMeter(game, -this.width/2, this.height/2 - 20);
    //this.meter_.visible = false;
    this.addChild(this.meter_);

    // TEMPORARY FOR TESTING
    this.events.onInputDown.add(function(cup) {
        cup.addCoffee(game.rnd.integerInRange(0,1));
    });
};

CoffeeCup.prototype = Object.create(draggableObject.prototype);
CoffeeCup.prototype.constructor = CoffeeCup;

CoffeeCup.Temp = {
    HOT: 0,
    COLD: 1,
    BAD: 2
};

CoffeeCup.Type = {
    GLASS: 0,
    PAPER: 1
};

CoffeeCup.prototype.isFull = function() {
    return this.currentVolume_ >= this.maxVolume_;
};

CoffeeCup.prototype.isEmpty = function() {
    return this.currentVolume_ === 0;
}

//Return true if interaction happens, return false if object should be thrown
CoffeeCup.prototype.dragStopped = function(sprite,pointer){
    return false;
};

/**
 * Adds a unit of coffee to the cup if the cup is not already at maximum volume.
 * Changes the temperature of the coffee based on what temperature the coffee added was.
 * @param temp Temperature of the added coffee.
 */
CoffeeCup.prototype.addCoffee = function(temp) {
    if(this.isFull()) {
        return;
    }

    // Coffee cup is empty, so the coffee becomes whatever temperature is passed in.
    if(this.isEmpty()) {
        this.meter_.visible = true;
        this.components_.temp = temp;
        switch(this.components_.temp) {
            case CoffeeCup.Temp.HOT:
                this.meter_.changeIcon('hot', 30, -3); break;
            case CoffeeCup.Temp.COLD:
                this.meter_.changeIcon('cold', 30, -3); break;
        }
    } else if(this.components_.temp !== temp) {
        // Mixing temperatures results in bad coffee.
        this.components_.temp = CoffeeCup.Temp.BAD;
        this.meter_.changeIcon('garbage', 41, 1);
    }

    this.currentVolume_ += 1;
    this.meter_.frame = this.currentVolume_ - 1;
};

var CoffeeMeter = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'CoffeeMeter');
    this.anchor.set(1, 1);
    this.icon_ = this.addChild(game.make.sprite(-this.width/2, 0));
    this.icon_.anchor.set(0.5,1);
};
CoffeeMeter.prototype = Object.create(Phaser.Sprite.prototype);
CoffeeMeter.prototype.constructor = CoffeeMeter;

CoffeeMeter.prototype.changeIcon = function(image, height, offsetY) {
    this.icon_.loadTexture(image);
    var scale = height / this.icon_.height;
    console.log(scale);
    this.icon_.scale.setTo(scale, scale);
    this.icon_.y = offsetY === undefined ? this.y : offsetY;
};