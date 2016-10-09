/**
 * Created by wrighp on 10/5/2016.
 */

var CoffeeCup = function(game, x, y, type){
    var image;
    switch(type) {
        case CoffeeCup.Type.GLASS:
            image = 'GlassCup'; break;
        case CoffeeCup.Type.PAPER:
            image = 'PaperCup'; break;
    }
    draggableObject.call(this, game, x, y, image);
    this.anchor.set(0.5, 1);
    console.log(this);

    this.maxVolume_ = 3;
    this.components = {
        volume: 0,
        temp: null
    };
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
    if(this.volume_ >= this.maxVolume_) {
        return;
    }
    this.components.volume += 1;

    // Coffee cup is empty, so the coffee becomes whatever temperature is passed in.
    if(this.components.temp === null) {
        this.components.temp = temp;
    } else if(this.components.temp !== temp) {
        // Mixing temperatures results in bad coffee.
        this.components.temp = CoffeeCup.Temp.BAD;
    }
};