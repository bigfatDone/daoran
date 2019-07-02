道然后台订购管理系统
=====

## 构建环境

* fis3 `^3.4.28`
* node `^8.9.1`
* npm  `^5.5.1`


## 配置流程

道然后台订购管理系统 使用 `fis3` 来构建一个生产版本

首先你得确保全局安装了 `node`

```
安装 node

安装完毕后查看版本号

node -v
npm -v
```


## 安装步骤
```
1.安装cnpm,避免有些包国内下不下来
https://npm.taobao.org/
$ npm install -g cnpm --registry=https://registry.npm.taobao.org


2.全局安装项目依赖
cnpm i 
```

## 启动服务
```
cnpm start
```

## 工程提测
```
cnpm run prod -- [本地提测目录路径]
```

## api跨域

```
使用nginx代理解析

listen       nginx服务端口;
location / {
   root   html;
   index  index.html index.htm;
    proxy_pass   http://本地ip:项目服务端口/;
}

location ^~ /api_oms/ {
    proxy_pass   http://api的ip:api的端口;
}

项目启动后，访问地址 http://本地ip:nginx服务端口/
```


fis编译文件在：
C:\Users\Administrator\AppData\Local\.fis3-tmp\www

## 模块加载器

```
modJS

通过 fis3-hook-commonjs 的支持，FIS 能很好的支持 commonjs ，完全满足 commonjs 规范。
```


## 预处理语言

```
Sass

如果安装失败，一般都是下载问题，解决方法如下
1、先下载darwin-x64-11_binding.node：https://github.com/sass/node-sass/releases
2、比如放在D盘，cmd命令窗口输入：set SASS_BINARY_PATH=D:\darwin-x64-11_binding.node
3、查看设置有无成功，输入：echo %SASS_BINARY_PATH%
4、安装sass：cnpm i -g node-sass
```



## JS模板引擎

```
artTemplate：https://github.com/aui/artTemplate
```


## 开发目录结构

```
Project
    |-- components              外部资源库第三方插件
        |-- jquery
        |-- artTemplate         JS模板引擎
        |-- config              项目配置信息，如api地址
        |-- helper              template过滤规则，如时间数据过滤
        
    |-- modules                 模块 And 组件
        |-- common              多系统公共模块，如meta.html
        |-- head                头部信息（html、css、js）
        |-- menu                菜单列表（html、css、js）
		
    |-- page                    页面目录由组件拼接完成
        |-- img
        |-- js
            |-- lib             与模块无关的资源
            |-- page            与模块有关的资源
        |-- css
            |-- common.scss     后台项目的公共样式
            |-- m_common.scss   移动端h5页面的公共样式
        |-- orderHistory.html   内页：订单历史页面
        |-- info.html           内页：个人信息页面
        
    |-- fis-conf.js             fis3配置文件
    |-- README.md               文档
    |-- package.json            依赖资源表
    |-- index.html              项目首页
    |-- login.html              项目登陆页面
```