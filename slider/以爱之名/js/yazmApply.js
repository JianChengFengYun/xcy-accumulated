	var houseApply = {
		applyTel: $(".yazm_tel"),
		applyTelVal: null,
		applyVerifyCode: $(".yazm_valid"),
		applyVerifyCodeBtn: $(".yazm_codebtn"),
		applyVerifyCodeVal: null,
		applyCaptchas: $(".yazm_captchas"),//图片验证码按钮
		captchasInput: $(".yazm_picvalid"),//图片验证码
		captchasVal: null,//图片验证码的值
		applyMsgContainer: $(".yazm_msg"),
		applyMsg: "",
		applySubmitBtn: $(".yazm_submit"),
		applyAgree: $(".yazm_agree"),
		yazmId: $.trim($(".yazm_id").val()),
		applyVerifyTimeFlag: false,//true正在倒计时;false不在倒计时，可发送验证码
		applyCheckVerifyCodeUrl: 'http://house.ifeng.com/sale/api/valididentifycode',
		applyUrl: 'http://house.ifeng.com/sale/apply/activeapply',
		getPicVerifyUrl: 'http://house.ifeng.com/sale/api/getverifycode?s=',//获取图片验证码Url
		validverifyUrl: 'http://house.ifeng.com/sale/api/sendidentifycode',//验证图片验证码正确与否Url
		applyRegArr: [/^(([\u4E00-\u9FA5]{2,7})|([a-zA-Z]{2,30}))$/, /^1([38][0-9]{9}|(4[57]|5[0-35-9])[0-9]{8})$/, /^[a-zA-Z0-9]{6}$/i],
		init: function(){
			var me = this;
			me.applyCaptchas.attr("src", me.getPicVerifyUrl + Math.random());
			me.applyCaptchas.on("click", function(){//点击图片验证码切换
				me.applyCaptchas.attr("src", me.getPicVerifyUrl + Math.random());
			});
			me.applySubmitBtn.on("click", function(){//提交报名
				me.applySubmit();
			})
			me.applyVerifyCodeBtn.on("click", function(){//验证图片验证码，验证通过发送短信验证码
				me.applyStartVerify();
			});
			$(".yazm_item input[type=text]").on("focus", function(e){
				var targetInput = $(e.target);
				var inputValue = $.trim(targetInput.val());
				var inputDefault = targetInput.attr("defaultValue");
				if(inputValue == inputDefault){
					targetInput.val("");
					targetInput.removeClass("inputInit");
				}
			});
			$(".yazm_item input[type=text]").on("blur", function(e){
				var targetInput = $(e.target);
				var inputValue = $.trim(targetInput.val());
				var inputDefault = targetInput.attr("defaultValue");
				if(inputValue == ""){
					targetInput.val(inputDefault);
					targetInput.addClass("inputInit");
				}
				
			});
		},
		applyStartVerify: function(){
			var me = this;
			me.applyMsgContainer.html(" ");
			me.applyTelVal = $.trim(me.applyTel.val());
			var mobile = me.applyRegArr[1].test(me.applyTelVal) ? me.applyTelVal : '';
			if(mobile == ""){
				me.applyMsg = "<span>* 请填写正确的手机号码！</span>";
				me.applyMsgContainer.html(me.applyMsg);
			}else{
				if(me.applyVerifyTimeFlag == false){
					me.applyCheckCaptchas();
				}
			}
		},
		applyCheckCaptchas: function(){
			var me = this;
			me.captchasVal = $.trim(me.captchasInput.val());
			if(me.captchasVal == "" || me.captchasVal == me.captchasInput.attr("defaultValue")){
				me.applyMsg = "<span>* 请输入图片验证码！</span>";
				me.applyMsgContainer.html(me.applyMsg);
			}else{
				$.ajax({
					type: "POST",
					url: me.validverifyUrl,
					dataType: 'jsonp',
					jsonp: "_cb",
					data: {
						"signUpMobile": me.applyTelVal,
						"piccode": me.captchasVal,
						"callback": '_cb',
						//"token_message": GBL.token_message
					},
					success: function(json) {
						if(json.errno == 0){
		        	        me.applyVerifyTime();
			                me.applyCaptchas.attr("src", me.getPicVerifyUrl +"?s=" + Math.random());
							me.applyMsg = "<span>* 验证码已发送！</span>";
							me.applyMsgContainer.html(me.applyMsg);
			            }else{
			                if(json.msg){
								me.applyMsg = '<span>* '+json.msg+'</span>';
								me.applyMsgContainer.html(me.applyMsg);
			                }else{
								me.applyMsg = '<span>* 系统异常，请稍后重试！</span>';
								me.applyMsgContainer.html(me.applyMsg);
			                }
			            }
					}
				});
			}
			
		},
		applyVerifyTime: function(){
			var me = this;
			var second = 60;
			me.applyVerifyCodeBtn.addClass("inputGray");
			me.applyVerifyCodeBtn.val(second+"s 重新获取");
			me.applyVerifyTimeFlag = true;
			var timeRemain = setInterval(function(){
				second--;
				me.applyVerifyCodeBtn.val(second+'s 重新获取');   
				if(second <= 0){
					me.applyVerifyTimeFlag = false;
					me.applyVerifyCodeBtn.removeClass("inputGray");
					me.applyVerifyCodeBtn.val('获取验证码');
					clearInterval(timeRemain);
				}		
    		}, 1000);
		},
		applySubmit: function(){
			var me = this;
			var applyFlag = true;
			me.applyMsgContainer.html("");
			
			me.applyTelVal = $.trim(me.applyTel.val());
			me.applyVerifyCodeVal = $.trim(me.applyVerifyCode.val());
			if(me.applyTelVal == "" || me.applyTelVal == me.applyTel.attr("defaultValue")){
				me.applyMsg = "<span>* 请正确填写手机号！</span>";
				me.applyMsgContainer.html(me.applyMsg);
				applyFlag = false;
				return;
			}else{
				if(!me.applyRegArr[1].test(me.applyTelVal)){
					me.applyMsg = "<span>* 请正确填写手机号！</span>";
					me.applyMsgContainer.html(me.applyMsg);
					applyFlag = false;
					return;
				}
			}
			if(!me.applyRegArr[2].test(me.applyVerifyCodeVal)){
				me.applyMsg = "<span>* 请填写收到的6位短信验证码！</span>";
				me.applyMsgContainer.html(me.applyMsg);
				applyFlag = false;
				return;
			}
			if(applyFlag == false){
				me.applyMsg = "<span>* 请填写正确信息！</span>";
				me.applyMsgContainer.html(me.applyMsg);
				return;
			}else{
				$.ajax({
					url: me.applyCheckVerifyCodeUrl,
					dataType: 'jsonp',
					jsonp: "_cb",
					type: 'POST',
					data: {
						'signUpMobile':me.applyTelVal,
						'code':encodeURI(me.applyVerifyCodeVal),
						//'_siteid':GBL.site_info.id,
						'_t':parseInt(new Date().getTime()/1000),
						//'city':GBL.site_info.id,
						'yazm_id':me.yazmId
					},
					success: function(json){
						if(json.errno == 0){//短信验证码验证通过,发送报名数据
							$.ajax({
								url: me.applyUrl,
								dataType: 'jsonp',
								jsonp: "_cb",
								type: 'POST',
								data: {
									'signUpMobile':me.applyTelVal,
									'source_type':4,
									'verifyCode':encodeURI(me.applyVerifyCodeVal),
									//'_siteid':GBL.site_info.id,
									'_t':parseInt(new Date().getTime()/1000),
									//'city':GBL.site_info.id,
									'yazm_id':me.yazmId,
								},
								success: function(json){
									me.applyMsg = "<span>* " + json.data.info + "</span>";
									me.applyMsgContainer.html(me.applyMsg);
								}
							})
					  	}else{
					  		me.applyMsg = "<span>* " + json.msg + "</span>";
					  		me.applyMsgContainer.html(me.applyMsg);
					  	}

					}
				})
			}
			me.applyMsgHide();
		},
		applyMsgHide: function(){
			var me = this;
			var second = 5;
			var t = setInterval(function (){
		        if(second <= 0){
		        	me.applyMsgContainer.html('');
		        	clearInterval(t);
		        }
		        second--;
		    }, 1000);
		}
	};

	$(function(){
		houseApply.init();
	});