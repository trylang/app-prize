function formatDate(datetime , fmt){
    let _this = new Date(datetime);
    var o = {
        "M+": _this.getMonth() + 1, 
        "d+": _this.getDate(),
        "h+": _this.getHours(),  
        "m+": _this.getMinutes(), 
        "s+": _this.getSeconds(), 
        "q+": Math.floor((_this.getMonth() + 3) / 3), 
        "S": _this.getMilliseconds() 
    };
    if (/(y+)/.test(fmt)){fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));}
    for (var k in o){
    	if (new RegExp("(" + k + ")").test(fmt)){fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));}
	}
    return fmt;
}

Date.prototype.addDays = Date.prototype.addDays || function (d) {  
    this.setDate(this.getDate() + d);  
    return this ; 
};  
Date.prototype.addWeeks = Date.prototype.addWeeks || function (w) {  
    this.addDays(w * 7);  
    return this ; 
};  
Date.prototype.addMonths = Date.prototype.addMonths || function (m) {  
    var d = this.getDate();  
    this.setMonth(this.getMonth() + m);  
    if (this.getDate() < d)  {
        this.setDate(0);  
    }
    return this ;
};  
Date.prototype.addYears = Date.prototype.addYears || function (y) {  
    var m = this.getMonth();  
    this.setFullYear(this.getFullYear() + y);  
    if (m < this.getMonth()) {  
        this.setDate(0);  
    }  
    return this ; 
}; 

//时间格式转换
export default formatDate = formatDate;
//添加天
// export var addDays = addDays ; 
// //添加星期
// export var addWeeks = addWeeks ; 
// //添加月
// export var addMonths = addMonths ; 
// //添加年
// export var addYears = addYears ; 