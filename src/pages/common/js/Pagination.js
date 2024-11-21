/*
  傳入參數:
  otherArgs  其他預設參數的key和value
  page       當前頁數
  onePageQty 一頁幾筆資料
  totalQty   全部幾筆資料
*/

// 少於最大連續個數頁的分頁選擇器組件
const PaginatorLessThanMaxCont = {
	template: `
    <ul>
        <li v-for="(page, index) in prevPages" :key="page">
            <a :href="datas.linkUrl + 'P=' + page">{{page}}</a> 
        </li>
        <li class="active" >
            <span>{{datas.page}}</span> 
        </li>
        <li v-for="(page, index) in nextPages" :key="page">
            <a :href="datas.linkUrl + 'P=' + page">{{page}}</a> 
        </li>
    </ul>
    `,
	props: ["datas"],
	data: function () {
		return {
			prevPages: [],
			nextPages: [],
		};
	},
	created: function () {
		var _this = this;
		for (let i = 1; i <= _this.datas.pageTotal; i++) {
			if (i < _this.datas.page) {
				_this.prevPages.push(i);
			} else if (i > _this.datas.page) {
				_this.nextPages.push(i);
			}
		}
	},
};

// 前最大連續個數頁的分頁選擇器組件
const PaginatorFirstMaxCont = {
	template: `
    <ul> 
        <li v-for="(page, index) in prevPages" :key="page">
            <a :href="datas.linkUrl + 'P=' + page">{{page}}</a> 
        </li>
        <li class="active" >
            <span>{{datas.page}}</span> 
        </li>
        <li v-for="(page, index) in nextPages" :key="page">
            <a :href="datas.linkUrl + 'P=' + page">{{page}}</a> 
        </li>
        <li>
            <span>...</span> 
        </li>
        <li>
            <a :href="datas.linkUrl + 'P=' + datas.pageTotal">{{datas.pageTotal}}</a>
        </li>
    </ul>
    `,
	props: ["datas"],
	data: function () {
		return {
			prevPages: [],
			nextPages: [],
		};
	},
	created: function () {
		var _this = this;
		for (let i = 1; i <= _this.datas.maxCont; i++) {
			if (i < _this.datas.page) {
				_this.prevPages.push(i);
			} else if (i > _this.datas.page) {
				_this.nextPages.push(i);
			}
		}
	},
};

// 後最大連續個數頁的分頁選擇器組件
const PaginatorLastMax = {
	template: `
    <ul> 
        <li>
            <a :href="datas.linkUrl + 'P=1'">1</a> 
        </li>
        <li>
            <span>...</span> 
        </li>
        <li v-for="(page, index) in prevPages" :key="page">
            <a :href="datas.linkUrl + 'P=' + page">{{page}}</a> 
        </li>
        <li class="active" >
            <span>{{datas.page}}</span> 
        </li>
        <li v-for="(page, index) in nextPages" :key="page">
            <a :href="datas.linkUrl + 'P=' + page">{{page}}</a> 
        </li>
    </ul>
    `,
	props: ["datas"],
	data: function () {
		return {
			prevPages: [],
			nextPages: [],
		};
	},
	created: function () {
		var _this = this;
		for (var i = _this.datas.pageTotal - _this.datas.maxCont + 1; i <= _this.datas.pageTotal; i++) {
			if (i < _this.datas.page) {
				_this.prevPages.push(i);
			} else if (i > _this.datas.page) {
				_this.nextPages.push(i);
			}
		}
	},
};

// 一般的分頁選擇器組件
const PaginatorNormal = {
	template: `
    <ul> 
        <li>
            <a :href="datas.linkUrl + 'P=1'">1</a> 
        </li>
        <li>
            <span>...</span> 
        </li>
        <li>
            <a :href="datas.linkUrl + 'P=' + (datas.page-1)">{{datas.page-1}}</a> 
        </li>
        <li class="active" >
            <span>{{datas.page}}</span> 
        </li>
        <li>
            <a :href="datas.linkUrl + 'P=' + (datas.page+1)">{{datas.page+1}}</a> 
        </li>
        <li>
            <span>...</span> 
        </li>
        <li>
            <a :href="datas.linkUrl + 'P=' + datas.pageTotal">{{datas.pageTotal}}</a>
        </li>
    </ul>
    `,
	props: ["datas"],
};

// 分頁選擇器組件控制器
const PaginationControl = {
	template: `
    <div class="pagination__control">
        <a v-if="datas.page > 1" :href="datas.linkUrl +'P='+ (datas.page-1)" class="pagination__btn pagination__btn--prev" ></a>
        <div class="d-inline-block" v-if="datas.pageTotal <= datas.maxCont + 1">
            <PaginatorLessThanMaxCont :datas="datas"></PaginatorLessThanMaxCont>
        </div>
        <div class="d-inline-block" v-else>
            <PaginatorFirstMaxCont v-if="datas.page < datas.maxCont" :datas="datas"></PaginatorFirstMaxCont>
            <PaginatorLastMax v-else-if="datas.pageTotal - datas.page < datas.maxCont" :datas="datas"></PaginatorLastMax>
            <PaginatorNormal v-else :datas="datas"></PaginatorNormal>
        </div>
        <a v-if="datas.page < datas.pageTotal" :href="datas.linkUrl +'P=' + (datas.page+1)" class="pagination__btn pagination__btn--next" ></a>
    </div>
    `,
	components: {
		PaginatorLessThanMaxCont,
		PaginatorFirstMaxCont,
		PaginatorLastMax,
		PaginatorNormal,
	},
	props: ["datas"],
};

const Pagination = {
	template: `
      <div class="pagination">
        <PaginationControl :datas="datas"></PaginationControl>
      </div>
      `,
	props: ["page", "onepageqty", "totalPage"],
	components: {
		PaginationControl,
	},
	data: function () {
		return {
			datas: {},
			nowpage: this.page || 1,
			pageCount: window.PageCount || this.totalPage,
			onePageQty: this.onepageqty,
		};
	},
	created: function () {
		const nowLoacation = window.location.toString();
		// const otherArgs = props.otherArgs || {}
		let args;
		let argsString = "";
		const searchLocation = window.location.search;
		let _this = this;

		// 先把篩選參數裝起來並刪除page
		if (nowLoacation.indexOf("?") !== -1) {
			args = nowLoacation.split("?")[1].split("&");
			let i = 0;
			while (i < args.length) {
				if (args[i].indexOf("P=") !== -1) {
					args.splice(i, 1);
				} else {
					i++;
				}
			}
			// 再把篩選參數組回去
			if (args.length !== 0) {
				argsString = `${args.join("&")}&`;
			}
		}

		if (searchLocation.length !== 0) {
			let args = searchLocation.split("?")[1].split("&");
			for (let i = 0; i < args.length; i++) {
				if (args[i].indexOf("P=") !== -1) {
					_this.nowpage = parseInt(args[i].replace("P=", ""));
				}
			}
		} else {
			this.nowpage = 1;
		}
		const linkUrl = `${window.location.pathname}?${argsString}`;

		// 設定傳入子層資料
		this.datas = {
			maxCont: 5, // 設定分頁選擇器最大連續個數
			page: this.nowpage,
			pageTotal: this.pageCount,
			linkUrl: linkUrl,
		};
	},
};

export default Pagination;
