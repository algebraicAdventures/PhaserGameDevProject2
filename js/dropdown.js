/**
 * Created by wrighp on 10/6/2016.
 */
var TAB_SIZE = 34;
var SPACING = 84;
var TWEEN_TIME = 333;

dropdown = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'testDropdown');
    this.name = "dropdown";
    this.extended = true;
    this.y = TAB_SIZE;
    this.anchor.set(.5,1);
    this.inputEnabled = true;
    this.game.physics.arcade.enable(this);
    this.events.onInputDown.add(dropdown.onInputDown);
};

dropdown.prototype = Object.create(Phaser.Sprite.prototype);
dropdown.prototype.constructor = dropdown;

dropdown.prototype.update = function() {

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
