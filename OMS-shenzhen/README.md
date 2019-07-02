## 管理系统 
 一个基于angular5.0.0+ng-bootstrap1.0.0-beta.8+bootstrap4.0.0-beta.2+scss的后台管理系统界面

## 规范
1. 参考官网https://angular.cn/guide/styleguide


## 环境
1. 下载并安装nodeJS环境
2. angular-cli安装：cnpm install -g angular-cli
3. 安装与配置yarn，参考：https://yarnpkg.com/zh-Hans/ <br/>
   2.1 使用cnpm i -g yarn 或 npm i -g yarn安装yarn<br/>
   2.2 配置registry地址：yarn config set registry http://registry.npm.taobao.org<br/>
   2.3 配置sass-binary-site地址：yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass


## 安装
1. cd E:\project\operateSystem                            <---- 进入到项目所在的目录
2. yarn install                                <---- 安装


## 启动
1. cd E:\project\operateSystem                            <---- 进入到项目所在的目录
2. npm start                                   <---- 使用npm命令运行
3. 浏览器中输入http://localhost:4200/         <---- 本机访问


## 构建
1. npm run build                               <---- 使用npm命令构建，构建完成后会在项目中出现一个client目录


## 部署打包
1. 首先使用构建命令(npm run build)打包，打包完成后项目中会出现一个client的目录，这个目录就是我们最终要部署的包了。
2. 将cc-client整个目录复制到服务器里。
3. 注：<br/>
   3.1 想将默认的client修改成你自己的base路径，打开package.json，修改构建命令build，将client修改成你自己的base路径。<br/>
   3.2 想将打包生成的目录client修改成你自己的名称，打开.angular-cli.json，修改配置outDir，将client修改成你自己的名称。
       

## 单元测试
1. npm test  

## 目录
```
Project
    |-- e2e
    |-- src
        |-- environments                                   环境
            |-- environment.prod.ts                        生产环境
            |-- environment.ts                             非生产环境
        |-- app
            |-- app.component.{ts,html,css,spec.ts}        使用HTML模板、CSS样式和单元测试定义AppComponent组件。 它是根组件，随着应用的成长它会成为一棵组件树的根节点。
            |-- global-constant                            静态全局数据
            |-- business                                   页面主组件
                |-- demo                                   demo实例 
                |-- department                             部门管理页
                |-- home                                   主页 
                |-- menu                                   菜单管理页 
                |-- user                                   用户管理页 
                
            |-- business-sevice                            组件服务 
            |-- business-shared                            页面细分组件
                |-- user                                   用户管理子组件集合
                    |-- user-list.component.html           组件的html
                    |-- user-list.component.scss           组件的样式
                    |-- user-list.component.spec.ts        组件的单元测试
                    |-- user-list.component.ts             组件的业务逻辑
                    |-- user-shared.module.ts              组件的模块管理
            |-- assets                                     静态资源
            |-- error-page                                 404页面
            |-- login                                      登陆页
            |-- noPower-page                               无权限的提示页面
            |-- pipe                                       管道
            |-- main                                       系统主体
        |-- index.html                                     入口主页面的HTML文件
        |-- main.ts                                        应用的主要入口点
        |-- polyfills.ts                                   不同的浏览器对Web标准的支持程度也不同。 填充库（polyfill）能帮我们把这些不同点进行标准化。
        |-- styles.scss                                    导入一些全局样式
        |-- test.ts                                        单元测试的主要入口点
        |-- tsconfig.{app|spec}.json                       ypeScript编译器的配置文件。tsconfig.app.json是为Angular应用准备的，而tsconfig.spec.json是为单元测试准备的。
    |-- package.json            依赖资源表
```



## GIT规范
1、feat：新增模块、组件
2、fix：xx问题
3、style：样式问题
4、doc：文档

## 文献
1.bootstrap插件  https://ng-bootstrap.github.io/#/components/accordion/examples
2.ngx中文文档  https://angular.cn/
3.FontAwesome 4.1.0  http://www.yeahzan.com/fa/facss.html
4.rxjs  http://cn.rx.js.org/


## 注意注意注意注意注意注意注意注意注意

1、弹窗不会随路由页面而关闭
DONE：在调动弹窗模块的组件类里，定义一个变量demoModal:any=null，当弹窗时this.demoModal=this.ngbModalService.open("类"),最后在组件销毁时先判断关闭if (this.userSaveModal != null) this.userSaveModal.close();
参考：/app/business-shared/user/user-list.component.ts

2、select的默认值
```
DONE：<select [(model)]=demo><option value=""></option></select>，组件里demo=""，默认值的option必须用value属性，[value]、[ngValue]都是无效的
参考：/app/business-shared/department/job-save.component.html
```

3、ng的表单校验
DONE：所有的input、select等表单的model都用formControlName属性绑定
赋值 this.saveJobForm.patchValue({key:val})
提值 this.saveJobForm.controls['key'].value
参考：/app/business-shared/department/job-save.component.html

4、菜单问题
【未解决】①.菜单数据来源于接口，页面title是静态的，如何同步？
        ②.刷新时，如果根据浏览器url，如何展现对应的菜单？
        
5、radio的name必须和表单校验的formControlName值一致！
参考： <input type="radio" name="aaaaaa" formControlName="aaaaaa" />
