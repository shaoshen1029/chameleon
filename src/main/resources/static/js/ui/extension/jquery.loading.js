/**
 * 等待条组件
 */
(function($) {
	/**
	 * 初始化函数
	 */
	function init(target) {
		let state = $.data(target, 'loading');
		let opts = state.options;
		// 渲染遮罩层
		let maskEl = $('<div>').addClass('loading-mask');
		// 渲染loading窗口
		let windowEl = $('<div>').addClass('loading-window').css({'width': opts.width, 'height': opts.height});
		// 添加背景高斯模糊
		if (!$('div.bh-bg').hasClass('window-blur')) {
			$('div.bh-bg').addClass('window-loading-blur');
		}
		// 渲染loading动画
		let iconEl = $('<div>').addClass('soc-icon-font soc-icon-spinner soc-pulse').css({'width': opts.width, 'height': opts.width, 'font-size': opts.width});
		windowEl.append(iconEl);
		$('body').append(maskEl);
		$('body').append(windowEl);
		// 隐藏底层页面滚动条
		$('body').css('overflow', 'hidden');
	}
	
	$.fn.loading = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.loading.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'loading');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'loading', {
					options: $.extend({}, $.fn.loading.defaults, options)
				});
			}
			init(this);
		});
	};
	
	$.fn.loading.methods = {
		// 获取参数
		options: function(jq) {
			return $.data(jq[0], 'loading').options;
		},
		// 关闭等待条
		close: function(jq) {
			return jq.each(function() {
				// 移除背景高斯模糊
				$('div.bh-bg').removeClass('window-loading-blur');
				$('.loading-mask').remove();
				$('.loading-window').remove();
				$('body').css('overflow', 'auto');
			});
		}
	};
	
	$.fn.loading.defaults = {
		width: 35,
		height: 35
	};
})(jQuery);