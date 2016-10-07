DrinkOrder = function(game, x, y, timeLimit) {
    Phaser.Sprite.call(this, game, x, y, 'drinkOrder');

    this.timeLimit_ = timeLimit; /* Amount of time the player has to complete this order */
    this.timeStarted_ = 0; /* Time that the order became active - set to now */

    // Populate with drink order requirements when we figure out how we're representing that.
};
DrinkOrder.prototype = Object.create(Phaser.Sprite.prototype); /* Do we make this a sprite group? */
DrinkOrder.prototype.constructor = DrinkOrder;