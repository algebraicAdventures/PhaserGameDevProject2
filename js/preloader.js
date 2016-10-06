/**
 * Created by wrighp on 10/5/2016.
 */

function loadStuff(game){
    game.load.script('draggableObject','js/draggableObject.js');
    game.load.image('testSprite', 'assets/sprites/testSprite.png');
    game.load.script('slideButton', 'js/slideButton.js');
    game.load.image('testArrow', 'assets/sprites/testArrow.png');
    game.load.script('dropdown', 'js/dropdown.js');
    game.load.image('testDropdown', 'assets/sprites/testDropdown.png');

    console.log("Preloaded files");
}
