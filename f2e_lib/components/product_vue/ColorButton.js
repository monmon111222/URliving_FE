// 內頁 切換顏色按鈕
// 從上層props傳入參數
// productColorsData (陣列包 ALL顏色的陣列)
// colorIndex (數字 當前要顯示的顏色的序號)
// handleChangeColor (涵式 傳入數字可以改變當前顯示的顏色序號)

let ColorButton = {
	props: {
		productColorsData: {
			type: Array,
			required: true,
		},
		colorIndex: {
			type: Number,
			required: true,
		},
	},
	methods: {
		onClickColor(index) {
			// 當按下顏色按鈕時，檢查是不是不一樣，透過涵式改上層的ColorIndex
			if (this.colorIndex !== index) {
				this.$emit("handleChangeColor", index);
			}
		},
	},
	mounted: function () {},
	template: `
  <ul>
    <li v-for="(item,index) in productColorsData"
        :class="index === colorIndex ? 'active' : null">
        <a href='javascript:;'
           @click="onClickColor(index)">
          <img :src="item.PintSizePictureUrl"
               :alt="item.Name"
               :title="item.Name" />
        </a>
    </li>
  </ul>`,
};

export default ColorButton;
