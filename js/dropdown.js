/**
 * Created by wrighp on 10/6/2016.
 */
var TAB_SIZE = 42;
var SPACING = 81;
var TWEEN_TIME = 333;

dropdown = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'dropdownImage');
    this.name = "dropdown";
    this.y = TAB_SIZE;
    this.anchor.set(0.5, 1);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.game.physics.arcade.enable(this);
    this.events.onInputDown.add(dropdown.onInputDown);

    // Custom properties
    this.extended = false;
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

dropdown.prototype.addOrder = function() {
    var numOrders = this.numOrders();
    if(numOrders >= 5) {
        return;
    }
    // TODO(Ariel): Instead of having the sprite spawn at 10,10, have it spawn in the menu on top of all the other orders.
    // TODO(Ariel): Un-hardcode the amount of time we get for an order - currently at 2 minutes.
    var newOrder = new DrinkOrder(this.game, 0, -(TAB_SIZE + SPACING * (numOrders + 1)), 20000);
    newOrder.anchor.set(0.5, 0);
    newOrder.addEvent(function() {
        this.removeOrder(newOrder);
    }, this);
    this.addChild(newOrder);
    this.activeOrders_.push(newOrder);
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
    // Relocate all the other orders' positions
    for(var i = index; i < this.numOrders(); i++) {
        this.activeOrders_[i].y = -(TAB_SIZE + SPACING * (i+1));
    }
};

dropdown.onInputDown = function(sprite){
    dropdown.slide(sprite);
};

dropdown.slide = function(sprite) {
    var openNumber = sprite.numOrders();
    openNumber = openNumber === 0 ? 1 : openNumber;
    var goal = sprite.extended ? TAB_SIZE : SPACING * openNumber + TAB_SIZE;
    sprite.game.add.tween(sprite).to({y: goal}, TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
    sprite.extended = !sprite.extended;
};
