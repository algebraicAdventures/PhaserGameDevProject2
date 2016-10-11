/**
 * Created by wrighp on 10/5/2016.
 */
var totalDecodedSounds = 25; //Set to the number of mp3's/ ogg's you have, needs to be equal to that number
function loadStuff(game){
    // hud stuff
    game.load.script('draggableObject','js/draggableObject.js');
    game.load.script('draggables','js/draggables.js');
    game.load.image('testSprite', 'assets/sprites/testSprite.png');
    game.load.script('slideButton', 'js/slideButton.js');
    game.load.image('testArrow', 'assets/sprites/testArrow.png');
    game.load.script('dropdown', 'js/dropdown.js');
    game.load.image('dropdownImage', 'assets/sprites/dropdown.png');
    game.load.spritesheet('life', 'assets/sprites/life_spritesheet.png', 41, 37);
    game.load.script('score', 'js/score.js');

    //bean grinder stuff
    game.load.script('beanGrinder', 'js/beanGrinder.js');
    game.load.image('grinder', 'assets/sprites/grinder.png');
    game.load.image('grinderHandle', 'assets/sprites/grinderhandle.png');
    game.load.image('paperDish', 'assets/sprites/paperdish.png');
    game.load.image('paperDishFilled', 'assets/sprites/paperdish_filled.png');
    game.load.image('beanPile', 'assets/sprites/grinder_beans.png');
    game.load.image('beanBag', 'assets/sprites/bean_bag.png');

    //cup stuff
    game.load.image('GlassCupTower', 'assets/sprites/cupHolder_full.png');
    game.load.image('PaperCupTower', 'assets/sprites/paper_cupHolder_full.png');
    game.load.image('GlassCup', 'assets/sprites/cup.png');
    game.load.image('PaperCup', 'assets/sprites/paper_cup.png')
    game.load.spritesheet('CoffeeMeter', 'assets/sprites/coffeemeter_spritesheet.png', 40, 123);
    game.load.script('CoffeeCup', 'js/coffeeCup.js');
    game.load.script('CupTower', 'js/CupTower.js');
    game.load.image('garbage', 'assets/sprites/x.png');
    game.load.script('Garbage', 'js/garbage.js');
    // Order stuff
    game.load.image('order', 'assets/sprites/order.png');
    game.load.image('hot', 'assets/sprites/hot.png');
    game.load.image('cold', 'assets/sprites/cold.png');
    game.load.script('DrinkOrder', 'js/drinkOrder.js');

    game.load.script('testObject', 'js/testObject.js');
    //coffee machine stuff
    game.load.script('coffeeMachine', 'js/coffeeMachine.js');
    game.load.image('coffeeMachineBase', 'assets/sprites/coffee_machine_base.png');
    game.load.image('coffeeDial', 'assets/sprites/dial_centered.png');
    game.load.spritesheet('coffeeIndicator', 'assets/sprites/coffeeindicator_spritesheet.png', 107, 94);
    game.load.spritesheet('powerButton', 'assets/sprites/powerbutton_spritesheet.png', 96, 96);
    game.load.spritesheet('screen', 'assets/sprites/screen_spritesheet.png', 298, 200);
    game.load.spritesheet('dispenserButton', 'assets/sprites/dispenserbutton_spritesheet.png', 83, 34);
    game.load.image('coffeeChute','assets/sprites/chute.png');
    //game.load.image('coffeeBag', 'assets/sprites/coffeebag.png');
    game.load.image('dashedBox', 'assets/sprites/dashedBox.png');
    game.load.script('dropArea','js/dropArea.js');
    game.load.script('musicManager', 'js/musicmanager.js');

    //Sounds
    game.load.audio('ambience', 'SFX/Coffee_Ambience.mp3');
    game.load.audio('beanGrab', 'SFX/Coffee_Bean_Grab.mp3');
    game.load.audio('grinderSound', 'SFX/Coffee_Grinder_Turn.mp3');
    game.load.audio('cupPlace', 'SFX/Cup_Place.mp3');
    game.load.audio('cupRemove', 'SFX/Cup_Remove.mp3');
    game.load.audio('orderFail', 'SFX/Order_Fail.mp3');
    game.load.audio('bell', 'SFX/Bell_Ring.mp3');
    game.load.audio('trashNoise', 'SFX/Trash.mp3');
    game.load.audio('orderSuccess', 'SFX/Order_Success.mp3');
    game.load.audio('pourLong', 'SFX/Machine_Coffee_Pour.mp3');
    game.load.audio('buttonPress', 'SFX/Machine_Button_Press_V2.mp3');
    game.load.audio('buttonRelease', 'SFX/Machine_Button_Release_V2.mp3');
    for(var i = 1; i <= 5; i++){
        game.load.audio('voiceButton'+i.toString(), 'SFX/Voice/Machine_Voice_Button_'+i.toString()+'.mp3');
    }

    // Music
    game.load.audio('stem0', 'Music/Title_Screen_Stem.mp3'); // Title screen music
    game.load.audio('stem1', 'Music/Stem_Speed_1.mp3');
    game.load.audio('stem2', 'Music/Stem_Speed_2.mp3');
    game.load.audio('stem3', 'Music/Stem_Speed_3.mp3');
    game.load.audio('stem4', 'Music/Stem_Speed_4.mp3');
    game.load.audio('stem5', 'Music/Stem_Speed_5.mp3');
    game.load.audio('stem6', 'Music/Stem_Speed_6.mp3');
    game.load.audio('emergency', 'Music/Coffee_Countdown.mp3');
    console.log("Preloaded files");
}