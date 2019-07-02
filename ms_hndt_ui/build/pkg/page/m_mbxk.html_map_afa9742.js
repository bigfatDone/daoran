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
    "mobile/index": {
      "url": "/modules/mobile/index_48eb638.js",
      "type": "js",
      "deps": [
        "components/jquery/jquery",
        "components/layer/layer",
        "components/config/config"
      ]
    },
    "page/js/page/mobile": {
      "url": "/page/js/page/mobile_1d8b385.js",
      "type": "js",
      "deps": [
        "mobile/index"
      ]
    }
  },
  "pkg": {}
});