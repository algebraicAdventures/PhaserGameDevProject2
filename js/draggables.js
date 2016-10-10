/**
 * Created by Patrick on 10/9/2016.
 */
BEAN_LOAD_TIME = 2;
BeanBag = function(game, x, y){
    draggableObject.call(this, game, x, y, "beanBag");
    this.name = 'beans';
    this.weight = .2;
    this.grabNoise = new Phaser.Sound(this.game,"beanGrab",1,false);
};

BeanBag.prototype = Object.create(draggableObject.prototype);
BeanBag.prototype.constructor = BeanBag;