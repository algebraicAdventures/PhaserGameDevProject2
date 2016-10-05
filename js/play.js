/**
 * Created by wrighp on 10/4/2016.
 */
playState = {
    init: function(){

    },
    preload: function(){
        loadStuff(this.game);


        this.game.input.onTap.add(onTap);
    },

    create: function(){
        //var sprite = new Phaser.Sprite(500,500,'testSprite');

        this.game.add.sprite(500,500,'testSprite');
        console.log("Create function.");
    },

    update: function(){

    },
    shutdown: function(){

    },
    onDragStart: function(){

    }

};

function onTap(){
    var theFeels = new draggableObject(this.game,this.game.input.mousePointer.x,this.game.input.mousePointer.y);
    theFeels.anchor.set(.5,.5);
    this.game.add.existing(theFeels);
    theFeels.kill();
    theFeels.revive();

}