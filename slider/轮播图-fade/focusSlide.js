
function focusSlide(container){
	this.slideList = container.find("ul");
	this.thumb = container.find("ol");
	this.preButton = null;
	this.nextButton = null;
	this.ispreNextShow = false;
	this.interval = 4000;
	this.speed = 1000;
	this.currentIdx = null;
	this.curInterval = null;
	this.isLoadImg = null;
}
focusSlide.prototype = {	
	init: function(){
		this.currentIdx = 0;
		this.isLoadImg = [];
		if( this.ispreNextShow == false ){
			
			if( this.preButton ) {
				this.preButton.hide();
			}
			if( this.nextButton ) {
				this.nextButton.hide();
			}
		}
		for(var i=0; i<this.slideList.children().length; i++){
			this.isLoadImg[i] = true;
		}
		this.creatThumb();
		this.autoSlide();
		this.bind();
	},		
	creatThumb: function(){
		if( this.thumb.children().length == 0 ){
			var thumb_html = "";
			for(var i=0; i<this.slideList.children().length; i++){
				thumb_html += "<li>" + (i + 1) + "</li>";
			}
			this.thumb.html(thumb_html);
		}
		this.thumb.children().eq(this.currentIdx).addClass("current");
	},
	loadImg: function(idx){
		if( this.isLoadImg[idx] ){
			var img = this.slideList.children().eq(idx).find("img");
			var src_original = img.attr("src_original");
			img.attr("src",src_original);
			this.isLoadImg[idx] = false;
		}
	},
	setCurrent: function(currentIdx){
		this.thumb.children().eq(currentIdx).addClass("current").siblings().removeClass("current");
		this.loadImg(currentIdx);
		this.slideList.children().hide().css({"filter":"alpha(opacity=0)","opacity":0});
		this.slideList.children().eq(currentIdx).show().animate({"filter":"alpha(opacity=100)","opacity":1}, this.speed);
	},
	bind: function(){
		var me = this;
		if( me.preButton ){
			me.preButton.on("click", function(){
				clearInterval(me.curInterval);
				me.prev();
				me.autoSlide();
			});
		}
		if( me.nextButton ){
			me.nextButton.on("click", function(){
				clearInterval(me.curInterval);
				me.next();
				me.autoSlide();
			});
		}
		me.thumb.on("click", function(e){
			clearInterval(me.curInterval);
			me.currentIdx = $(e.target).index();
			me.setCurrent(me.currentIdx);
			me.autoSlide();
		});
		if( me.ispreNextShow == false){
			me.slideList.parent().on("mouseover", function(){
				if( me.preButton ){
					me.preButton.show();
				}
				if( me.nextButton ){
					me.nextButton.show();
				}
			});
			me.slideList.parent().on("mouseout", function(){
				if( me.preButton ){
					me.preButton.hide();
				}
				if( me.nextButton ){
					me.nextButton.hide();
				}
			});
		}
	},
	prev: function(){
		this.currentIdx--;
		if( this.currentIdx < 0 ) this.currentIdx = this.slideList.children().length - 1;
		this.setCurrent(this.currentIdx);
	},
	next: function(){
		this.currentIdx++;
		if( this.currentIdx >= this.slideList.children().length ) this.currentIdx = 0;
		this.setCurrent(this.currentIdx);
	},
	autoSlide: function(){
		var me = this;
		me.curInterval = setInterval(function(){
			me.currentIdx++;
			if( me.currentIdx >= me.slideList.children().length ) me.currentIdx = 0;
			me.setCurrent(me.currentIdx);
		},me.interval);
	}
};