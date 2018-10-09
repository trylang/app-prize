//检查上传图片的格式、长、宽、高与文件大小
/**
 * @param {any} file    文件路径
 * @param {any} width   允许宽度
 * @param {any} height  允许高度 
 * @param {any} size    允许文件大小
 * @returns Object
 * {
 *      passed : true | false  , //上传图片是否符合要求 
 *      message : ''   //错误信息
 * }
 */
function checkFileUploadSizeFn(file , width , height , size , callback){
    let sizeAllow = checkFileSizeFn(file , size) ; 
    if(!sizeAllow){
        callback({
            passed : false , 
            message : "图片大小不能超过"+size+"K，请选择重新上传" , 
        }) ; 
        return false;
    }
    else{
        checkWidthAndHeightFn(file , width , height , callback);
    }
}


//js 选择图片大小检查
/**
 * @param {any} file    图片路径 
 * @param {any} size    允许文件大小
 * @returns  true | false  返回检测结果
 */
function checkFileSizeFn(file , size){
    if(file.files && file.files[0]){
        var fileData = file.files[0];
        var fileSize = fileData.size; 
        var isAllow = false;
        if(!fileSize){
            return false;
        }
        var maxSize = size;
        maxSize = maxSize * 1024;
        return fileSize <= maxSize;        
    }else{
        /*... ie9以下请写*/
        /*
        // 或者用以面的方式实现
        // var img = new Image();
        // 再用img.src=filepath,再用img.fileSize用取
        */
    }
}

/** 检测上传的图片宽高
 * @param {any} file        图片路径 
 * @param {any} allowWidth       允许上传图片的宽
 * @param {any} allowHeight      允许上传图片的高
 */
function checkWidthAndHeightFn(file , allowWidth , allowHeight , callback){
    var isAllow = false;
    if(file.files && file.files[0]){
        var fileData = file.files[0];
        //读取图片数据
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload=function(){
                var width = image.width;
                var height = image.height;
                isAllow = width <= allowWidth && height <= allowHeight;
                if(isAllow){
                    callback({
                        passed : true , 
                        message : ""
                    });
                }
                else{
                    callback({
                        passed : false , 
                        message : "上传图片尺寸不符合要求("+allowWidth+"px*"+allowHeight+"px)，请重新上传"
                    });
                }
            };
            image.src= data;
        };
        reader.readAsDataURL(fileData);
    }else{
        
    }
}

//上传图片时文件大小检测
export var checkFileSize = checkFileSizeFn ; 
//上传图片时文件宽高检测
export var checkWidthAndHeight = checkWidthAndHeightFn ; 
//上传图片时图片格式检查与图片大小
export var checkFileUploadSize = checkFileUploadSizeFn ; 
