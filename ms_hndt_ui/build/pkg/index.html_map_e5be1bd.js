require.resourceMap({
  "res": {
    "components/layer/layer": {
      "url": "/components/layer/layer_4f97f07.js",
      "type": "js"
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
      "type": "js"
    },
    "common/common": {
      "url": "/modules/common/common_317e3be.js",
      "type": "js",
      "deps": [
        "components/config/config",
        "components/cookie/cookie",
        "components/artTemplate/artTemplate"
      ]
    },
    "head/index": {
      "url": "/modules/head/index_71e4b19.js",
      "type": "js",
      "deps": [
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
        "components/config/config",
        "common/common"
      ]
    },
    "pagination/index": {
      "url": "/modules/pagination/index_25e1d42.js",
      "type": "js"
    },
    "addOrder/index": {
      "url": "/modules/addOrder/index_28e431f.js",
      "type": "js",
      "deps": [
        "components/config/config",
        "components/artTemplate/artTemplate",
        "components/layer/layer",
        "common/common",
        "components/cookie/cookie",
        "orderMain/index"
      ]
    },
    "orderMain/index": {
      "url": "/modules/orderMain/index_e542423.js",
      "type": "js",
      "deps": [
        "components/layer/layer",
        "components/artTemplate/artTemplate",
        "components/config/config",
        "pagination/index",
        "common/common",
        "addOrder/index",
        "components/helper/helper"
      ]
    },
    "components/helper/helper": {
      "url": "/components/helper/helper_3ca18b9.js",
      "type": "js",
      "deps": [
        "components/artTemplate/artTemplate",
        "components/config/config"
      ]
    },
    "page/js/page/order": {
      "url": "/page/js/page/order_545cc92.js",
      "type": "js",
      "deps": [
        "head/index",
        "menu/index",
        "orderMain/index"
      ]
    }
  },
  "pkg": {}
});