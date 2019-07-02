
// 采用commonjs规范
fis.hook('commonjs');

//设置fis 打包ignore
fis.set('project.ignore', [
    '.git/**',
    '.svn/**',
    'build/**',
    '**.md',
    '**.log',
    '**.project',
    '.eslintignore',
    '.eslintrc.json',
    'fis-conf.js',
    'package.json',
    'node_modules/**',
    'MIT-LICENSE'
]);

// fis3 release -wL
fis.match('*.{js,css,scss}', {
    // md5
    useHash: false
})
// .match('*.html', {
//     useMap: true
// })
// .match('/modules/mallDesign/widgets/**.html', {
//   extras: {
//       isPage: true
//   }
// })
    .match('/modules/(**.{png,gif,jpg})', {
        useHash: false,
        release: '/page/images/$0',
        url: '/page/images/$0'
    })
    // components目录下的资源标注为组件
    .match("/components/**", {
        isMod: true,
        useMap: true,
        useSameNameRequire: true
    })
    //scss的编译
    .match('*.scss', {
        rExt: '.css',
        parser: fis.plugin('node-sass')
    })
    //模块化相关
    .match('/page/js/page/**.js', {
        isMod: true
    })
    .match(/^\/modules\/(.*)\.(js)$/i, {
        id: '$1',
        isMod: true
    })
    // .match('/modules/**/**.{css,scss}', {
    //     packTo: '/page/css/css.css' //css打成一个包
    // })
    .match('::packager', {
        postpackager: fis.plugin('loader', {
            resourceType: 'commonjs',
            // 资源映射表内嵌
            useInlineMap: false
        }),
        packager: fis.plugin('map'),
        spriter: fis.plugin('csssprites', {
            layout: 'matrix',
            margin: '15'
        })
    })
    // .match('::packager', {
    //     packager: fis.plugin('deps-pack', {
    //         '/pkg/components_common.js': [
    //             '/components/config/config.js',
    //             '/components/cookie/cookie.js',
    //             '/components/layer/layer.js',
    //             '/components/artTemplate/artTemplate.js'
    //         ]
    //     })
    // })
// 对CSS 背景图片有标注（images?__sprite）合并
/*    .match('*.css', {
        // 给匹配到的文件分配属性 `useSprite`，才会被处理
        useSprite: true
    })*/

// fis3 release prod
fis.media('prod')
    .match('**.{js,css,scss}', {
        useHash: true
    })
    .match('/page/css/**.css', {
        useHash: true
    })
    .match('/page/js/lib/**.{js,css,scss}', {
        useHash: false
    })
    .match('/{components,modules,page}/**.js', {
        optimizer: fis.plugin('uglify-js', {
            mangle: {
                expect: 'require,define,exports,module'
            },
            compress: {
                drop_console: true
            }
        })
    })
    .match('::packager', {
        postpackager: fis.plugin('loader', {
            allInOne: true
        })
    })
    .match('*.{css,scss}', {
        optimizer: fis.plugin('clean-css', {
        })
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor')
    });