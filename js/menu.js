/**
 * Created by wrighp on 10/4/2016.
 */

var menuState = {
        create: function(){
            var heightShift = -400; //how far up we're moving the camera for dropping items
            game.stage.backgroundColor = '#3F70B7';
            game.musicManager = new MusicManager(game);
            game.musicManager.start();
            game.world.setBounds(0,-400,1344,750);
            game.camera.bounds = game.world.bounds;

            game.state.screen = game.add.existing(new Phaser.Sprite(game,game.width/2,game.height/2 + heightShift,"screen"));
            game.state.screen.anchor.set(.5,.5);
            game.state.screen.frame = 1;
            game.state.triggers = []; //to satisfy the menu
            game.state.startTrigger = new menuDropoff(game, 1000, game.height/2 + heightShift);
            game.add.existing(game.state.startTrigger);


            game.state.objectLayer = game.add.group();
        },
    update: function(){
        timePlayed += game.time.elapsedMS;
        deltaTime = game.time.elapsed / 8000; //Makes them fall slower
        var remainder = (game.time.totalElapsedSeconds()*1000) % (BLINK_TIME); //3 normal blinks before every double blink
        var blink;
        if(timePlayed % (BLINK_TIME*DOUBLE_BLINK) < BLINK_TIME){
            blink = remainder <= 50 || (remainder <= 300 && remainder > 250) ? 1 : 0; //Blink twice
        }
        else{
            blink = remainder <= 100 ? 1 : 0; //Blink once
        }
        game.state.screen.frame = 1 + blink;
        var children = game.state.objectLayer.children;
        for(var i = 0; i < children.length; i++){
            if(children[i].y >= 600){
                children[i].destroy();
            }
        }
        if(game.rnd.realInRange(0,500) < game.time.elapsed){
            var pick = game.rnd.integerInRange(0,3);
            var obj;
            var x = game.rnd.realInRange(0,game.width);
            var y = game.rnd.realInRange(-700,-1000);
            switch(pick){
                case 0:
                    obj =new CoffeeCup(game,x,y,CoffeeCup.Type.GLASS); break;
                case 1:
                   obj = new CoffeeCup(game,x,y,CoffeeCup.Type.PAPER); break;
                case 2:
                    obj = new PaperDish(game,x,y); break;
                case 3:
                    obj = new PaperDish(game,x,y);
                    obj.loadTexture('paperDishFilled'); break;
                case 4:
                    obj = new BeanBag(game,x,y); break;
            }
            game.state.objectLayer.add(obj);
            obj.body.angularVelocity = game.rnd.realInRange(-100,100);
            obj.body.velocity.y = game.rnd.realInRange(50,0);
        }
        if(heldObject != null){
            game.physics.arcade.collide(heldObject, game.state.startTrigger, null, objectHoverHandler, this);
        }
    }
};

var gameOverState = {
    create: function() {
        game.stage.backgroundColor = '#3F70B7';
        game.musicManager.fadeIn(0);
        game.camera.flash(0xffffff, 1000, false);
        game.input.onTap.add(function() {
            game.musicManager.fadeOut();
            game.camera.fade(0xffffff, 1000, false);
            game.time.events.add(1000, function() {
                game.state.start('play');
            });
        });
    }
};
startGame = function() {
    game.musicManager.fadeOut();
    game.camera.fade(0xffffff, 1000, false);
    game.time.events.add(1000, function () {
        game.state.start('play');
    });
}