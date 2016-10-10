/**
 * Created by Patrick on 10/9/2016.
 */
BEAN_LOAD_TIME = 8;
BeanBag = function(game, x, y){
    draggableObject.call(this, game, x, y, "beanBag");
    this.name = 'beans';
};

BeanBag.prototype = Object.create(draggableObject.prototype);
BeanBag.prototype.constructor = BeanBag;