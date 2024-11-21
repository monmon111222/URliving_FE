import common from "@page/common/js/common";
import cartApp from "@page/cart2/js/cartStep2";

if (process.env.NODE_ENV === "development") {
	Vue.config.devtools = true;
}

const App = new cartApp();
