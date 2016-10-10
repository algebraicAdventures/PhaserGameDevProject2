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
    this.maxVolume_ = 3;
    this.components_ = {
        cup: type,
        temp: null
    };

    this.meter_ = new CoffeeMeter(game);
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
    this.currentVolume_ += 1;

    // Coffee cup is empty, so the coffee becomes whatever temperature is passed in.
    if(this.components_.temp === null) {
        this.components_.temp = temp;
    } else if(this.components_.temp !== temp) {
        // Mixing temperatures results in bad coffee.
        this.components_.temp = CoffeeCup.Temp.BAD;
    }
};

var CoffeeMeter = function(game) {
    Phaser.Sprite.call(this, 0, 0, 'CoffeeMeter');
};