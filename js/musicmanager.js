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
    this.stems_[0].play('', 0, 1, true, true);
    for(var i = 1; i < NUM_STEMS; i++) {
        this.stems_[i].play('', 0, 1, true, true);
        //this.stems_[i].volume = 0;
    }
    this.stems_.forEach(function(element, index, _) {
        window.setTimeout(function() {
            console.log('stem ' + index.toString() + ' is playing = ' + element.isPlaying);
        }, 1000);
    });
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
    }
    /*
    this.stems_.forEach(function(element, index, _) {
        window.setTimeout(function() {
            console.log('stem ' + index.toString() + ' is playing = ' + element.isPlaying);
        }, 3000);
    });
    */
};