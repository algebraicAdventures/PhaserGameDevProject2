/**
 * Order manager logic.
 */
var TAB_SIZE = 42;
var SPACING = 81;
var OFFSET = 9;
var TWEEN_TIME = 333;
var ORDER_TIME = 20000; /* For testing purposes */
var TEXT_VISIBLE_TIME = 3; //Should be a multiple of TEXT_FLICKER_RATE
var TEXT_FLICKER_RATE = 500;
var PEEK_TIME = 4000; // How long does the menu stay open when warning about the time

var dropdown = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'dropdownImage');
    this.game = game;
    this.name = "dropdown";
    this.y = TAB_SIZE;
    this.anchor.set(0.5, 1);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.game.physics.arcade.enable(this);
    this.events.onInputDown.add(dropdown.onTap);

    //Manually centered
    this.textAlert =this.addChild(new Phaser.Text(this.game,-68,20,"New Order.",{fill: 'white', align: 'center'}));
    this.textAlert.alpha = 1;
    this.textAlertTime = 0;

    this.open_ = false;
};

dropdown.prototype = Object.create(Phaser.Sprite.prototype);
dropdown.prototype.constructor = dropdown;

dropdown.prototype.update = function() {
    Phaser.Group.prototype.update.call(this);
    this.textAlertTime = Math.max(this.textAlertTime - deltaTime, 0);
    this.textAlert.visible = this.textAlertTime > 0;
};

dropdown.prototype.toggle = function() {
    this.open_ ? this.close() : this.open();
    //Turn off alert when opening
    if(this.open_) this.textAlertTime = 0;
};

/**
 * @param openNumber number of orders to show.
 * If undefined, the menu will open to however many orders there are.
 * If there are also no active orders, the menu will only slide to one space.
 */
dropdown.prototype.open = function(openNumber) {
    openNumber = openNumber === undefined ? this.game.state.orderManager.numOrders() : openNumber; // Bad coding, hopefully temp.
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
