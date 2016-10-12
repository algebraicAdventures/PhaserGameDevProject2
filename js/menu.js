/**
 * Created by wrighp on 10/4/2016.
 */
var menuState = {
        create: function(){
            game.stage.backgroundColor = '#3F70B7';
            game.musicManager = new MusicManager(game);
            game.musicManager.start();

            game.input.onTap.add(function() {
                game.musicManager.increaseStem();
                game.camera.fade(0xffffff, 1000, false);
                game.time.events.add(1000, function() {
                    game.state.start('play');
                });
            });
        }
};