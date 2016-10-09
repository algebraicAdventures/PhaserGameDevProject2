/**
 * @param game
 * @param x
 * @param y
 * @param type see CupTower.Type enum
 * @constructor
 */
var CupTower = function(game, x, y, type) {
    Phaser.Sprite.call(this, game, x, y);
    this.anchor.set(0.5, 1);
    switch(type) {
        case CupTower.Type.GLASS:
            this.loadTexture('GlassCupTower'); break;
        case CupTower.Type.PAPER:
            this.loadTexture('PaperCupTower'); break;
    }
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputDown.add(CupTower.onTap);
};
CupTower.prototype = Object.create(Phaser.Sprite.prototype);
CupTower.prototype.constructor = CupTower;

CupTower.Type = {
    GLASS: 0,
    PAPER: 1
};

CupTower.onTap = function(sprite, pointer) {
    console.log(pointer);
}