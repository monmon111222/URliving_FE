import common from "@page/common/js/common";
import brandBtn from "@page/common/dialog/brandBtn.vue";

$(".filter-btn").click(function (e) {
	e.preventDefault();
	var $el = $(this),
		target = $el.data("target");
	console.log("$(target).position();", $(target).position().top, $("#follow-title").height());
	$("html,body").animate(
		{
			scrollTop:
				$(target).position().top -
				$("#follow-title").height() -
				parseInt($("#follow-title").css("margin-bottom").replace("px", "")) -
				$("#follow-group").height(),
		},
		300
	);
});

new Vue({
	el: "#app-brand",
	components: {
		brandBtn,
	},
	data: {},
	created() {},
	mounted: function () {},
	methods: {},
});
