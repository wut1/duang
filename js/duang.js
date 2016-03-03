/**
 * @authors wutao (tuw111@hotmail.com)
 * @date    2015-03-17 09:10:29
 * @version 1.1
 */

(function($) {
    window.duang = function(container,params){
        var defaults = {
            speed:100,
            line:3,
            row:3,
            dealPosition:'center',
            launch:true         
        };
        var udLeft = 0,udTop = 0;
        params = params || {};

        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        var d = this;
        // Params
        d.params = params;

        d.container = $(container);
        d.itemList = d.container.find('.item');

        d.queueDiv = function(){
            var queList = [];
            for (var i = 0; i < d.container.find(".item").length; i++) {
                queList.push(d.container.find(".item").eq(i));
            };
            return queList;
        };
        /***  初始化样式 ***/  
        var mgwth = Math.floor(((d.container.width())/d.params.row - d.container.find('li').eq(0).width())/2);
        d.container.find('li').each(function(index, el) {
            d.itemList.eq(index).width($(el).width());
            d.itemList.eq(index).height($(el).height());          
            $(el).css({
                'margin-left': mgwth + 'px',
                'margin-right': mgwth + 'px'
            });
        });

        if(d.params.dealPosition === "center") {
            var shortL = d.container.offset().left;
            var shortT = d.container.offset().top;
            udLeft = parseInt(shortL) + (d.container.width() - $(".item").eq(0).width())*0.5 + 'px';
            udTop = parseInt(shortT) + (d.container.height() - $(".item").eq(0).height())*0.5 + 'px';          
        }

        d.animateEffect = function(currentJq){
            currentJq.animate({left: udLeft, top: udTop}, 100,function(){
                if(currentJq.next().length){
                    d.animateEffect(currentJq.next());
                }else {
                    setTimeout(function(){
                        d.animateDealEffect(d.itemList.eq(0));                  
                    },500);                             
                    return false;                                                   
                }   
            });     
        }

        d.animateDealEffect = function(currentJq){
            currentJq.animate({
                left: d.container.find('li').eq(currentJq.attr('index')).offset().left, 
                top: d.container.find('li').eq(currentJq.attr('index')).offset().top
            }, 100,function(){
                if(currentJq.next().length){
                    d.animateDealEffect(currentJq.next());
                }else {
                   d.itemList.addClass('shadow');
                    return false;
                }
            });     
        };

        /* 动画队列  */
        d.animateQueue = function(){
            d.animateEffect(d.itemList.eq(0));
        };

        //移动位置-初始化
        d.resetBodyPosition = function() {              
            for (var i = 0; i < d.itemList.length; i++) {
                var itemL = d.itemList.eq(i);
                itemL.attr("index",i).css({
                    "position" : "absolute",
                    "left" : itemL.offset().left,
                    "top" : itemL.offset().top
                });
            };      
            d.itemList.each(function(index, el) {
                $(el).appendTo(d.container);
            });             
        };

        d.resetDuang = function () {
            if( d.container.find('.item').hasClass('shadow')){
                 d.container.find('.item').each(function(index, el) {
                    $(el).removeClass('shadow');
                }); 
            }              
            d.container.find('.quickFlip').each(function(i, el) {
                $(el).children().each(function(index, cl) {
                    $(cl).removeClass('in');
                    if(index == 0){
                        $(cl).addClass('out');
                    } else {
                        $(cl).removeClass('out');
                    }
                });
            });
        };

        d.flipOne = function (i) {
            var $kid = d.container.find('.quickFlip').eq(i).find('.list');
            $kid.each(function(index, el) {
                if($(el).hasClass('out')){
                    setTimeout(function() {
                        $(el).removeClass('out').addClass('in');                           
                    }, 180);                        
                } else {
                    $(el).removeClass('in').addClass('out');
                } 
            });
        };
        
        d.flipAll = function () {
            var a = 0;
            function circflip (index){                       
                if(index == d.itemList.length) {
                    setTimeout(function(){
                        d.animateQueue();
                    },300);                  
                    return false;
                } else {                    
                    d.flipOne(index);
                    index++;
                    setTimeout(function(){
                        circflip(index);
                    },200);             
                }
            }
            circflip(a);
        };

        d.resetBodyPosition();
        return d;
    }   

})($) ;
