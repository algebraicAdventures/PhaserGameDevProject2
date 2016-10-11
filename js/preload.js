/**
 * Created by Patrick on 10/10/2016.
 */
var decodedSounds = 0;
var preloadState = {
    preload: function(){
        game.sound.onSoundDecode.add(function(){
            decodedSounds++;
        });
        loadStuff(game);
    },
    create: function(){

    },
    update: function(){
        if(decodedSounds >= totalDecodedSounds && game.load.hasLoaded) {
            console.log("Decoded "+decodedSounds+" sounds");
            this.game.state.start('menu');
        }
    }
};