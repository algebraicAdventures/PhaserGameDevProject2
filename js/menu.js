/**
 * Created by wrighp on 10/4/2016.
 */
var menuState = {
        preload: function(){
            loadStuff(game);
        },
        create: function(){
            this.game.state.start('play');
        }
};