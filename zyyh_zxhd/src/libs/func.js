export default {
    getStyleAttr (obj,attr){
        if(window.getComputedStyle){
            return window.getComputedStyle(obj)[attr];
        }
        else{
            return obj.currentStyle[attr];
        }
    },
    //缓速
    starMove (obj,attr,target,fn){
        window.clearInterval(obj.timer);
        obj.timer = window.setInterval(function(){
            var current = 0;
            if(attr == "opacity"){
                // current = window.parseInt(getStyleAttr(obj,attr) * 100);
            }
            else{
                // current = window.parseInt(getStyleAttr(obj,attr));
            }
            var speed = (target - current) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if(current == target){
                window.clearInterval(obj.timer);
                // fn && fn();
                if(fn){
                    fn();
                }
                return;
            }
            if(attr == "opacity"){
                obj.style[attr] = (current + speed) / 100;
                obj.style.filter = "(alpha=" + (current + speed) + ")";
            } 
            obj.style[attr] = current + speed + "px";
        },20);
    },
    //匀速
    sameSpeed (obj,attr,target,fn){
        window.clearInterval(obj.timer);
        obj.timer = window.setInterval(function(){
            // var current = window.parseInt(getStyleAttr(obj,attr));
            var current = window.parseInt(window.getComputedStyle(obj)[attr]);
            if(current == target){
                window.clearInterval(obj.timer);
                if(fn){
                    fn();
                }
                // fn && fn();
                return;
            }
            if(target > current){
                obj.style[attr] = current + 1 + "px";
            }
            else if(target < current){
                obj.style[attr] = current - 1 + "px";
            }
        },10);
    }
};