/**
 * Created by Patrick on 10/9/2016.
 */
//Extra draggable objects go here
BEAN_LOAD_TIME = 2;
BeanBag = function(game, x, y){
    draggableObject.call(this, game, x, y, "beanBag");
    this.name = 'beans';
    this.weight = .2;
    this.grabNoise = new Phaser.Sound(this.game,"beanGrab",1,false); //Noise for when bag is loading beans
    this.invincible = true;
};

BeanBag.prototype = Object.create(draggableObject.prototype);
BeanBag.prototype.constructor = BeanBag;

PaperDish = function(game, x, y){
    draggableObject.call(this, game, x, y, "paperDish"); //paperDishFilled is the other one
    this.name = 'paperDish';
    this.invincible = true;
};

PaperDish.prototype = Object.create(draggableObject.prototype);
PaperDish.prototype.constructor = PaperDish;