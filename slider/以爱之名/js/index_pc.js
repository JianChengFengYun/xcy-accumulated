$(function(){
    /*第一屏动画*/
    var Sindex= 1,
        Sanger=68,
        Slength=$('.banner>li').length,
        isLoadImg = [];
    for(var i=0; i<Slength; i++){
        if(i == 0){
            isLoadImg[i] = false;
        }else{
            isLoadImg[i] = true;
        }
    }
    function loadImg(slideIdx){
        if( isLoadImg[slideIdx] ){
            var img = $('.banner>li').eq(slideIdx).find("img");
            var src_original = img.attr("src_original");
            img.attr("src",src_original);
            isLoadImg[slideIdx] = false;
        }
    }
    function rotateFunc(){
        $('.ball').stopRotate();
        $(".ball").rotate({
            angle:(Sindex-1)*Sanger,
            duration: 3000,
            center: ["50%", "100%"],
            animateTo:Sindex*Sanger, //angle是图片对应的角度
            easing: $.easing.easeOutQuad,
            callback:function(){
                loadImg(Sindex);
                $('.banner>li').fadeOut(1500).eq(Sindex).fadeIn(1500);
                $('.scaleTxt>span').fadeOut().eq(Sindex).fadeIn();
                $('.scale>img').hide().eq(Sindex).show();

                if(Sindex==0){
                    $(".ball").css({opacity:1})
                }
                if(Sindex==Slength-1){
                    $(".ball").css({opacity:0})
                }

                if(Sindex < Slength-1){
                    Sindex++;
                    Sanger=68;
                }else{
                    Sindex=0;
                    Sanger=90;
                }
                setTimeout(function(){
                    rotateFunc();
                },4000)
            }
        });
    };
    /*四小图动画*/
    $('.fourPic .bot1').fadeIn().animate({
        left:'174px',
        bottom:'-149px',
        opacity:100
    },500,function(){
        $('.fourPic .bot2').fadeIn().animate({
            left:'92px',
            bottom:'-64px',
            opacity:100
        },500,function(){
            $('.fourPic .bot3').fadeIn().animate({
                left:'230px',
                bottom:'70px',
                opacity:100
            },500,function(){
                $('.fourPic .bot4').fadeIn().animate({
                    left:'127px',
                    bottom:'150px',
                    opacity:100
                },500,function(){
                    rotateFunc();
                })
            })
        })
    })

    //导航
    var navmarTop = $('.mainNav').offset().top;
    var sideBar = $(".mainNav");
    var sideBarItems = $(".mainNav li");
    var topNews = $(".yazmheader").offset().top;
    var topXinfang = $(".yazm").offset().top;
    var topIfengClub = $(".zajj").offset().top;
    var topWorld = $(".eamj").offset().top;
    var topMeitu = $(".eahj").offset().top;
    $(window).on("scroll", function(){
        var st = $("html").scrollTop() || $("body").scrollTop();
        st+=154;
        if(st>= navmarTop){
            sideBar.addClass("fixed");
        }else{
            sideBar.removeClass("fixed");
        }
        if(st >= topNews && st < topXinfang){
            sideBarItems.removeClass("current");
            sideBarItems.eq(0).addClass("current");
        }else if(st >= topXinfang && st < topIfengClub){
            sideBarItems.removeClass("current");
            sideBarItems.eq(1).addClass("current");
        }else if(st >= topIfengClub && st < topWorld){
            sideBarItems.removeClass("current");
            sideBarItems.eq(2).addClass("current");
        }else if(st >= topWorld && st < topMeitu){
            sideBarItems.removeClass("current");
            sideBarItems.eq(3).addClass("current");
        }else if(st >= topMeitu){
            sideBarItems.removeClass("current");
            sideBarItems.eq(4).addClass("current");
        }
    });
    //恩爱合集
    var timer1=null;
    $('.mainCon div.ph').bind({
        mouseenter:function() {
            var me=$(this);
            timer1=setTimeout(function(){
                me.find('.phIntr').animate({
                    top:'0'
                });
            },500)
        },
        mouseleave:function() {
            var me=$(this);
            clearTimeout(timer1);
            me.find('.phIntr').animate({
                top:'100%'
            });
        }
    })
});