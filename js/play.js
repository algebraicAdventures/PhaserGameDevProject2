/**
 * Created by wrighp on 10/4/2016.
 */
var DEBUG_INFO = true; //set true to see various debug info
var deltaTime = 1;
playState = {
    init: function(){
        game.world.setBounds(0,0,1344*3,750); //arbitrary 3 window size, it doesn't seem to matter
        game.camera.bounds = game.world.bounds;

        game.state.machineLayer = game.add.group();
        game.state.objectLayer = game.add.group();
        game.state.hudLayer = game.add.group();
        game.state.hudLayer.fixedToCamera = true;
        game.state.dropDown;
        game.state.triggers = []; //array of sprites to be used as trigger zones
    },
    preload: function() {//Everything is loaded at the main menu now, for faster restarting of states
    },

    create: function(){
        game.sound.play("ambience",1,true);

        game.camera.x = 1344;
        game.state.cameraGoal = game.camera.x; //This is what the camera will interpolate to

        game.physics.startSystem(Phaser.Physics.ARCADE);
        //Create arrows
        game.state.hudLayer.addChild(new slideButton(game,0,game.height/2,-game.width));
        game.state.hudLayer.addChild(new slideButton(game,game.width,game.height/2,game.width));
        //Create dropdown
        game.state.dropDown = new dropdown(game,game.width/2,0);
        game.state.hudLayer.addChild(game.state.dropDown);
        // create garbage
        game.state.hudLayer.addChild(new Garbage(game));
        // create score and lives
        game.state.score = new Score(game);
        game.state.hudLayer.addChild(game.state.score);
        //create grinder
        game.state.machineLayer.addChild(new beanGrinder(game, 1000,game.height -40));
        //create coffee machine
        game.state.machineLayer.addChild(new coffeeMachine(game, 2950,game.height -40));
        //create cup towers
        game.state.machineLayer.addChild(new CupTower(game, 1850, game.height - 40, CoffeeCup.Type.GLASS));
        game.state.machineLayer.addChild(new CupTower(game, 1600, game.height - 40, CoffeeCup.Type.PAPER));
        //beans
        game.state.objectLayer.addChild(new BeanBag(game, 300, game.height - 40));

        //Input events
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(function() {
            game.state.dropDown.addOrder(DrinkOrder.randomOrderReq());
        }, game.state.dropDown);
        // game.input.onTap.add(onTap);

        if(DEBUG_INFO){
            DEBUG_INFO = false;
            var text = new Phaser.Text(game, 20, game.height - 30,"Hit 'B' to toggle debug display",{backgroundColor: 'black',fill: 'white',});
            game.state.hudLayer.addChild(text);
            var b = game.input.keyboard.addKey(Phaser.Keyboard.B);
            text.visible = false;
            b.onDown.add(function(){DEBUG_INFO = !DEBUG_INFO; game.debug.reset(); text.visible = !text.visible});
        }
        console.log("State create function completed.");
    },

    update: function(){
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
    shutdown: function(){
        //Reset your global variables here!!
        heldObject = null;
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