(function() {

    // 创建一个全局对象, 在浏览器中表示为window对象, 在Node.js中表示global对象
    var root = this;

    var api;
    if (typeof exports !== 'undefined') {
        api = exports;
    } else {
        api = root.api = {};
    }


    // 定义api信息
    api.host = '/api_oms/';

    api.login = "api/user/login/verify";
    api.logout = "api/user/logout";
    api.infoUpdate = "api/user/info/update";
    api.getOrder = "api/order/infos/get";
    api.getHistoryOrder = "api/order/recs/get";
    api.saveOrder = "api/order/rec/add";
    api.saveOrders = "api/order/recs/add";

    api.pageSize = 10;

    api.userType = [{name:"促销人员",value:0},{name:"内部人员",value:1}];

    api.ajaxHeads = {ClientNo:"10001",Key:"iptv_oms_daoran"};

    api.product = [
        {name:"乐享音乐",value:"lxyy"},
        {name:"萌宝星空",value:"mbxk"},
    ];
    api.area = [
        {name:"平顶山",value:"0375"},
        {name:"周口",value:"0394"},
    ];
    api.code = [
        {name:"成功",value:10000000},
        {name:"失败",value:0},
    ];
    api.resultCodes = {
        10000000:"成功",
        30000001:"指定产品不存在",
        30000002:"无效的管理员标识",
        30000003:"管理员权限不足或欠费停机",
        30000004:"订购量达到封顶",
        30000005:"重复订购",
        30000006:"管理员类型不合法",
        30000007:"余额不足",
        30000008:"黑名单管理员",
        30000009:"订购关系不存在",
        30000010:"其他错误",
        30000011:"时间限制",
        30000012:"需要铜锁",
        30000013:"需要在线支付",
        30000014:"订购模式不支持",
        30000015:"消费额度达到封顶",
        30000016:"账号状态错误",
        30000017:"外部接口错误",
        30000019:"需要通过提交BaseForm跳转至支付平台",
        30000020:"需要扫码",
        30000021:"需要通过url直接重定向至支付平台",
        30000022:"产品订购鉴权生产订单",
        30000023:"存在未完成业务",
        30000099:"取消操作",
        30001000:"免费赠送成功"
        };


}).call(this);