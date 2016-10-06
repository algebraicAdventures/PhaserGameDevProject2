/**
 * Created by wrighp on 10/4/2016.
 */
playState = {
    init: function(){
        this.game.world.setBounds(0,0,1344*3,750); //arbitrary 3 window size, it doesn't seem to matter
        this.game.camera.bounds = this.game.world.bounds;

        this.game.hudLayer = this.game.add.group();
        this.game.hudLayer.fixedToCamera = true;
    },
    preload: function(){
        loadStuff(this.game);


        this.game.input.onTap.add(onTap);
    },

    create: function(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.hudLayer.addChild(new slideButton(this.game,0,this.game.height/2,-1344));
        this.game.hudLayer.addChild(new slideButton(this.game,this.game.width,this.game.height/2,1344));
        this.game.camera.x = 1344;
        console.log("Create function.");
    },

    update: function(){
        game.debug.cameraInfo(game.camera, 32, 32);
    },
    shutdown: function(){

    },
    onDragStart: function(){

    }

};

function onTap(){
    var theFeels = new draggableObject(this.game,this.game.input.activePointer.worldX,this.game.input.activePointer.worldY);
    this.game.add.existing(theFeels);
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