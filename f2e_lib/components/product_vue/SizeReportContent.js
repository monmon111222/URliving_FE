// 內頁 呈現尺寸表彈跳視窗
// 從上層props傳入參數
// sizeReportUrl (字串 尺寸表Html位置)
// scrollStyle (布林 在手機板是否要有捲動左右陰影)
// accordion (布林 是否有手風琴效果)

import accordion from "@global/components/global/accordion";
let SizeReportContent = {
	data: function () {
		return {};
	},
	props: {
		sizeReportHtml: {},
	},
	computed: {},
	methods: {},
	mounted: function () {
		accordion(".size-guide", { collapse: false, children: "div" }, null);
	},
	template: `
  <div>
    <h1>Size Guide</h1>
    <div>
    </div>
  </div>`,
};

module.exports = SizeReportContent;
