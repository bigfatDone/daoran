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
    "login/index": {
      "url": "/modules/login/index_9488209.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery",
        "components/layer/layer",
        "components/config/config",
        "common/common",
        "components/cookie/cookie"
      ]
    },
    "page/js/page/login": {
      "url": "/page/js/page/login_47b82d3.js",
      "type": "js",
      "deps": [
        "head/index",
        "login/index"
      ]
    }
  },
  "pkg": {}
});