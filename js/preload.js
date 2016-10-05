/**
 * Created by wrighp on 10/4/2016.
 */
var preloadState = {
        create: function(){
            //Load all of your stuff here
            game.load.image('testSprite', 'assets/sprites/testSprite.png');
            game.state.start('play');
        }
};