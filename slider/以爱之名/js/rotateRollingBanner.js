(function($) {
    $.fn.rotateRollingBanner = function(options) {
        var defaults = {
            moveSpeed: 200,
            autoRollingTime: 5000
        };
        $.extend(defaults, options);
        return this.each(function() {
            var me = $(this);
            var ul = me.find(".d_img");
            var lis = ul.find(">li");
            var menu = me.find(".d_menu");
            var menuLis = menu.find(">li");
            var prev = me.find(".d_prev");
            var next = me.find(".d_next");
            var lisLength = lis.length;
            var num = 5;            // 显示的li数量；
            var NorP = "next";     // 用来判断 上一张 下一张；
            var timer;              // 定时器；
            var btnTimer;           // 点击 menu li按钮的 定时器；
            var visibleLi = [];     // 存贮显示li的css属性值；
            var allLi = [];         // 存贮所有的li；
            var isFinish = 1;       // 1 图片切换已经执行完  0 图片切换还没有执行完
            var clickIndex = 0;     // 点击的 menu li按钮 索引
            var currentIndex = 0;   // 正显示的 menu li的索引
            var sum = 0;            // 点击 menu li按钮后 要执行 “图片切换” 的次数
            var count = 0;          // 点击 menu li按钮后 记录“图片切换” 的次数
            w();
            function w() {
                if(lisLength>0){
                    init();      //存贮所有的li 并设置li的属性；初始化menu li按钮；
                    bind();      //事件绑定
                    rolling();   //定时任务
                }
            }
            function init() {
                menu.html("");
                for (var i = 0; i < lisLength; i++) {   //遍历li
                    var liN = lis.eq(i);
                    if (i < num) {
                        visibleLi[i] = {
                            left: liN.position().left,
                            top: liN.position().top,
                            zIndex: liN.css("z-index"),
                            width: liN.width(),
                            height: liN.height(),
                        };
                        liN.css("left", visibleLi[i].left);
                    } else {
                        liN.css("left", visibleLi[num - 1].left);
                    }
                    allLi.push(liN);
                    menu.append("<li></li>");
                }
                menuLis = menu.find(">li");
                menuLis.eq(0).addClass("d_select");
            }
            function bind() {
                me.bind("mouseenter",
                function() {
                    clearInterval(timer);
                }).bind("mouseleave",
                function() {
                    rolling();
                });
                menuLis.bind("click",
                function() {
                    if (isFinish && currentIndex != $(this).index()) {
                        clickIndex = $(this).index();        //本次点击的 menu li的索引
                        isFinish = 0;
                        sum = Math.abs(clickIndex - currentIndex);        //点击 menu li按钮后 要执行 “图片切换” 的次数
                        if (clickIndex > currentIndex) {
                            NorP = "next";
                        } else {
                            NorP = "prev";
                        }
                        if (sum > Math.ceil(lisLength / 2)) { //如果一次要执行 lisLength/2 次以上  就换个方向  执行的次数就少些
                            sum = lisLength - sum;
                            if (NorP == "next") {
                                NorP = "prev";
                            } else {
                                NorP = "next";
                            }
                        }
                        count = 0;
                        change();
                        if (sum > 1) {
                            btnTimer = setInterval(function() {
                                if (isFinish) {
                                    change();
                                    isFinish = 0;
                                    if (count >= sum) {
                                        clearInterval(btnTimer);
                                    }
                                }
                            },
                            50)
                        }
                    }
                });
                next.bind("click",
                function() {
                    if (isFinish) {
                        NorP = "next";
                        isFinish = 0;
                        if (clickIndex == lisLength - 1) {
                            clickIndex = 0;
                        } else {
                            clickIndex++;
                        }
                        change();
                    }
                });
                prev.bind("click",
                function() {
                    if (isFinish) {
                        NorP = "prev";
                        isFinish = 0;
                        if (clickIndex == 0) {
                            clickIndex = lisLength - 1;
                        } else {
                            clickIndex--;
                        }
                        change();
                    }
                })
            }
            function change() {
                if (NorP == "next") {              // 下一张
                    for (i = 0; i < num; i++) {
                        var D = visibleLi[i - 1];
                        if (i == 0) {
                            allLi[i].fadeOut(defaults.moveSpeed);
                        } else {
                            allLi[i].css("z-index", D.zIndex).animate({
                                left: D.left,
                                top: D.top,
                                width: D.width,
                                height: D.height
                            },
                            defaults.moveSpeed);
                        }
                    }
                    var D = visibleLi[num - 1];
                    if (allLi.length != num) {
                        allLi[num].css({
                            left: D.left,
                            top: D.top,
                            width: D.width,
                            height: D.height,
                            "z-index": D.zIndex
                        }).fadeIn(defaults.moveSpeed,
                        function() {
                            isFinish = 1;
                        });
                    } else {
                        allLi[0].stop().css({
                            left: D.left,
                            top: D.top,
                            width: D.width,
                            height: D.height,
                            "z-index": D.zIndex
                        }).fadeIn(defaults.moveSpeed,
                        function() {
                            isFinish = 1;
                        });
                    }
                    allLi.push(allLi.shift());
                } else {                 // 上一张
                    for (i = 0; i < num; i++) {
                        var D = visibleLi[i + 1];
                        if (i == num - 1) {
                            allLi[i].css("z-index", 0).fadeOut(defaults.moveSpeed);
                        } else {
                            allLi[i].css("z-index", D.zIndex).animate({
                                left: D.left,
                                top: D.top,
                                width: D.width,
                                height: D.height
                            },
                            defaults.moveSpeed);
                        }
                    }
                    var D = visibleLi[0];
                    allLi[allLi.length - 1].stop().css({
                        left: D.left,
                        top: D.top,
                        width: D.width,
                        height: D.height,
                        "z-index": D.zIndex
                    }).fadeIn(defaults.moveSpeed,
                    function() {
                        isFinish = 1;
                    });
                    allLi.unshift(allLi.pop());
                }
                menuLis.removeClass("d_select");
                menuLis.eq(clickIndex).addClass("d_select");
                currentIndex = clickIndex;
                count++;

                var eqi=currentIndex+2;
                if(eqi==num){
                    eqi=0;
                }
                if(eqi==num+1){
                    eqi=1;
                }
                lis.find('div').hide();
                lis.eq(eqi).find('div').show();
            }
            function rolling() {
                timer = setInterval(rotate, defaults.autoRollingTime);
            }
            function rotate() {
                next.click();
            }
        })
    }
})(jQuery);
$(function(){
    $('#rotateBanner').rotateRollingBanner({
        moveSpeed:200,
        autoRollingTime:3000
    })
})
