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
        fill: 'white'
    }));

    /* TEMPORARY FOR TESTING */
    this.inputEnabled = true;
    this.events.onInputDown.add(function() {
        this.addScore(game.rnd.integerInRange(1,50));
    }, this);
};
Score.prototype = Object.create(Phaser.Sprite.prototype);
Score.prototype.constructor = Score;

Score.prototype.update = function() {
    Phaser.Sprite.prototype.update.call(this);
    this.scoreText_.text = 'Score: ' + this.score_.toString();
};

Score.prototype.removeLife = function() {
    if(this.lives_ <= 0) {
        console.error('No more lives to remove');
        return;
    }
    this.game.musicManager.increaseStem(0.5);
    this.lives_ -= 1;
    this.liveSprites_[this.lives_].frame = 1;
};

/**
 * @param amount The number of points to increase the score by
 */
Score.prototype.addScore = function(amount) {
    this.score_ += amount;
    // STRETCH GOAL: fade in/out a little green '+[score]' text next to the current score
};