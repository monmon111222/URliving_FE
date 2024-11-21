import jRange from "jquery-range";
import modal from "bootstrap/js/dist/modal";

const advancedSort = {
	template: `
	<li class="advanced-sort">
		<a @click.prevent="openPopup" class="sort-list-btn d-inline-block mx-auto position-relative" href="#" title="進階篩選">
			<i class="icon-advanced-sort"></i>
			<span>進階篩選</span>
		</a>	
	</li>	
	`,
	methods: {
		openPopup: function () {
			$("#lb-sort").modal("show");
		},
	},
};

const normalSort = {
	template: `
	<li class="sort">
		<a class="sort-list-btn d-inline-block mx-auto position-relative" href="#" title="排序">
			<i class="icon-sort"></i>
			<span>排序</span>
		</a>
		<div class="sub-list-block down-center">
			<ol class="sub-list">
				<li :class="{selected: selectedMode === 4}"><a :href="lowtohigh">$由低到高</a></li>
				<li :class="{selected: selectedMode === 3}"><a :href="hightolow">$由高到低</a></li>
				<li :class="{selected: selectedMode === 1}"><a :href="newtoold">最新上架</a></li>
				<li :class="{selected: selectedMode === 5}"><a :href="hottest">最高人氣</a></li>
			</ol>
		</div>		
	</li>
	`,
	data: function () {
		return {
			searchLocation: window.location.search,
			keyStr: "OM=",
			selectedMode: null,
		};
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
	created: function () {
		this.selectedMode = this.getOrderMode();
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
	},
};
const sortPopup = {
	template: `
	<div v-if="isload" id="lb-sort" class="modal fade" tabindex="-1">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h4 class="modal-title">進階篩選</h4>
	        <a href="#" data-dismiss="modal" class="r-lightbox__close"></a>
	      </div>
	      <div class="modal-body">
	        <div class="sort-block mb-2">
	          <h5 class="text-center">價格</h5>
	          <div class="sort-condition nowrap">
					<input type="hidden" class="range-slider" :value="condition.PriceLow + ',' + condition.PriceHigh" />
	          </div>
	        </div>
	        <div class="sort-block mb-2">
	          <h5 class="text-center">尺寸(可複選)</h5>
	          <div class="sort-condition size-opts">
	            <div v-for="(size, index) in condition.Sizes" :key="size.Key" class="size-block">
	              <div @click.prevent="addSize(size.Value)" :class="toggleSize(size.Value)" class="item-size">{{size.Key}}</div>

	            </div>
	          </div>
	        </div>
	      </div>
	      <div class="modal-footer">
	        <div class="row w-100">
	          <div class="col">
	            <a @click.prevent="clearCondition" class="btn btn-bgray w-100 btn-sm" href="#">清除</a>
	          </div>
	          <div class="col">
	            <a @click.prevent="goResult" class="btn btn-primary w-100 btn-sm" href="#">確定</a>
	          </div>
	        </div>
	      </div>
	    </div>
	  </div>
	</div>
	`,
	props: ["isload", "condition"],
	data: function () {
		return {
			selectedSizes: [],
			selectedPriceRange: [],
		};
	},
	watch: {
		isload: function (val) {
			var _this = this;
			if (val) {
				this.$nextTick(function () {
					$(".range-slider").jRange({
						from: _this.condition.PriceLow,
						to: _this.condition.PriceHigh,
						step: 100,
						format: "%s",
						width: 250,
						showLabels: true,
						isRange: true,
						theme: "theme-black",
					});
					this.getInitArgs();
				});
			}
		},
	},
	methods: {
		getInitArgs: function () {
			var initSize = this.getTargetArgValue("S=").split(",");
			if (initSize[0].length !== 0) this.selectedSizes = initSize;
			if (this.getTargetArgValue("PL") !== "")
				$(".range-slider").jRange("setValue", `${this.getTargetArgValue("PL")},${this.getTargetArgValue("PH")}`);
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
			$(".range-slider").jRange("setValue", `${this.condition.PriceLow},${this.condition.PriceHigh}`);
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
		getPriceRangeArg: function () {
			var pl = $(".pointer-label.low").text();
			var ph = $(".pointer-label.high").text();
			return $(".range-slider").val() !== this.condition.PriceHigh + "," + this.condition.PriceLow
				? "PL=" + pl + "&PH=" + ph
				: "";
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
					if (
						this.selectedSizes.length !== 0 ||
						$(".range-slider").val() !== this.condition.PriceHigh + "," + this.condition.PriceLow
					) {
						argsString = `${args.join("&")}&`;
					} else if (args.length !== 0) {
						argsString = `${args.join("&")}`;
					}
				}
			}
			if (
				this.selectedSizes.length !== 0 ||
				$(".range-slider").val() !== this.condition.PriceHigh + "," + this.condition.PriceLow
			) {
				window.location.href = `${window.location.pathname}?${argsString}${this.getPriceRangeArg()}${
					this.getPriceRangeArg().length !== 0 && this.getSizeArg().length !== 0 ? "&" : ""
				}${this.getSizeArg()}`;
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
		<ul class="sort-list main-list pb-3">
			<normal-sort></normal-sort>
			<advanced-sort></advanced-sort>
		</ul>
		<sortPopup :isload="isload" :condition="condition"></sortPopup>
	</div>	
	`,
	props: ["condition", "isload"],
	components: {
		advancedSort,
		normalSort,
		sortPopup,
	},
	created: function () {},
};

export default sortControl;
