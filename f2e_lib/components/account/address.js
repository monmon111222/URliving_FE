import $ from "jquery";
import twzipcode from "@global/vendors/twzipcode-data";
import addressTemplate from "@page/member/js/addressTmpl";

const regionSelect = {
	template: addressTemplate.regionSelectTemplate,
	data: function () {
		return {
			selectedRegion: this.region,
			region_array: [
				{ value: "台灣及離島", name: "台灣及離島", eName: "Taiwan" },
				{ value: "香港", name: "香港", eName: "HongKong" },
				{ value: "澳門", name: "澳門", eName: "Macao" },
				{ value: "日本", name: "日本", eName: "Japan" },
				{ value: "澳大利亞", name: "澳大利亞", eName: "Australia" },
				{ value: "紐西蘭", name: "紐西蘭", eName: "NewZealand" },
				{ value: "美國", name: "美國", eName: "USA" },
				{ value: "英國", name: "英國", eName: "UnitedKingdom" },
				{ value: "馬來西亞", name: "馬來西亞", eName: "Malaysia" },
				{ value: "韓國", name: "韓國", eName: "Korea" },
				{ value: "越南", name: "越南", eName: "Vietnam" },
				{ value: "泰國", name: "泰國", eName: "Thailand" },
				{ value: "新加坡", name: "新加坡", eName: "Singapore" },
				{ value: "加拿大", name: "加拿大", eName: "Canada" },
				{ value: "德國", name: "德國", eName: "Germany" },
				{ value: "法國", name: "法國", eName: "France" },
				{ value: "中國", name: "中國", eName: "China" },
			],
		};
	},
	props: ["region"],
	methods: {
		changeRegion: function ($event, val) {
			this.$emit("onchange", val);
		},
	},
};

const areaTw = {
	template: addressTemplate.areaTwTemplate,
	data: function () {
		return {
			selectedAddress: this.address,
			seletedCounty: this.county,
			selectedZipcode: this.zipcode,
			selectedZid: "",
			counties: [],
			zipcodes: [],
			matchZipcode: [],
		};
	},
	props: ["region", "county", "zipcode", "address", "namecounty", "namedistrict", "nameaddress", "namezipcode"],
	created: function () {
		let data = twzipcode();
		this.counties = data.counties;
		this.zipcodes = data.zipcodes;

		this.mapZipcode(this.seletedCounty);
	},
	watch: {
		seletedCounty: function (val) {
			this.mapZipcode(val);
		},
		selectedZipcode: function (val) {
			var _this = this;
			this.selectedZid = _this.matchZipcode.find((obj) => obj.city == _this.selectedZipcode).id;
		},
	},
	methods: {
		changeCounty: function ($event, seletedCounty) {
			this.mapZipcode(seletedCounty);
			this.resetZipcode();
		},
		mapZipcode: function (val) {
			var _this = this;
			this.matchZipcode = [];
			this.zipcodes.forEach(function (el) {
				if (val === el.county) _this.matchZipcode.push(el);
			});

			setTimeout(function () {
				_this.selectedZid = _this.matchZipcode.find((obj) => obj.city == _this.selectedZipcode).id;
			});
		},
		resetZipcode: function () {
			this.selectedZipcode = this.matchZipcode[0].city;
		},
	},
};

const areaCn = {
	template: addressTemplate.areaCnTemplate,
	data: function () {
		return {
			selectedAddress: this.address,
			selectedProvince: this.province,
			cn_json: [
				{ value: "安徽", name: "安徽" },
				{ value: "北京", name: "北京" },
				{ value: "福建", name: "福建" },
				{ value: "广东", name: "广东" },
				{ value: "甘肃", name: "甘肃" },
				{ value: "广西壮族自治区", name: "广西壮族自治区" },
				{ value: "贵州", name: "贵州" },
				{ value: "湖北", name: "湖北" },
				{ value: "河北", name: "河北" },
				{ value: "河南", name: "河南" },
				{ value: "海南", name: "海南" },
				{ value: "黑龙江", name: "黑龙江" },
				{ value: "湖南", name: "湖南" },
				{ value: "吉林", name: "吉林" },
				{ value: "江苏", name: "江苏" },
				{ value: "江西", name: "江西" },
				{ value: "辽宁", name: "辽宁" },
				{ value: "内蒙古自治区", name: "内蒙古自治区" },
				{ value: "宁夏回族自治区", name: "宁夏回族自治区" },
				{ value: "青海", name: "青海" },
				{ value: "四川", name: "四川" },
				{ value: "山东", name: "山东" },
				{ value: "上海", name: "上海" },
				{ value: "陕西", name: "陕西" },
				{ value: "山西", name: "山西" },
				{ value: "天津", name: "天津" },
				{ value: "新疆维吾尔自治区", name: "新疆维吾尔自治区" },
				{ value: "西藏自治区", name: "西藏自治区" },
				{ value: "云南", name: "云南" },
				{ value: "浙江", name: "浙江" },
				{ value: "重庆", name: "重庆" },
			],
			provinceSelectMode: this.selectmode,
		};
	},
	props: ["selectmode", "province", "address", "nameaddress"],
};

const areaOther = {
	template: addressTemplate.areaOtherTemplate,
	data: function () {
		return {
			userAddress: this.address,
			selectedRegion: this.selected,
			otherSelectMode: this.selectmode,
		};
	},
	props: ["selectmode", "selected", "address", "nameaddress"],
};

const appAddress = {
	components: {
		areaTw,
		areaCn,
		areaOther,
		regionSelect,
	},
	data: {
		userAddress: {
			region: window.userRegion || "",
			county: window.userCounty || "",
			zipcode: window.userZipcode || "",
			province: window.userProvince || "",
			address: window.userAddress || "",
		},
		shippingAddress: {
			region: window.shippingRegion || "台灣及離島",
			county: window.recipientCity || "臺北市",
			zipcode: window.recipientDistrict || "南港區",
			province: window.shippingProvince || "",
			address: window.recipientAddress || "南港路三段47巷8號",
		},
		pickMode: "mode1", // {mode1: 同購買人資訊 mode2:不同購買人資訊}
	},
	methods: {
		changeUserRegion: function (val) {
			this.userAddress.region = val;
		},
	},
};

export default appAddress;
