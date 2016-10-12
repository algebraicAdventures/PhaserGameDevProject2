/**
 * Created by wrighp on 10/4/2016.
 */
var menuState = {
        create: function(){
            game.musicManager = new MusicManager(game);
            this.game.state.start('play');
        }
};