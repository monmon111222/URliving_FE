import jRange from "jquery-range";
import modal from "bootstrap/js/dist/modal";

const sortPopup = {
	template: /*html*/ `
	<div v-if="isload" id="lb-sort" class="modal fade" tabindex="-1">
		<div class="modal-dialog h5" role="document">
			<div class="modal-content">
				<a href="#" class="modal-close" data-dismiss="modal"><i class="icon-close"><i></a>
				<span class="sort-title">SORT BY</span>
				<ol class="sub-list">
					<li :class="{selected: selectedMode === 1}"><a :href="newtoold">最新上架</a></li>
					<li :class="{selected: selectedMode === 5}"><a :href="hottest">最高人氣</a></li>
					<div class="d-sm-none w-100"></div>
					<li :class="{selected: selectedMode === 4}"><a :href="lowtohigh">價格：從低到高</a></li>
					<li :class="{selected: selectedMode === 3}"><a :href="hightolow">價格：從高到低</a></li>
				</ol>
				<span class="sort-title">BRAND</span>
				<div class="sort-brand"></div>
				<span class="sort-title">SIZE</span>
				<div class="sort-size">
					<template v-for="(size, index) in condition.Sizes" :key="size.Key">
						<a @click.prevent="addSize(size.Value)" :class="toggleSize(size.Value)" class="item-size">
							{{size.Key}}</a>
					</template>
				</div>
				<div class="sort-btn">
					<a @click.prevent="clearCondition" class="btn btn-reset" href="#">清除</a>
					<a @click.prevent="goResult" class="btn btn-confirm" href="#">確定</a>
				</div>
			</div>
		</div>
	</div>
	`,
	props: ["isload", "condition"],
	data: function () {
		return {
			searchLocation: window.location.search,
			keyStr: "OM=",
			selectedMode: null,
			selectedSizes: [],
		};
	},
	created: function () {
		this.selectedMode = this.getOrderMode();
	},
	watch: {
		isload: function (val) {
			if (val) {
				this.$nextTick(function () {
					this.getInitArgs();
				});
			}
		},
	},
	computed: {
		lowtohigh: function () {
			return this.locationSearchFilter(4);
		},
		hightolow: function () {
			return this.locationSearchFilter(3);
		},
		newtoold: function () {
			return this.locationSearchFilter(1);
		},
		hottest: function () {
			return this.locationSearchFilter(5);
		},
	},
	methods: {
		getOrderMode: function () {
			var args = this.searchLocation.split("&");

			var ModeStr = "";

			for (let i = 0; i < args.length; i++) {
				if (args[i].indexOf("OM") !== -1) {
					ModeStr = args[i];
				}
			}

			if (window.location.pathname === "/recent" && ModeStr.length === 0) {
				return 1;
			} else if (window.location.pathname === "/hot" && ModeStr.length === 0) {
				return 5;
			} else if (window.location.pathname === "/favorite" && ModeStr.length === 0) {
				return null;
			} else if (ModeStr.length === 0) {
				return 1;
			} else {
				return parseInt(ModeStr.charAt(ModeStr.length - 1));
			}
		},
		locationSearchFilter: function (orderNum) {
			var argsString = "";
			if (window.location.toString().indexOf("?") !== -1) {
				var args = window.location.toString().split("?")[1].split("&");

				let i = 0;
				while (i < args.length) {
					if (args[i].indexOf("OM") !== -1) {
						args.splice(i, 1);
					} else if (args[i].indexOf("P=") !== -1) {
						args.splice(i, 1);
					} else {
						i++;
					}
				}

				if (args.length !== 0) {
					// 存在其他條件參數
					argsString = `${args.join("&")}&`;
				} else {
					argsString = `${args.join("&")}`;
				}
			}

			return "?" + argsString + this.keyStr + orderNum;
		},
		getInitArgs: function () {
			var initSize = this.getTargetArgValue("S=").split(",");
			if (initSize[0].length !== 0) this.selectedSizes = initSize;
		},
		getTargetArgValue: function (arg) {
			var targetArgValue = "";
			var targetArg = "";
			if (window.location.search.length !== 0 && window.location.search.indexOf(arg) !== -1) {
				var args = window.location.toString().split("?")[1].split("&");
				args.forEach(function (element, index) {
					if (element.indexOf(arg) !== -1) {
						targetArg = element;
					}
				});
			}
			return targetArg.length !== 0 ? targetArg.substring(targetArg.indexOf("=") + 1, targetArg.length) : "";
		},
		clearCondition: function () {
			this.selectedSizes = [];
		},
		addSize: function (size) {
			var index = this.selectedSizes.findIndex(function (e) {
				return e == size.toString();
			});

			if (index >= 0) {
				this.selectedSizes.splice(index, 1);
			} else {
				this.selectedSizes.push(size.toString());
			}
		},
		toggleSize: function (size) {
			var isSelected = this.selectedSizes.includes(size.toString());
			return {
				active: isSelected,
				"": !isSelected,
			};
		},
		getSizeArg: function () {
			return this.selectedSizes.length !== 0 ? "S=" + this.selectedSizes.toString() : "";
		},
		goResult: function () {
			var argsString = "";
			//
			if (window.location.search.length !== 0) {
				var args = window.location.toString().split("?")[1].split("&");
				let i = 0;
				while (i < args.length) {
					if (args[i].indexOf("PH") !== -1) {
						args.splice(i, 1);
					} else if (args[i].indexOf("PL") !== -1) {
						args.splice(i, 1);
					} else if (args[i].indexOf("S=") !== -1) {
						args.splice(i, 1);
					} else if (args[i].indexOf("P=") !== -1) {
						args.splice(i, 1);
					} else {
						i++;
					}
				}
				if (args.length !== 0) {
					if (this.selectedSizes.length !== 0) {
						argsString = `${args.join("&")}&`;
					} else if (args.length !== 0) {
						argsString = `${args.join("&")}`;
					}
				}
			}
			if (this.selectedSizes.length !== 0) {
				window.location.href = `${window.location.pathname}?${argsString}${this.getSizeArg()}`;
			} else if (argsString.length === 0) {
				window.location.href = window.location.pathname;
			} else {
				window.location.href = `${window.location.pathname}?${argsString}`;
			}
		},
	},
};

const sortControl = {
	template: `
	<div>
		<a @click="openSort">
			<i class="icon-filter"></i>
		</a>
		<sortPopup :isload="isload" :condition="condition"></sortPopup>
	</div>	
	`,
	props: ["condition", "isload"],
	components: {
		sortPopup,
	},
	methods: {
		openSort() {
			$("#lb-sort").modal("show");
		},
	},
};

export default sortControl;
