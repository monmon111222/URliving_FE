import Vue from "vue";
import VueI18n from "vue-i18n";
import messages from "@page/locales/index.js";
import detectLang from "@global/helpers/detectLang";

Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: detectLang(),
	messages,
});

export default i18n;
