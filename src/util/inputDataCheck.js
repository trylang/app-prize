export var checkMobile = function (str) {
        return new RegExp("^0?(13|15|18|14|17)[0-9]{9}$").test(str);
}

export var isIdCard = function (str) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(str)
}
export var validateIdCard = function (idCard) {
        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if (regIdCard.test(idCard)) {
                if (idCard.length == 18) {
                        var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2);
                        var idCardWiSum = 0;
                        for (var i = 0; i < 17; i++) {
                                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                        }
                        var idCardMod = idCardWiSum % 11;
                        var idCardLast = idCard.substring(17);
                        if (idCardMod == 2) {
                                if (idCardLast == "X" || idCardLast == "x") {
                                        return true;
                                } else {
                                        return false;
                                }
                        } else {
                                if (idCardLast == idCardY[idCardMod]) {
                                        return true;
                                } else {
                                        return false;
                                }
                        }
                }
        } else {
                return false;
        }
}
export var isChineseName = function (str) {
        var reg = /^[\u4E00-\u9FA5]{2,4}$/;
        return reg.test(str);
}
export var checkEmail = function (str) {
        var reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        return reg.test(str);
}
