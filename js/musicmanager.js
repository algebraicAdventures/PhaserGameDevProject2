var NUM_STEMS = 7;
var MusicManager = function(game) {
    this.stems_ = [];
    for(var i = 0; i < NUM_STEMS; i++) {
        this.stems_.push(new Phaser.Sound(game, 'stem' + i.toString(), 0, true));
    }
    this.currentStem_ = 0;
};

MusicManager.prototype.start = function() {
    this.currentStem_ = 0;
    this.stems_[0].play(undefined, undefined, 1, true, false);
    for(var i = 1; i < NUM_STEMS; i++) {
        this.stems_[i].play(undefined, undefined, 1, true, false);
        console.log('stem ' + i.toString() + ' is playing = ' + this.stems_[i].isPlaying);
    }
};

MusicManager.prototype.increaseStem = function() {
    if(this.currentStem_ >= NUM_STEMS - 1) {
        return;
    }
    this.currentStem_ += 1;
    this.updateStem_();
};

MusicManager.prototype.decreaseStem = function() {
    if(this.currentStem_ <= 1) {
        return;
    }
    this.currentStem_ -= 1;
    this.updateStem_();
};

MusicManager.prototype.updateStem_ = function() {
    for(var i = 0; i < NUM_STEMS; i++) {
        this.stems_[i].volume = this.currentStem_ === i ? 1 : 0;
        console.log('stem ' + i.toString() + ' is playing = ' + this.stems_[i].isPlaying);
    }
};