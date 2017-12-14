$(document).ready(function(){
    $('.uploadPicBtn').click(function(){
        $('.uploadPicbox').show();
    });
    $('.uploadPicbox .upClose').click(function(){
        $('.uploadPicbox').hide();
    });

    //上传图片
    var msgBox=$('.uploadSub>span');
    var pickfiles = $(".selectBtn").length;
    var uploader = [];
    for(var j = 1;j <= pickfiles;j++){
        uploader[j] = new plupload.Uploader({
            runtimes : 'html5,flash,silverlight,html4',
            browse_button : 'pickfiles' + j +'',//绑定id
            container: document.getElementById('container' + j),
            url : 'http://open.house.ifeng.com/admin/file/upload',//上传地址
            flash_swf_url : "http://s0.ifengimg.com/2016/08/29/Moxie_400ef63a.swf",
            silverlight_xap_url :"http://open.house.ifeng.com/assets/plupload/Moxie.xap",
            uplength:null,
            filters : {
                max_file_size : '2mb',
                prevent_duplicates : false,
                mime_types: [
                    {title : "Image files", extensions : "jpg,png,jpeg"},
                ]
            },
            init: {
                FilesAdded: function(up, files) {
                    msgBox.html('图片上传中!');
                    for(var i=0;i<files.length;i++){
                        if(files[i].origSize > 1024000*5){//限制大小
                            msgBox.html('照片不能超过5MB,请调整后重新上传!');
                            up.removeFile(files[i]);
                        };
                    }
                    plupload.each(files, function(file) {});//初始化执行
                    this.start();//执行
                },
                FileUploaded: function (up, file, info) {//成功一个创建预览
                    var fileslength = up.files.length;
                    if (info.response != null) {
                        var j = $(this.settings.container).attr("id").substr(9,1);
                        var twenty = $(".twenty"+j).length;
                        if(twenty > 3){
                            msgBox.html('上传图片数不得超过3张。');
                            return false;
                        }else{
                            var jsonstr = eval("(" + info.response + ")");
                            var data = jsonstr.data;
                            if (jsonstr && jsonstr.errno == "0") {
                                var imgurl=data.file;
                                //var msg = "<li class='twenty twenty"+ j +"' ><img src='"+imgurl+"' /></li>";
                                var msg="<li class='clearfix twenty twenty"+ j +"'>"+
                                        "<a href='javascript:;'></a>"+
                                        "<img src='"+imgurl+"' alt=''>"+
                                        "<p>"+
                                        "<span class='ys'>已设为封面</span>"+
                                        "<span class='ws'>设为封面</span>"+
                                        "</p>"+
                                        "</li>";
                                $(".picshow").append(msg);
                            }
                        }
                    }
                },
                UploadComplete:function(up, file){
                    $(".picshow li:first").addClass('selected');
                    $(".picshow>li").click(function(){
                        $(".picshow>li").removeClass('selected');
                        $(this).addClass('selected');
                    });
                    $(".picshow>li>a").click(function(){
                        $(this).parent().remove();
                    });

                    //msgBox.html('');
                },
                Error: function(up, err) {
                    msgBox.html(err.message);
                }
            }
        });
        uploader[j].init();
    }

    //提交上传图片信息
    var uploadPicSubmit = {
        authorName: $("#authorName"),
        authorNameVal: null,
        picIntr: $("#picIntr"),
        picIntrVal:null,
        applyMsgContainer: $(".uploadSub>span"),
        applyMsg: "",
        photos:{
            datas : [],
            main:''
        },
        applySubmitBtn: $(".uploadSub>input"),
        applyUrl: ' ',
        applyRegArr: [/^(([\u4E00-\u9FA5]{2,7})|([a-zA-Z]{2,30}))$/, /^(([\u4E00-\u9FA5]{0,30})|([a-zA-Z]{0,30}))$/],
        init: function(){
            var me = this;
            me.applySubmitBtn.on("click", function(){
                var pl=$('.picshow>li');
                for(var i=0;i<pl.length;i++){
                    me.photos.datas.push(pl.eq(i).find('img').attr('src'));
                    if(pl.eq(i).hasClass('selected')){
                        me.photos.main=pl.eq(i).find('img').attr('src');
                    }
                }
                //console.log(me.photos);
                me.applySubmit();
            });
            $(".uploadPicbox input[type=text]").on("focus", function(e){
                var targetInput = $(e.target);
                var inputValue = $.trim(targetInput.val());
                var inputDefault = targetInput.attr("defaultValue");
                if(inputValue == inputDefault){
                    targetInput.val("");
                }
            });
            $(".uploadPicbox input[type=text]").on("blur", function(e){
                var targetInput = $(e.target);
                var inputValue = $.trim(targetInput.val());
                var inputDefault = targetInput.attr("defaultValue");
                if(inputValue == ""){
                    targetInput.val(inputDefault);
                }

            });
        },
        applySubmit: function(){
            var me = this;
            var applyFlag = true;
            me.applyMsgContainer.html(" ");

            me.authorNameVal = $.trim(me.authorName.val());
            me.picIntrVal = $.trim(me.picIntr.val());

            var pl=$('.picshow>li').length;
            if(pl==0){
                me.applyMsg = "请上传图片！";
                me.applyMsgContainer.html(me.applyMsg);
                applyFlag = false;
                return;
            }

            if(me.authorNameVal == "" || me.authorNameVal == me.authorName.attr("defaultValue")){
                me.applyMsg = "请正确填写姓名！";
                me.applyMsgContainer.html(me.applyMsg);
                applyFlag = false;
                return;
            }else{
                if(!me.applyRegArr[0].test(me.authorNameVal)){
                    me.applyMsg = "请正确填写姓名，至少两个英文或汉字！";
                    me.applyMsgContainer.html(me.applyMsg);
                    applyFlag = false;
                    return;
                }
            }
            if(me.picIntrVal == "" || me.picIntrVal == me.picIntr.attr("defaultValue")){
                me.applyMsg = "请填写简介！";
                me.applyMsgContainer.html(me.applyMsg);
                applyFlag = false;
                return;
            }else{
                if(!me.applyRegArr[1].test(me.applyTelVal)){
                    me.applyMsg = "请正确填写简介，最多30字！";
                    me.applyMsgContainer.html(me.applyMsg);
                    applyFlag = false;
                    return;
                }
            }
            if(applyFlag == false){
                me.applyMsg = "请填写正确信息！";
                me.applyMsgContainer.html(me.applyMsg);
                return;
            }else{
                $.ajax({
                    url: me.applyUrl,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        'authorName':encodeURI(me.authorNameVal),
                        'picIntr':encodeURI(me.picIntrVal),
                        'photos':me.photos,
                        '_t':parseInt(new Date().getTime()/1000)
                    },
                    success: function(json){
                        me.applyMsg = json.data.info;
                        me.applyMsgContainer.html(me.applyMsg);
                    },
                    error:function(err){

                    }
                });
            }
        }
    };
    uploadPicSubmit.init();
});
