var SCORE_SPACING = 5;
var LIFE_SPACING = 4;
var Score = function (game) {
    Phaser.Sprite.call(this, game, 10, 10);

    // Custom properties
    this.lives_ = 7;
    this.liveSprites_ = [];
    for(var i = 0; i < this.lives_; i++) {
        var sprite = game.make.sprite(0, 0, 'life');
        sprite.x = i*(sprite.width + LIFE_SPACING);
        this.addChild(sprite);
        this.liveSprites_.push(sprite);
    }

    this.score_ = 0;
    var offset = this.liveSprites_[0].height + SCORE_SPACING;
    this.scoreText_ = this.addChild(new Phaser.Text(game, 0, offset, 'Score: ' + this.score_.toString(), {
        align: 'left',
        fill: 'white',
    }));
};
Score.prototype = Object.create(Phaser.Sprite.prototype);
Score.prototype.constructor = Score;

