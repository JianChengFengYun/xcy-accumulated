	function photoViewer(){
        this.container = null;
        this.bigImgcontainer = null;
        this.bigImg = null;
        this.prev = null;
        this.next = null;
        this.prevPage = null;
        this.nextPage = null;
        this.thumb_list = null;//小图列表容器
        this.thumb_list_ul = null;//小图列表容器UL
        this.thumb_list_li = null;
        this.close = null;
        this.slideWidth = null;
        this.slideSpeed = 200;
        this.slideIdx = 0;//当前图片序号index
        this.slideAll = null;   
        this.slideTag = true;
        this.thumbMoveTag = false;
        this.thumbShowTag = false;
        this.photoMaxHeight = null;
        this.photoMaxWidth = null;
        this.photoCurHeight = null;
        this.photoCurWidth = null;
        this.photoData = null;
        this.prevUrl = null;
        this.nextUrl = null;
        this.loader = null;
        this.currNum = null;
        this.totalNum = null;
        this.footer = null;
        this.slideScreenLen = 7;
        this.isMarkSliding = false;//选中框移动开关：false不移动，true正在移动
        this.isNavSliding = false;//列表移动开关：false不移动，true正在移动
    }
    photoViewer.prototype = {
        init: function(idx){//初始化
            this.resize();
            this.photoGet(idx);
            this.bind();
        },
        photoGet: function(idx){//ajax图片数据
            if(this.photoData.length == 0) return;
            if(!$(".photoViewer").length){//新建dom结构，导入图片数据
                var photoHtml = '<div class="photoViewer" style="display:none">';
                    photoHtml +='   <div class="photoViewer-close"><a href="javascript:;">关闭</a></div>';
                    photoHtml +='   <div class="photoViewer-big">';
                    photoHtml +='   	<div class="photoViewer-loader"></div>';
                    photoHtml +='       <img src="">';
                    photoHtml +='       <a class="photoViewer-prev">';
                    photoHtml +='           <span class="cursor"></span>';
                    photoHtml +='           <span class="arrow"></span>';
                    photoHtml +='       </a>';
                    photoHtml +='       <a class="photoViewer-next">';
                    photoHtml +='           <span class="cursor"></span>';
                    photoHtml +='           <span class="arrow"></span>';
                    photoHtml +='       </a>';
                    photoHtml +='   </div>';
                    photoHtml +='   <div class="photoViewer-footer">';
                    photoHtml +='       <div class="photoViewer-num">';
                    photoHtml +='           <span class="photoViewer-num-curr">0</span>/';
                    photoHtml +='           <span class="photoViewer-num-all">0</span>';
                    photoHtml +='       </div>';
                    photoHtml +='       <div class="photoViewer-navBar-wrap" style="display:none">';
                    photoHtml +='           <div id="photoViewer-footer-prev"></div>';
                    photoHtml +='           <div id="photoViewer-footer-next"></div>';
                    photoHtml +='           <div class="photoViewer-navBar">';
                    photoHtml +='               <div class="photoViewer-navBar-list">';
                    photoHtml +='                   <div class="mark"></div>';
                    photoHtml +='                   <ul>';
                    for(i in this.photoData){
                            photoHtml +='               <li><img src="'+this.photoData[i].url2+'"></li>';
                    }
                    photoHtml +='                   </ul>';
                    photoHtml +='               </div>';
                    photoHtml +='           </div>';
                    photoHtml +='       </div>';
                    photoHtml +='   </div>';
                    photoHtml +='</div>';
                $("body").append(photoHtml);
            }
            this.slideIdx = idx || 0;
            this.container = $(".photoViewer");
            this.bigImgcontainer = $(".photoViewer-big");
            this.bigImg = this.bigImgcontainer.find("img");
            this.prev = $(".photoViewer-prev");
            this.next = $(".photoViewer-next");
            this.footer = $(".photoViewer-footer");
            this.currNum = $(".photoViewer-num-curr");
            this.totalNum = $(".photoViewer-num-all");
            this.prevPage = $("#photoViewer-footer-prev");
            this.nextPage = $("#photoViewer-footer-next");
            this.mark = this.footer.find(".mark");
            this.thumb_list = $(".photoViewer-navBar");
            this.thumb_list_ul = this.thumb_list.find("ul");
            this.thumb_list_li = this.thumb_list.find("li");
            this.close = $(".photoViewer-close");
            this.loader = $(".photoViewer-loader");
            this.slideWidth = this.thumb_list.find("li").eq(0).width();
            this.slideAll = this.thumb_list.find("li").length;
            this.thumb_list_ul.css({"width": this.slideWidth * this.slideAll + "px"});
            this.currNum.html(this.slideIdx + 1);
            this.totalNum.html(this.slideAll);
            if(this.slideIdx != 0){
                this.markSlide();
                this.navSlide();
            }
            this.setPrevNext();
            this.photoLoad();
            $(".photoViewer").show();
        },
        bind: function(){
            var me = this;
            $(window).resize(function(){
                me.resize();
                me.imgResize(me.photoCurWidth,me.photoCurHeight);
            });
            /*me.footer.on("mouseenter", function(){
                if(me.thumbMoveTag == false){
                    me.thumbMoveTag = true;
                    me.thumb_list.parent().show();
                    me.footer.animate({"height":"128px"}, 500, function(){
                        me.thumbMoveTag = false;
                    });
                }
            });
            me.footer.on("mouseleave", function(){
                if(me.thumbMoveTag == false){
                    me.thumbMoveTag = true;
                    me.footer.animate({"height": "30px"}, 500, function(){
                        me.thumb_list.parent().hide();
                        me.thumbMoveTag = false;
                    });
                }
            });*/
            me.thumb_list.on("click", "li", function(e){//小图点击事件
                if(me.isMarkSliding == false && me.isNavSliding == false){   
                    me.isMarkSliding = true;
                    me.isNavSlideing = true;
                    me.slideIdx = $(e.target).parent().index();
                    me.markSlide();
                    me.navSlide();
                    me.setPrevNext();
                    me.photoLoad();
                }  
            });
            me.prev.on("click",function(e){//点击遮罩层显示上一个图
                if(me.slideIdx == 0){
                    return;
                }
                if(me.isMarkSliding == false && me.isNavSliding == false){   
                    me.isMarkSliding = true;
                    me.isNavSlideing = true;
                    me.slideIdx --;
                    me.markSlide();
                    me.navSlide();
                    me.setPrevNext();
                    me.photoLoad();
                }
            });
            me.next.on("click",function(e){//点击遮罩层显示下一个图
                if(me.slideIdx == me.slideAll - 1){
                    return;
                }
                if(me.isMarkSliding == false && me.isNavSliding == false){   
                    me.isMarkSliding = true;
                    me.isNavSlideing = true;
                    me.slideIdx ++;
                    me.markSlide();
                    me.navSlide();
                    me.setPrevNext();
                    me.photoLoad();
                }
            });
            me.prevPage.on("click",function(e){//点击小图列表向左箭头
                if(me.slideIdx == 0){
                    return;
                }
                if(me.isMarkSliding == false && me.isNavSliding == false){   
                    me.isMarkSliding = true;
                    me.isNavSlideing = true;
                    me.slideIdx --;
                    me.markSlide();
                    me.navSlide();
                    me.setPrevNext();
                    me.photoLoad();
                }
            });
            me.nextPage.on("click",function(e){//点击小图列表向右箭头
                if(me.slideIdx == me.slideAll - 1){
                    return;
                }
                if(me.isMarkSliding == false && me.isNavSliding == false){   
                    me.isMarkSliding = true;
                    me.isNavSlideing = true;
                    me.slideIdx ++;
                    me.markSlide();
                    me.navSlide();
                    me.setPrevNext();
                    me.photoLoad();
                }
            });
            me.close.bind("click", function(){
                me.container.hide();
            });
            
        },
        markSlide: function(){//框移动，列表两端框移动，列表中间框固定中间不动
            var me = this;
            if(me.slideAll <= me.slideScreenLen){
                me.mark.animate({"left": me.slideWidth * me.slideIdx +"px"}, me.slideSpeed,function(){
                    me.isMarkSliding = false;
                });
            }else{
                if(me.slideIdx < 3){//列表前端(0,1,2)
                    me.mark.animate({"left": me.slideWidth * me.slideIdx +"px"}, me.slideSpeed,function(){
                        me.isMarkSliding = false;
                    });
                }else if(me.slideIdx >= 3 && me.slideIdx < me.slideAll - 3){//列表中端
                    me.mark.animate({"left": me.slideWidth * 3 +"px"}, me.slideSpeed,function(){
                        me.isMarkSliding = false;
                    });
                }else{//列表末端(len-3,len-2,len-1)
                    me.mark.animate({"left": me.slideWidth * (me.slideScreenLen - (me.slideAll - me.slideIdx)) +"px"}, me.slideSpeed,function(){
                        me.isMarkSliding = false;
                    });
                }
            }
            
        },
        navSlide: function(){//列表移动，两端不动，列表中段移动到中间位置
            var me = this;
            if(me.slideAll <= me.slideScreenLen){
                me.thumb_list_ul.css({"marginLeft":  "0px"});
            }else{
                if(me.slideIdx < 3){//列表前端(0,1,2)
                    me.thumb_list_ul.animate({"marginLeft":  "0px"}, me.slideSpeed,function(){
                        me.isNavSliding = false;
                    });
                }else if(me.slideIdx >= 3 && me.slideIdx < me.slideAll - 3){//列表中端
                    me.thumb_list_ul.animate({"marginLeft": - me.slideWidth * (me.slideIdx - 3) + "px"}, me.slideSpeed, function(){
                        me.isNavSliding = false;
                    });
                }else{//列表末端(len-3,len-2,len-1)
                    me.thumb_list_ul.animate({"marginLeft": - me.slideWidth * (me.slideAll - me.slideScreenLen) +"px"}, me.slideSpeed,function(){
                        me.isNavSliding = false;
                    });
                }
            }      
        },
        setPrevNext: function(){
            if(this.slideIdx == 0){//第一个
                this.prevPage.addClass("none");
                this.prev.hide();
            }else{
                if(this.prevPage.hasClass("none")){
                    this.prevPage.removeClass("none");
                }
                this.prev.show();

            }
            if(this.slideIdx == this.slideAll - 1){//最后一个
                this.nextPage.addClass("none");
                this.next.hide();
            }else{
                if(this.nextPage.hasClass("none")){
                    this.nextPage.removeClass("none");
                }
                this.next.show();
            }
        },
        photoLoad: function(){
            var me = this;
            me.loader.show();
            me.bigImg.attr("src",me.photoData[me.slideIdx].url1);
            me.bigImg.hide().css({"filter":"alpha(opacity=0)","opacity":0});
            var img = new Image();
            img.src = this.bigImg.attr("src");
            var timer = setInterval(function() {
                if (img.complete) {
                    clearInterval(timer);
                    me.photoCurWidth = img.width;
                    me.photoCurHeight = img.height;
                    me.imgResize(me.photoCurWidth,me.photoCurHeight);
                    me.loader.hide();
                    me.bigImg.show().animate({"filter":"alpha(opacity=100)","opacity":1}, 1000);
                    img = null;
                }
            }, 50);
            me.currNum.html(me.slideIdx + 1);
        },
        imgResize: function(w0,h0){
            var w,h,marginTop = 0;
            if(h0 > this.photoMaxHeight){
                if((this.photoMaxWidth / this.photoMaxHeight) >= (w0 / h0)){//按height计算
                    h = this.photoMaxHeight;
                    w = h * (w0 / h0);
                }else{//按width计算
                    w = this.photoMaxWidth;
                    h = w * (h0 / w0);
                }
            }else{
                if(w0 > this.photoMaxWidth){
                    w = this.photoMaxWidth;
                    h = w * (h0 / w0);
                }else{
                    w = w0;
                    h = h0;
                }
            }
            if(h < this.photoMaxHeight){
                marginTop = (this.photoMaxHeight - h) / 2;
            }
            this.bigImg.css({width:w+"px",height:h+"px",marginTop: marginTop+"px"});
        },
        resize: function(){
            var h_window = $(window).height();
            var w_window = $(window).width();
            //this.bigImgcontainer.css({"height":h_window + "px"});
            //this.bigImgcontainer.animate({"height":h_window + "px"}, 500);
            //this.loader.css({"height":h_window - h_navBar + "px"});
            this.photoMaxHeight = h_window;
            this.photoMaxWidth = w_window;
        }
    }

$(function(){
    $("[viewer=true]").on("click", function(e){
        var photoUrl = $(e.target).attr("detail");
        //console.log(photoUrl);
        $.ajax({
            url: photoUrl,
            type: "POST",
            dataType: "jsonp",
            jsonp: "_cb",
            success: function(json){
                if( json.errno == 0 && json.data.list.length!=0 ){
                    var bigPhoto = new photoViewer();
                    bigPhoto.photoData = json.data.list;
                    console.log(bigPhoto.photoData);
                    //bigPhoto.prevUrl = json.data.prev;
                    //bigPhoto.nextUrl = json.data.next;
                    bigPhoto.init();
                }else{
                    alert(json.msg);
                }
            }
        });
    });
});