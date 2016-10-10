/**
 * @param game
 * @param x
 * @param y
 * @param type see CoffeeCup.Type enum
 * @constructor
 */
var CupTower = function(game, x, y, type) {
    var image;
    switch(type) {
        case CoffeeCup.Type.GLASS:
            image = 'GlassCupTower'; break;
        case CoffeeCup.Type.PAPER:
            image = 'PaperCupTower'; break;
    }
    Phaser.Sprite.call(this, game, x, y, image);
    this.anchor.set(0.5, 1);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputDown.add(CupTower.onTap);

    // Custom properties
    this.cupType = type;
};
CupTower.prototype = Object.create(Phaser.Sprite.prototype);
CupTower.prototype.constructor = CupTower;

CupTower.onTap = function(cupTower, pointer) {
    var cup = game.state.objectLayer.add(new CoffeeCup(game, pointer.worldX - pointer.x,pointer.worldY - pointer.y, cupTower.cupType));
    cup.input.startDrag(pointer);
    cup.input.updateDrag(pointer);
};