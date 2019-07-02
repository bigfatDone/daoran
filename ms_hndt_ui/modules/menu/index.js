var $ = require("jquery"),
    config = require("config"),
    common = require("../common");
var menuModule = {
    init: function(){
        menuModule.menuClick();
        menuModule.curMenu();
        menuModule.menuPower();
    },
    menuClick: function(){
        $(".menu .typeName").click(function(){
            var li = $(this).parent("li");
            var subMenu = $(this).siblings(".subMenu");
            if($(li).hasClass("active")){
                $(li).removeClass("active");
                $(subMenu).slideUp();
            }else{
                $(li).addClass("active");
                $(subMenu).slideDown();
            }
        })
    },
    curMenu: function(){
        var pathName = window.location.pathname;
        var menus = $(".menu a");
        if(pathName === "/" || pathName === ""){
            $(menus).eq(0).parent().show();
            $(menus).eq(0).addClass("active");
            $(menus).eq(0).parents("li").addClass("active");
        }else{
            for(var i=0;i<menus.length;i++){
                var href = $(menus).eq(i).attr("href");
                var li = $(menus).eq(i).parents("li");
                if(pathName.indexOf(href) != -1){
                    $(menus).eq(i).parent().show();
                    $(menus).eq(i).addClass("active");
                    $(li).addClass("active");
                    $(li).siblings("li").removeClass("active").children(".subMenu").hide();
                }else{
                    $(menus).eq(i).parent().hide();
                    $(menus).eq(i).removeClass("active");
                    $(menus).eq(i).removeClass("active");
                    $(li).removeClass("active");
                }
            }
        }
    },
    menuPower:function(){
        common.isAdmin(function(){
            $("#manageMenu").removeClass("hidden");
        },"menu")
    }
};
module.exports = menuModule;