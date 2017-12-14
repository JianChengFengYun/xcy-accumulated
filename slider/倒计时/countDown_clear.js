/*******************倒计时********************/

function countDown(selecter) {
    this.selecter = selecter;
    this.container = $(selecter);
    this.timer = [null, null, null, null];
}
countDown.prototype = {
    init: function() {
        var me = this;
        me.container = $(document).find(me.selecter);
        for (var i = 0; i < me.container.length; i++) {
            clearInterval(me.timer[i]);
        }

        for (var i = 0; i < me.container.length; i++) {
            var obj = $(me.selecter + ":eq(" + i + ")");
            var endTime = obj.attr("time");
            this.countdown(obj, endTime, i);//先执行一次，显示倒计时结束的状态；

            var oDate = new Date();
            var s = endTime - parseInt(oDate.getTime() / 1000);
            if (s < 0) continue;
            (function(obj, endTime, i){
                me.timer[i] = setInterval(function() {
                    me.countdown(obj, endTime, i);
                }, 1000);
            })(obj, endTime, i);
        }

    },
    countdown: function(obj, endTime, index) {
        var oDate = new Date();
        var s = endTime - parseInt(oDate.getTime() / 1000);
        if (s < 0) {    //活动结束后
            data = {
                day: 0,
                hour: 00,
                min: 00,
                sec: 00
            };
            for (var i in data) {
                obj.find("." + i).html(data[i]);
            }
            obj.html("活动进行中!");
        } else {
            var data = {};
            data.day = parseInt(s / 86400);
            s %= 86400;
            data.hour = parseInt(s / 3600);
            s %= 3600;
            data.min = parseInt(s / 60);
            data.sec = s % 60;
            for (var i in data) {
                obj.find("." + i).html(data[i]);
            }
        }
    }
};

$(document).ready(function() {
    var clock = new countDown(".countdown");
    clock.init();
});
