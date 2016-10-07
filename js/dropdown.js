/**
 * Created by wrighp on 10/6/2016.
 */
var TAB_SIZE = 34;
var SPACING = 84;
var TWEEN_TIME = 333;

dropdown = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'dropdownImage');
    this.name = "dropdown";
    this.y = TAB_SIZE;
    this.anchor.set(.5,1);
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

dropdown.prototype.addOrder = function() {
    // TODO(Ariel): Instead of having the sprite spawn at 10,10, have it spawn in the menu on top of all the other orders.
    // TODO(Ariel): Un-hardcode the amount of time we get for an order - currently at 2 minutes.
    // TODO(Ariel): Don't allow any more orders to be added if we exceed a certain amount due to screen space.
    var newOrder = new DrinkOrder(this.game, 0, this.activeOrders_.length * 20, 10000);
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
    console.log(this.activeOrders_.length);
};

dropdown.onInputDown = function(sprite){
    dropdown.slide(sprite);
};
dropdown.slide = function(sprite){
    var openNumber = Math.floor((Math.random()*3)+1); //Temporary for testing
    var goal = sprite.extended ? TAB_SIZE : SPACING * openNumber + TAB_SIZE;
    sprite.game.add.tween(sprite).to({y: goal}, TWEEN_TIME, Phaser.Easing.Cubic.InOut, true);
    sprite.extended = !sprite.extended;
};
