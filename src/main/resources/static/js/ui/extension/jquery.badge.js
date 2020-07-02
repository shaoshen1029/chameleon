/**
 * 徽章组件
 */
(function($) {
	
	function init(target) {
		let state = $.data(target, 'badge');
		let opts = state.options;
		
		let number = opts.number || 0, show = opts.show;
		if (!show && number == 0) {
			return;
		}
		$(target).addClass('badge').addClass('color-' + opts.color);
		$(target).empty();
		$(target).append(number);
		$(target).bind('click', function() {
			opts.onClick.call($(target));
		});
	}
	
	$.fn.badge = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.badge.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'badge');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'badge', {
					options: $.extend({}, $.fn.badge.defaults, $.fn.badge.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn.badge.methods = {
		// 获取参数
		options: function(jq) {
			return $.data(jq[0], 'badge').options;
		},
		// 设置徽章颜色
		setColor: function(jq, color) {
			return jq.each(function() {
				let opts = $(this).badge('options');
				jq.removeClass('color-' + opts.color);
				jq.addClass('color-' + color);
				$.data(this, 'badge', {
					options: $.extend({}, opts, {color: color})
				});
			});
		},
		// 设置徽章值
		setValue: function(jq, number) {
			return jq.each(function() {
				let opts = $(this).badge('options');
				let show = opts.show;
				// 入参number只接受string类型和number类型，若非合法类型强制将入参number赋值为0
				if (typeof number != "number" && typeof number != "string") {
					number = 0;
				}
				if (number == null || (!show && number == 0)) {
					jq.removeClass('badge');
					jq.empty();
				} else {
					jq.addClass('badge');
					if (number != opts.number) {
						// 徽章值发生变化,显示闪烁效果
						jq.addClass('badge-animate');
						setTimeout(function() {
							jq.removeClass('badge-animate');
						}, 1000);
					}
					jq.empty();
					jq.append(number);
				}
				opts.number = number;
			});
		},
		// 获取徽章值
		getValue: function(jq) {
			return $.data(jq[0], 'badge').options.number;
		}
	};
	// html加载属性
	$.fn.badge.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, ['color',{show:'boolean',number:'number'}]));
	};
	// js脚本加载属性
	$.fn.badge.defaults = {
		number: 0,
		show: false, // 值为0时是否显示徽章。true-显示,false-不显示
		color: 'default', // 背景演示参数,可选参数default,success,warning,important,info,inverse,red,orange,yellow,olive,green,teal,blue,darkblue,violet,purple,pink,brown,grey,black
		onClick: function() {}
	};
})(jQuery);