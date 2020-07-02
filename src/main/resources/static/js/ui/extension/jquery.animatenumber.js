/**
 * 数字动画组件
 */
(function($) {
	/**
	 * 创建步骤条UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createAnimateNumber(target) {
		let opts = $.data(target, 'animatenumber').options;
		let t = $(target).addClass('animate-number');
		let from = opts.from, to = opts.to, nums = [];
		to = (opts.to + '').replace(/,/g, '');
		from = (opts.from + '').replace(/,/g, '');
		let isDowntrend = from > to ? true : false;
		
		if (isDowntrend) {
			nums = getDowntrend(target);
		} else {
			nums = getUptrend(target);
		}
		opts.nums = nums;
		t.text(from);
		
		if (opts.start) {
			setTimeout(function() {animateNumber(target, 0);}, opts.delay);
		}
	}
	
	/**
	 * 获取上升趋势数组
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function getUptrend(target) {
		let opts = $.data(target, 'animatenumber').options;
		let time = opts.time, delay = opts.delay;
		let divisions = time / delay;
		let from = opts.from, to = opts.to;
		let isComma = /[0-9]+,[0-9]+/.test(to);
		to = (opts.to + '').replace(/,/g, '');
		from = (opts.from + '').replace(/,/g, '');
		
		let isInt = /^[0-9]+$/.test(to);
		let isFloat = /^[0-9]+\.[0-9]+$/.test(to);
		let decimalPlaces = isFloat ? (to.split('.')[1] || []).length : 0;
		let nums = [opts.to];
		
		for (let i = divisions; i >= 1; i--) {
			let newNum = null;
			if (isInt) {
				newNum = parseInt(Math.round(to / divisions * i));
			} else if (isFloat) {
				newNum = parseFloat(to / divisions * i).toFixed(decimalPlaces);
			}
			let numToken = false;
			if (newNum < from) {
				numToken = true;
				newNum = from;
			}
			if (isComma) {
				while (/(\d+)(\d{3})/.test(newNum.toString())) {
					newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
			}
			nums.unshift(newNum);
			if (numToken) {
				break;
			}
		}
		return nums;
	}
	
	/**
	 * 获取下降趋势数组
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function getDowntrend(target) {
		let opts = $.data(target, 'animatenumber').options;
		let time = opts.time, delay = opts.delay;
		let divisions = time / delay;
		let from = opts.from, to = opts.to;
		let isComma = /[0-9]+,[0-9]+/.test(to);
		to = (opts.to + '').replace(/,/g, '');
		from = (opts.from + '').replace(/,/g, '');
		
		let isInt = /^[0-9]+$/.test(to);
		let isFloat = /^[0-9]+\.[0-9]+$/.test(to);
		let decimalPlaces = isFloat ? (to.split('.')[1] || []).length : 0;
		let nums = [opts.from];
		
		for (let i = 1; i <= divisions; i++) {
			let newNum = null;
			if (isInt) {
				newNum = from - parseInt(Math.round((from - to) / divisions * i));
			} else if (isFloat) {
				newNum = parseFloat(from -(from - to) / divisions * i).toFixed(decimalPlaces);
			}
			let numToken = false;
			if (newNum < to) {
				numToken = true;
				newNum = to;
			}
			if (isComma) {
				while (/(\d+)(\d{3})/.test(newNum.toString())) {
					newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
			}
			nums.push(newNum);
			if (numToken) {
				break;
			}
		}
		return nums;
	}
	
	/**
	 * 数字动画
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function animateNumber(target, index) {
		let opts = $.data(target, 'animatenumber').options;
		let nums = opts.nums;
		if (index == 0) {
			opts.onStart.call(this);
		}
		$(target).text(nums[index]);
		if (index < nums.length) {
			index++;
			setTimeout(function() {animateNumber(target, index);}, opts.delay);
		} else {
			opts.onEnd.call(this);
		}
	}
	
	$.fn.animatenumber = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.animatenumber.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'animatenumber');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'animatenumber', {
					options: $.extend({}, $.fn.animatenumber.defaults, $.fn.animatenumber.parseOptions(this), options)
				});
			}
			
			createAnimateNumber(this);
		});
	};
	
	$.fn.animatenumber.methods = {
		options: function(jq) {
			return $.data(jq[0], 'animatenumber').options;
		},
		start: function(jq) {
			return jq.each(function() {
				animateNumber(jq[0], 0);
			});
		},
		to: function(jq, value) {
			return jq.each(function() {
				let opts = $.data(jq[0], 'animatenumber').options;
				opts.from = opts.to;
				opts.to = value;
				let from = opts.from, to = opts.to;
				let nums = [];
				to = (opts.to + '').replace(/,/g, '');
				from = (opts.from + '').replace(/,/g, '');
				let isDowntrend = from > to ? true : false;
				
				if (isDowntrend) {
					nums = getDowntrend(jq[0]);
				} else {
					nums = getUptrend(jq[0]);
				}
				opts.nums = nums;
				jq.text(from);
				
				setTimeout(function() {animateNumber(jq[0], 0);}, opts.delay);
			});
		}
	};
	
	$.fn.animatenumber.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['id','from','to',{time:'number',delay:'number'},{start:'boolean'}]
		), {
			to: ($.trim(t.html()) || undefined)
		});
	};
	
	$.fn.animatenumber.defaults = {
		id: null,
		from: 0,
		to: 0,
		time: 2000,
		delay: 10,
		start: true,
		onStart: function(){},
		onEnd: function(){}
	};
})(jQuery);