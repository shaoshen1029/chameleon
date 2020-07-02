/**
 * 提示条组件
 */
(function($) {
	/**
	 * 创建提示条
	 */
	function init(target) {
		let state = $.data(target, 'prompt');
		let opts = state.options;
		
		let promptCls = getPromptCls(opts.prompt);
		$(target).addClass(promptCls);
		
		if (opts.show) {
			$(target).addClass('alert-show');
			if (opts.animate) {
				$(target).addClass('alert-animate');
			}
		} else {
			$(target).addClass('alert-hide');
		}
		
		if (opts.width != 'auto') {
			$(target).css('width', opts.width + 'px');
		} else {
			$(target).css('width', 'auto');
		}
		
		$(target).css({
			height: opts.height + 'px',
			lineHeight: opts.height + 'px'
		});
		// 渲染提示图标
		if (opts.iconCls) {
			$(target).append('<div class="alert-icons"></div>');
		}
		// 渲染关闭按钮
		if (opts.close) {
			let close = $('<div>').addClass('alert-close');
			close.bind('click', function() {
				doClose($(target), opts);
			});
			$(target).append(close);
		}
		// 渲染消息
		let msg = $('<div>').addClass('alert-message').attr('title', opts.message).html(opts.message);
		$(target).append(msg);
	}
	/**
	 * 获取提示条类型
	 */
	function getPromptCls(prompt) {
		let promptCls = 'alert';
		switch(prompt) {
		case 'alert':
			promptCls = 'alert';
			break;
		case 'warning':
			promptCls = 'alert-warning';
			break;
		case 'error':
			promptCls = 'alert-error';
			break;
		case 'success':
			promptCls = 'alert-success';
			break;
		case 'info':
			promptCls = 'alert-info';
			break;
		}
		return promptCls;
	}
	/**
	 * 关闭按钮函数
	 */
	function doClose(el, opts) {
		el.prompt('hide');
		opts.onClose.call(el);
	}
	
	$.fn.prompt = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.prompt.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'prompt');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'prompt', {
					options: $.extend({}, $.fn.prompt.defaults, $.fn.prompt.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn.prompt.methods = {
		// 获取参数
		options: function(jq) {
			return $.data(jq[0], 'prompt').options;
		},
		// 刷新提示信息
		refresh: function(jq, data) {
			return jq.each(function() {
				$(this).find('div[class="alert-message"]').attr('title', data).html(data);
			});
		},
		// 显示提示条
		show: function(jq) {
			return jq.each(function() {
				let opts = $(this).prompt('options');
				$(this).removeClass('alert-hide');
				$(this).addClass('alert-show');
				if (opts.animate) {
					$(this).addClass('alert-animate');
					setTimeout(() => {$(this).removeClass('alert-animate');}, 350);
				}
			});
		},
		// 隐藏提示条
		hide: function(jq) {
			return jq.each(function() {
				$(this).removeClass('alert-show');
				$(this).removeClass('alert-animate');
				$(this).addClass('alert-hide');
			});
		}
	};
	// html加载属性
	$.fn.prompt.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, ['width','height','prompt','message',{iconCls:'boolean',close:'boolean',show:'boolean',animate:'boolean'}]));
	}
	// js脚本加载属性
	$.fn.prompt.defaults = {
		width: 'auto', // 组件宽度
		height: 16, // 组件高度
		prompt: 'alert', // 组件类型，可选参数alert,warning,error,success,info
		message: '', // 组件提示消息
		iconCls: true, // 是否显示组件提示图标
		close: true, // 是否显示组件关闭图标
		show: false, // 组件是否显示
		animate: true, // 组件是否开启动画效果
		onClose: function() {} // 关闭调用函数
	};
})(jQuery);