/**
 * Created by wrighp on 10/6/2016.
 */
var TAB_SIZE = 42;
var SPACING = 81;
var TWEEN_TIME = 333;
var ORDER_TIME = 20000; /* For testing purposes */

dropdown = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'dropdownImage');
    this.name = "dropdown";
    this.y = TAB_SIZE;
    this.anchor.set(0.5, 1);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.game.physics.arcade.enable(this);
    this.events.onInputDown.add(dropdown.onTap);

    // Custom properties
    this.open_ = false;
    this.maxOrders_ = 5;
    this.activeOrders_ = [];
};

dropdown.prototype = Object.create(Phaser.Sprite.prototype);
dropdown.prototype.constructor = dropdown;

dropdown.prototype.update = function() {
    Phaser.Group.prototype.update.call(this);
};

/**
 * @return int Number of active orders.
 */
dropdown.prototype.numOrders = function() {
    return this.activeOrders_.length;
}

/**
 * @param components An object containing the drink requirements
 * {
 *      volume: int - the number of units of coffee.
 *      temp: temperature from the CoffeeCup.Temp enum
 * }
 */
dropdown.prototype.addOrder = function(components) {
    var numOrders = this.numOrders();
    if(numOrders >= this.maxOrders_) {
        return;
    }
    var newOrder = new DrinkOrder(this.game, 0, -(TAB_SIZE + SPACING * (numOrders + 1)), ORDER_TIME, components);
    newOrder.anchor.set(0.5, 0);
    newOrder.addEvent(function() {
        this.removeOrder(newOrder);
    }, this);
    this.addChild(newOrder);
    this.activeOrders_.push(newOrder);

    // If the menu is currently open, slide it down to reveal the newly added order.
    if(this.open_) {
        this.open();
    }
};

/**
 * @param order The order to remove.
 */
dropdown.prototype.removeOrder = function(order) {
    var index = this.activeOrders_.indexOf(order)
    if(index >= this.maxOrders_) {
        return;
    }
    this.activeOrders_.splice(index, 1);

    // Shift all the other orders' positions to fill the gap.
    for(var i = index; i < this.numOrders(); i++) {
        this.activeOrders_[i].y = -(TAB_SIZE + SPACING * (i+1));
    }

    // If the menu is currently open, slide it up to hide the empty slot.
    if(this.open_) {
        this.open();
    }
};

dropdown.prototype.toggle = function() {
    this.open_ ? this.close() : this.open();
}

/**
 * @param openNumber number of orders to show.
 * If undefined, the menu will open to however many orders there are.
 * If there are also no active orders, the menu will only slide to one space.
 */
dropdown.prototype.open = function(openNumber) {
    openNumber = openNumber === undefined ? this.numOrders() : openNumber;
    openNumber = openNumber === 0 ? 1 : openNumber;
    var goal = SPACING * openNumber + TAB_SIZE;
    this.game.add.tween(this).to({y: goal}, TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
    this.open_ = true;
};

dropdown.prototype.close = function() {
    this.game.add.tween(this).to({y: TAB_SIZE}, TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
    this.open_ = false;
};

/**
 * Event handler for tapping the dropdown.
 */
dropdown.onTap = function(sprite, _) {
    sprite.toggle();
};
