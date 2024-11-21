import Vue from "vue";
import Vuex from "vuex";
import CartModule from "./modules/cart";
import MiniCartModule from "./modules/miniCart";
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	getters: {},
	modules: {
		cartModule: CartModule,
		miniCartModule: MiniCartModule,
	},
});

export default store;
