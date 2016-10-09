/**
 * Created by wrighp on 10/4/2016.
 */
var game = new Phaser.Game(1344,750,Phaser.AUTO,'gameDiv');

game.state.add('menu',menuState);
game.state.add('play', playState);
game.state.start('menu');