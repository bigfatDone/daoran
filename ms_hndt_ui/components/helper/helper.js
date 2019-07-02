var template = require('artTemplate'),
    config = require('config');

var helper = {
    areaFilter: function(){
        template.helper('areaFilter', function (areaCode) {
            for(var i=0;i<config.area.length;i++){
                if(config.area[i].value === String(areaCode)){
                    return config.area[i].name;
                }
            }
        });
    },
    resultCodesFilter: function(){
        template.helper('resultCodesFilter', function (areaCode) {
            return config.resultCodes[parseInt(areaCode)];
        });
    },
    dateFilter: function(){
        template.helper('dateFilter', function (date) {
            var time = new Date(parseInt(date));
            var year = time.getFullYear();
            var month = time.getMonth()+1;
            if(month < 10 ) month = "0" + month;
            var day = time.getDate();
            if(day < 10 ) day = "0" + day;
            var hour = time.getHours();
            if(hour < 10 ) hour = "0" + hour;
            var minute = time.getMinutes();
            if(minute < 10 ) minute = "0" + minute;
            var second = time.getSeconds();
            if(second < 10 ) second = "0" + second;
            return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        });
    }
}

module.exports = helper;