//头条
function scrollToTop(c){
    this.container=c;
    this.listAll=this.container.find('li');
    this.listLength=this.listAll.length;
    this.listoneHeight=0;
    this.mubiao=0;
    this.speed=3000;
    this.timer=0;
}
scrollToTop.prototype={
    init:function(){
        this.listoneHeight=this.container.find('li:first').height();
        this.bind();
    },
    bind:function(){
        var me=this;
        setInterval(function(){
            me.onestep();
        },me.speed);
    },
    onestep:function(){
        var me=this;
        /*if(parseInt(me.container.css('top'))<=-(me.listLength-1)*me.listoneHeight){
            me.container.css('top',me.listoneHeight);
        }
        me.mubiao=parseInt(me.container.css('top'))-me.listoneHeight;
        me.startMove(me.container,{'top':me.mubiao});*/
        if(parseInt(me.container.css('top'))<=-me.listoneHeight){
            me.container.css('top','0');
            me.container.append(me.container.find('li:first'));
        }
        me.mubiao=-me.listoneHeight;
        me.startMove(me.container,{'top':me.mubiao});
    },
    startMove:function(obj,json,fn){
        var me=this;
        var obj=obj[0];
        clearInterval(me.timer);
        me.timer=setInterval(function()
        {
            var bStop=true;
            for(var attr in json)
            {
                //1.取当前的值
                var iCur=0;
                if(attr=='opacity')
                {
                    iCur=parseInt(parseFloat($(obj).css(attr))*100);
                }
                else
                {
                    iCur=parseInt($(obj).css(attr));
                }
                //2.算速度
                var iSpeed=(json[attr]-iCur)/5;
                iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
                //3.检测停止
                if(iCur!=json[attr])
                {
                    bStop=false;
                }
                if(attr=='opacity')
                {
                    obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
                    obj.style.opacity=(iCur+iSpeed)/100;

                }
                else
                {
                    obj.style[attr]=iCur+iSpeed+'px';
                }

            }
            if(bStop)
            {
                clearInterval(obj.timer);
                if(fn)
                {
                    fn();
                }
            }
        },30);
    }
};
$(function(){
    //头条
    var scrToTop=new scrollToTop($('#scrollToTopList'));
    scrToTop.init();
})






