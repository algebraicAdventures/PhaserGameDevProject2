/**
 * Created by wrighp on 10/4/2016.
 */
var DEBUG_INFO = true; //set true to see various debug info

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
    preload: function(){
        loadStuff(game);
    },

    create: function(){

        game.camera.x = 1344;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //Create arrows
        game.state.hudLayer.addChild(new slideButton(game,0,game.height/2,-game.width));
        game.state.hudLayer.addChild(new slideButton(game,game.width,game.height/2,game.width));
        //Create dropdown
        game.state.dropDown = new dropdown(game,game.width/2,0);
        game.state.hudLayer.addChild(game.state.dropDown);
        //create grinder
        //game.state.machineLayer.add(new beanGrinder(game, 1000,game.height -40));

        //Input events
        game.input.onTap.add(onTap);
        console.log("Create function.");
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(game.state.dropDown.addOrder, game.state.dropDown);
    },

    update: function(){
        if(DEBUG_INFO) game.debug.cameraInfo(game.camera, 32, 32);
        if(heldObject != null){
           game.physics.arcade.collide(heldObject, game.state.triggers, triggerHandler, function(){return false}, this);
        }
    },
    shutdown: function(){

    },
    onDragStart: function(){

    }

};
function triggerHandler(obj, triggers){
    for(var i = 0; i < triggers.length; i++){
        if(obj.name == "beans" && triggers[i] == "grinder"){

        }
    }
}

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