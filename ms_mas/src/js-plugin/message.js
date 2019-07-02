import Vue from 'vue'
import ElementUI from 'element-ui';

Vue.use(ElementUI, {size: 'mini'});

function init (obj) {
	obj.showClose = true;
	obj.customClass = "test-class";
	Vue.$message(obj);
}

init.prototype.error = function (obj) {
	Vue.$message.error(obj);
}

const install = function () {
	for (let item in Vue.$message) {
		console.log(item);
		init.prototype[item] = Vue.$message[item];
	}

	Vue.prototype.$message = init;
}

export default {
	install
}