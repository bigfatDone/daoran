require.resourceMap({
  "res": {
    "components/jquery/jquery": {
      "url": "/components/jquery/jquery_1992eb7.js",
      "type": "js"
    },
    "components/layer/layer": {
      "url": "/components/layer/layer_4f97f07.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery"
      ]
    },
    "components/config/config": {
      "url": "/components/config/config_5a28870.js",
      "type": "js"
    },
    "components/artTemplate/artTemplate": {
      "url": "/components/artTemplate/artTemplate_65abd62.js",
      "type": "js"
    },
    "components/cookie/cookie": {
      "url": "/components/cookie/cookie_65a7da0.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery"
      ]
    },
    "common/common": {
      "url": "/modules/common/common_317e3be.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery",
        "components/config/config",
        "components/cookie/cookie",
        "components/artTemplate/artTemplate"
      ]
    },
    "head/index": {
      "url": "/modules/head/index_71e4b19.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery",
        "components/layer/layer",
        "components/config/config",
        "components/artTemplate/artTemplate",
        "common/common"
      ]
    },
    "menu/index": {
      "url": "/modules/menu/index_d3da768.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery",
        "components/config/config",
        "common/common"
      ]
    },
    "password/index": {
      "url": "/modules/password/index_89f3d54.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery",
        "components/layer/layer",
        "components/cookie/cookie",
        "common/common",
        "components/config/config",
        "components/artTemplate/artTemplate"
      ]
    },
    "page/js/page/password": {
      "url": "/page/js/page/password_194f57b.js",
      "type": "js",
      "deps": [
        "head/index",
        "menu/index",
        "password/index"
      ]
    }
  },
  "pkg": {}
});