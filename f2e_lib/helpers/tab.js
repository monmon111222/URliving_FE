const tab = function(){
	$(document).on('click', '.tab-action .tab-btn', function(e) {
		e.preventDefault();

		var $el = $(this),
		target_tab = $el.data('tab');
		if ($el.hasClass('active')) return;
		$el.parents('.tab-btn-wrap').find('a').removeClass('active');
		$el.addClass('active');
		$el.parents('.tab-action').find('.tab-content').removeClass('active');
		$(target_tab).addClass('active');
	});
}();

