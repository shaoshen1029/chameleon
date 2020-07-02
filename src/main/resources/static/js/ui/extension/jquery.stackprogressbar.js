/**
 * 堆积进度条组件
 */
(function($) {
	/**
	 * 创建堆积进度图UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function init(target) {
		let opts = $.data(target, 'stackprogressbar').options;
		let bars = opts.bars ? opts.bars : [];
		if (bars.length == 0) {
			$(target).find('bar').each(function() {
				let bar = $.extend({}, $.parser.parseOptions(this, ['text', 'value', 'color']));
				bars.push(bar);
			});
			opts.bars = bars;
		}
		let total = opts.total, dynamicTotal = 0, staticTotal = total == null || total == 0 ? false : true;
		for (let bar of bars) {
			bar.value = typeof bar.value == 'number' ? bar.value : parseFloat(bar.value);
			if (!staticTotal) {
				dynamicTotal += parseFloat(bar.value.toFixed(2));
			}
		}
		opts.dynamicTotal = dynamicTotal;// 动态总量
		opts.staticTotal = staticTotal;// 静态总量标识。true-组件设置静态总量(total)属性;false-组件未设置静态总量(total)属性
		
		let t = $(target).empty();
		
		t.addClass('stackprogressbar');
		t.css({'width': opts.width, 'height': opts.height, 'line-height': opts.height + 'px'});
		t.attr('id', opts.id || '');
		
		let innerSize = bars.length;
		for (let i=0; i<innerSize; i++) {
			let bar = bars[i];
			let inner = $('<span class="stackprogressbar-main"></span>').attr('index', i).appendTo(t);
			let total_ = opts.staticTotal ? opts.total : opts.dynamicTotal;
			let space = parseFloat((bar.value / total_ * 100).toFixed(2));
			inner.css('flex-basis', space + '%');
			if (space == 0) {
				inner.css('display', 'none');
			}
			bar.space = space;
			bar.index = i;
			let innerBar = createBar(bar, opts);
			innerBar.appendTo(inner);
			
			if (opts.tooltip && bar.text) {
				inner.tooltip({
					position: 'top',
					content: bar.text + ' : ' + bar.value + '(' + bar.space + '%)',
					deltaY: 4
				});
			}
			
			inner.unbind('.stackprogressbar').bind('click.stackprogressbar', {opts:opts, bar:bar}, function(e) {
				let opts_ = e.data.opts;
				let bar_ = e.data.bar;
				opts.onClick.call(this, bar_);
			});
			
			inner.each(function() {
				bar.target = $(this);
				$.data(this, 'innerbar', { options: bar });
			});
		}
		
	}
	
	/**
	 * 创建进度条
	 * 
	 * @param bar
	 * 		内部进度条参数
	 * @param opts
	 * 		堆积进度条参数
	 */
	function createBar(bar, opts) {
		let innerBar = $('<div class="stackprogressbar-bar"></div>');
		if (bar.color) {
			innerBar.css('background', bar.color);
		} else {
			let index = bar.index < 11 ? bar.index : 0;
			innerBar.css('background', opts.colors[index]);
		}
		let innerText = $('<div class="stackprogressbar-text">').appendTo(innerBar);
		innerText.addClass('is-' + opts.textAlign);
		if (opts.animate) {
			innerText.addClass('is-animate');
		}
		if (opts.showText == 'text') {
			innerText.text(bar.value);
		} else if (opts.showText == 'space') {
			innerText.text(bar.space + '%');
		}
		return innerBar;
	}
	
	$.fn.stackprogressbar = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.stackprogressbar.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'stackprogressbar');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'stackprogressbar', {
					options: $.extend({}, $.fn.stackprogressbar.defaults, $.fn.stackprogressbar.parseOptions(this), options)
				});
			}
			
			init(this);
		});
	};
	
	$.fn.stackprogressbar.methods = {
		options: function(jq) {
			return $.data(jq[0], 'stackprogressbar').options;
		},
		barOptions: function(jq, index) {
			return $.data(jq[0], 'stackprogressbar').options.bars[index];
		},
		resize: function(jq, param) {
			return jq.each(function() {
				let options = $.data(this, 'stackprogressbar');
				let opts = options.options;
				let carousel = options.carousel;
				let {width = opts.width, height = opts.height} = param;
				$(this).css({'width': width, 'height': height, 'line-height': height + 'px'});
				opts.width = width;
				opts.height = height;
				$.data(this, 'stackprogressbar', options);
			});
		},
		load: function(jq, bars, total) {
			return jq.each(function() {
				let opts = $.data(jq[0], 'stackprogressbar').options;
				if (total != undefined) {
					opts.total = total;
				}
				opts.bars = bars;
				init(jq[0]);
			});
		}
	};
	
	$.fn.stackprogressbar.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, 
			['id','width','height','textAlign','showText',{total:'number'},{animate:'boolean',tooltip:'boolean'}]
		));
	};
	
	$.fn.stackprogressbar.defaults = {
		id: null,
		width: '100%',
		height: 15,
		textAlign: 'right', // left,center,right
		showText: 'text', // text,space,hide
		animate: true,
		tooltip: true,
		total: 0,
		colors: ['#db2828', '#f2711c', '#fbbd08', '#0c80d7', '#3c8b02', '#90c61e', '#00b5ad', '#044894', '#6435c9', '#a333c8', '#e03997', '#a5673f'],
		onClick: function(bar){}
	};
})(jQuery);