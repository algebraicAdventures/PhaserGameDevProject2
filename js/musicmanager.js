var NUM_STEMS = 7;
var REALLY_QUIET = 0.0000001;
var CROSSFADE_TIME = 2000;
var MusicManager = function(game) {
    this.stems_ = [];
    for(var i = 0; i < NUM_STEMS; i++) {
        this.stems_.push(new Phaser.Sound(game, 'stem' + i.toString(), 0, true));
    }
    this.emergency_ = new Phaser.Sound(game, 'emergency', 0, true);
    this.emergencyOn_ = false;
    this.currentStem_ = 0;
};

MusicManager.prototype.start = function() {
    this.currentStem_ = 0;
    this.stems_[0].play('', 0, 1, true, true);
    this.emergency_.play('', 0, 0, true, true);
    for(var i = 1; i < NUM_STEMS; i++) {
        this.stems_[i].play('', 0, 0, true, true);
    }
};

MusicManager.prototype.increaseStem = function() {
    if(this.currentStem_ >= NUM_STEMS - 1) {
        return;
    }
    this.stems_[this.currentStem_].fadeTo(CROSSFADE_TIME, REALLY_QUIET);
    this.currentStem_ += 1;
    this.stems_[this.currentStem_].fadeTo(CROSSFADE_TIME, 1);
};

MusicManager.prototype.decreaseStem = function() {
    if(this.currentStem_ <= 1) {
        return;
    }
    this.stems_[this.currentStem_].fadeTo(CROSSFADE_TIME, REALLY_QUIET);
    this.currentStem_ -= 1;
    this.stems_[this.currentStem_].fadeTo(CROSSFADE_TIME, 1);
};

MusicManager.prototype.toggleEmergency = function() {
    this.emergencyOn_ = !this.emergencyOn_;
    this.emergency_.fadeTo(CROSSFADE_TIME, this.emergencyOn_ ? 1 : REALLY_QUIET);
};