/**
 * Created by wrighp on 10/4/2016.
 */
var DEBUG_INFO = false; //set true to see various debug info
var deltaTime = 1;
var timePlayed = 0;
var MACHINE_HEIGHT = 40;
var BACKGROUND_PARALLAX = 1/5; //With current sprite can't go more than 1/3
playState = {
    init: function(){
        game.world.setBounds(0,0,1344*3,750); //arbitrary 3 window size, it doesn't seem to matter
        game.camera.bounds = game.world.bounds;

        game.state.backgroundLayer = game.add.group();
        game.state.machineLayer = game.add.group();
        game.state.hudLayerBack = game.add.group(); //Hud layer behind objects
        game.state.hudLayerBack.fixedToCamera = true;
        game.state.objectLayer = game.add.group();
        game.state.hudLayer = game.add.group(); //Hud layer in front of objects
        game.state.hudLayer.fixedToCamera = true;
        game.state.orderManager;
        game.state.triggers = []; //array of sprites to be used as trigger zones
    },
    preload: function() {//Everything is loaded at the main menu now, for faster restarting of states
    },

    create: function(){
        game.state.ambience = new Phaser.Sound(game, 'ambience', 1, true);
        game.state.ambience.fadeIn(1000, true);
        game.musicManager.fadeIn(1);
        game.camera.x = 1344;
        game.camera.flash(0xffffff, 1000);
        game.state.cameraGoal = game.camera.x; //This is what the camera will interpolate to
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //Countertop and background
        game.state.backgroundLayer.add(new Phaser.Sprite(game,0,0,"background"));
        game.state.backgroundLayer.fixedToCamera = true;
        game.state.backgroundLayer.cameraOffset.x = -game.camera.x *BACKGROUND_PARALLAX
        game.state.machineLayer.add(new Phaser.Sprite(game,0,0,"countertop"));


        //Create arrows
        game.state.hudLayerBack.addChild(new slideButton(game,0,game.height/2,-game.width));
        game.state.hudLayerBack.addChild(new slideButton(game,game.width,game.height/2,game.width));
        // create garbage
        game.state.hudLayer.addChild(new Garbage(game));
        // create score and lives
        game.state.score = new Score(game);
        game.state.hudLayer.addChild(game.state.score);
        //create grinder
        game.state.machineLayer.addChild(new beanGrinder(game, 1000,game.height -MACHINE_HEIGHT));
        //create coffee machine
        this.game.state.machine = game.state.machineLayer.addChild(new coffeeMachine(game, 2950,game.height -MACHINE_HEIGHT));
        //create cup towers
        game.state.machineLayer.addChild(new CupTower(game, 1850, game.height - MACHINE_HEIGHT, CoffeeCup.Type.GLASS));
        game.state.machineLayer.addChild(new CupTower(game, 1600, game.height - MACHINE_HEIGHT, CoffeeCup.Type.PAPER));
        //beans
        game.state.objectLayer.addChild(new PaperDish(game, 700, game.height - 40));
        game.state.objectLayer.addChild(new PaperDish(game, 600, game.height - 40));
        //Spawn beans last so they go over things
        game.state.objectLayer.addChild(new BeanBag(game, 300, game.height - 40));
        // create order drop off
        game.state.machineLayer.addChild(new OrderDropoff(game, game.width + 960, 284));

        //Create order manager
        game.state.orderManager = new OrderManager(game,game.width/2,0);
        game.state.hudLayerBack.addChild(game.state.orderManager);
        game.state.orderSpawner = new OrderSpawner(game);
        game.state.orderSpawner.start();

        //Input events
        var restart = game.input.keyboard.addKey(Phaser.Keyboard.R);
        restart.onDown.add(function() {
            game.camera.fade(0xffffff, 1000, false);
            game.musicManager.fadeOut();
            game.time.events.add(1000, function() {
                game.state.start('play');
            });
        }, this);
        // game.input.onTap.add(onTap);

            DEBUG_INFO = false;
            var text = new Phaser.Text(game, 20, game.height - 30,"Hit 'B' to toggle debug display",{backgroundColor: 'black',fill: 'white',});
            game.state.hudLayer.addChild(text);
            var b = game.input.keyboard.addKey(Phaser.Keyboard.B);
            text.visible = false;
            b.onDown.add(function(){DEBUG_INFO = !DEBUG_INFO; game.debug.reset(); text.visible = !text.visible});
        console.log("State create function completed.");
    },

    update: function(){
        timePlayed += game.time.elapsedMS;
        deltaTime = game.time.elapsed / 1000;

        if(DEBUG_INFO){
            game.debug.cameraInfo(game.camera, 32, 32);
        }
        if(heldObject != null){
            //This is called to check if object is hovering over a collider but isn't dropped i.e. bag of beans
            //objectHoverHandler is in draggableObject
           game.physics.arcade.collide(heldObject, game.state.triggers, null, objectHoverHandler, this);
        }

    },
    preRender: function(){

    },
    shutdown: function(){
        //Reset your global variables here!!
        heldObject = null;
        timePlayed = 0;
        game.state.orderSpawner.stop();
        game.state.ambience.fadeOut();
    },
    onDragStart: function(){

    }

};

function onTap(){
    var theFeels = new draggableObject(game,game.input.activePointer.worldX,game.input.activePointer.worldY);
    game.state.objectLayer.add(theFeels);
    //theFeels.kill();
    //theFeels.revive();
}
//Taken from phaser example at: http://phaser.io/examples/v2/sprites/overlap-tween-without-physics
function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function checkPointInside(point, sprite){
    return Phaser.Rectangle.containsPoint(sprite.getBounds(),point);
}