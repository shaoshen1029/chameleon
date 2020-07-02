/**
 * 轮播组件
 */
(function($) {
	/**
	 * 初始化组件
	 */
	function init(target) {
		let style = $(target).attr('style');
		$(target).addClass('carousel-f').hide();
		let carousel = $('<div class="carousel" style="' + style + '">' +
						 	'<div class="carousel-content"></div>' +
						 	'<div class="carousel-indicator carousel-indicator-none"><ul></ul></div>' +
						 	'<span class="carousel-arrow carousel-arrow-1st carousel-arrow-none"></span>' +
						 	'<span class="carousel-arrow carousel-arrow-2nd carousel-arrow-none"></span>' +
						 '</div>').insertAfter(target);
		$(target).appendTo(carousel);
		return carousel;
	}
	/**
	 * 创建轮播主体
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createCarousel(target) {
		let options = $.data(target, 'carousel');
		let opts = options.options;
		let carousel = options.carousel;
		carousel.css({width: opts.width, height: opts.height});
		
		let items = opts.items || [];
		if (items.length == 0) {
			$(target).find('carousel').each(function() {
				let _opts = $.extend({}, $.parser.parseOptions(this, ['width','height']), {
					content: $.trim($(this).html())
				});
				items.push(_opts);
			});
			$.data(target, 'carousel').options = $.extend({}, opts, {items: items});
		}
		if (opts.showBorder) {
			carousel.addClass('with-border');
		} else {
			carousel.removeClass('with-border');
		}
		
		let contentEl = carousel.find('.carousel-content');
		let indicatorEl = carousel.find('.carousel-indicator').find('ul');
		// 创建轮播内容
		for (let item of items) {
			var el = createItem(target, item);
			el.appendTo(contentEl);
			$('<li></li>').appendTo(indicatorEl);
		}
		contentEl.find('.carousel-item:first').addClass('carousel-show');
		indicatorEl.find('li:first').addClass('carousel-show');
		// 布局样式
		if (opts.arrowAlign == 'horizontal' || opts.arrowAlign == 'h') {
			carousel.find('.carousel-arrow-1st').addClass('carousel-arrow-left');
			carousel.find('.carousel-arrow-2nd').addClass('carousel-arrow-right');
			if (opts.indicatorAlign == 'top') {
				carousel.find('.carousel-indicator').addClass('carousel-indicator-top');
			} else {
				carousel.find('.carousel-indicator').addClass('carousel-indicator-bottom');
			}
		} else if (opts.arrowAlign == 'vertical' || opts.arrowAlign == 'v') {
			carousel.find('.carousel-arrow-1st').addClass('carousel-arrow-top');
			carousel.find('.carousel-arrow-2nd').addClass('carousel-arrow-bottom');
			if (opts.indicatorAlign == 'left') {
				carousel.find('.carousel-indicator').addClass('carousel-indicator-left');
			} else {
				carousel.find('.carousel-indicator').addClass('carousel-indicator-right');
			}
			var y = carousel.find('.carousel-indicator').height() / 2;
			carousel.find('.carousel-indicator').css('margin-top', -y);
		}
		
		// 处理组件按钮效果
		handleCarouselEffect(target);
		// 绑定组件触发事件函数
		bindEvent(target);
		
		setAutoPlay(target, opts.autoplay);
	}
	/**
	 * 创建轮播内容
	 * 
	 * @param target
	 * 			DOM对象
	 * @param item
	 * 			轮播内容参数
	 * @return 轮播内容对象
	 */
	function createItem(target, item) {
		let el = $('<div class="carousel-item"></div>');
		if (item.href) {
			$.ajax({
				type: 'POST',
				async: 'false',
				dataType: 'html',
				url: item.href,
				loading: false,
				success: function(data) {
					el.html(data);
					$.parser.parse(el);
					initContent();
				}
			});
			el.css({'overflow': 'auto'});
		} else {
			el = el.html(item.content);
		}
		if (item.width) {
			el.width(item.width);
		}
		if (item.height) {
			el.height(item.height);
		}
		return el;
	}
	/**
	 * 处理轮播组件效果
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function handleCarouselEffect(target) {
		let options = $.data(target, 'carousel');
		let opts = options.options;
		let carousel = options.carousel;
		let indicatorEl = carousel.find('.carousel-indicator');
		let arrowEl = carousel.find('.carousel-arrow');
		indicatorEl.removeClass('carousel-indicator-hover carousel-indicator-always carousel-indicator-none').addClass('carousel-indicator-' + opts.indicator);
		arrowEl.removeClass('carousel-arrow-hover carousel-arrow-always carousel-arrow-none').addClass('carousel-arrow-' + opts.arrow);
	}
	/**
	 * 绑定组件触发事件函数
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function bindEvent(target) {
		let options = $.data(target, 'carousel');
		let opts = options.options;
		let carousel = options.carousel;
		
		let arrowLeft = carousel.find('.carousel-arrow-left');
		let arrowRight = carousel.find('.carousel-arrow-right');
		let arrowTop = carousel.find('.carousel-arrow-top');
		let arrowBottom = carousel.find('.carousel-arrow-bottom');
		let indicator = carousel.find('.carousel-indicator').find('li');
		
		carousel.unbind('.carousel').bind('mouseover.carousel', function() {
			stopAutoPlay(target);
		}).bind('mouseout.carousel', function() {
			if (opts.autoplay == true) {
				startAutoPlay(target);
			}
		});
		
		if (arrowLeft) {
			arrowLeft.unbind('.carousel').bind('click.carousel', function() {
				let contentEl = carousel.find('.carousel-item');
				let indicatorEl = carousel.find('.carousel-indicator').find('li');
				let index = getCurrentIndex(carousel), limit = contentEl.length;
				let currentIndex = index, previouIndex = --index;
				if (previouIndex < 0) {
					previouIndex = limit - 1;
				}
				opts.onBeforePreviou.call(this, currentIndex, previouIndex);
				
				let currentEl = contentEl.eq(currentIndex);
				let previouEl = contentEl.eq(previouIndex);
				switchAnimate(currentEl, previouEl, opts, 'left');
				
				indicatorEl.eq(currentIndex).removeClass('carousel-show');
				indicatorEl.eq(previouIndex).addClass('carousel-show');
				
				opts.onPreviou.call(this, currentIndex);
			});
		}
		
		if (arrowRight) {
			arrowRight.unbind('.carousel').bind('click.carousel', function() {
				let contentEl = carousel.find('.carousel-item');
				let indicatorEl = carousel.find('.carousel-indicator').find('li');
				let index = getCurrentIndex(carousel), limit = contentEl.length;
				let currentIndex = index, nextIndex = 0;
				if (++index < limit) {
					nextIndex = index;
				}
				opts.onBeforeNext.call(this, currentIndex, nextIndex);
				
				let currentEl = contentEl.eq(currentIndex);
				let nextEl = contentEl.eq(nextIndex);
				switchAnimate(currentEl, nextEl, opts, 'right');
				
				indicatorEl.eq(currentIndex).removeClass('carousel-show');
				indicatorEl.eq(nextIndex).addClass('carousel-show');
				
				opts.onNext.call(this, currentIndex);
			});
		}
		
		if (arrowTop) {
			arrowTop.unbind('.carousel').bind('click.carousel', function() {
				let contentEl = carousel.find('.carousel-item');
				let indicatorEl = carousel.find('.carousel-indicator').find('li');
				let index = getCurrentIndex(carousel), limit = contentEl.length;
				let currentIndex = index, previouIndex = --index;
				if (previouIndex < 0) {
					previouIndex = limit - 1;
				}
				opts.onBeforePreviou.call(this, currentIndex, previouIndex);
				
				let currentEl = contentEl.eq(currentIndex);
				let previouEl = contentEl.eq(previouIndex);
				switchAnimate(currentEl, previouEl, opts, 'top');
				
				indicatorEl.eq(currentIndex).removeClass('carousel-show');
				indicatorEl.eq(previouIndex).addClass('carousel-show');
				
				opts.onPreviou.call(this, currentIndex);
			});
		}
		
		if (arrowBottom) {
			arrowBottom.unbind('.carousel').bind('click.carousel', function() {
				let contentEl = carousel.find('.carousel-item');
				let indicatorEl = carousel.find('.carousel-indicator').find('li');
				let index = getCurrentIndex(carousel), limit = contentEl.length;
				let currentIndex = index, nextIndex = 0;
				if (++index < limit) {
					nextIndex = index;
				}
				opts.onBeforeNext.call(this, currentIndex, nextIndex);
				
				let currentEl = contentEl.eq(currentIndex);
				let nextEl = contentEl.eq(nextIndex);
				switchAnimate(currentEl, nextEl, opts, 'bottom');
				
				indicatorEl.eq(currentIndex).removeClass('carousel-show');
				indicatorEl.eq(nextIndex).addClass('carousel-show');
				
				opts.onNext.call(this, currentIndex);
			});
		}
		
		indicator.unbind('.carousel').bind('click.carousel', function() {
			let contentEl = carousel.find('.carousel-item');
			let indicatorEl = carousel.find('.carousel-indicator').find('li');
			let index = indicatorEl.index(this);
			let currentIndex = indicatorEl.index(carousel.find('.carousel-indicator').find('.carousel-show')[0]);
			
			if (index == currentIndex) {
				return;
			}
			let element = contentEl.eq(currentIndex);
			let tigger = contentEl.eq(index);
			let type = null;
			if (opts.arrowAlign == 'horizontal' || opts.arrowAlign == 'h') {
				if (index > currentIndex) {
					type = 'right';
				} else if (index < currentIndex) {
					type = 'left';
				}
			} else if (opts.arrowAlign == 'vertical' || opts.arrowAlign == 'v') {
				if (index > currentIndex) {
					type = 'bottom';
				} else if (index < currentIndex) {
					type = 'top';
				}
			}
			switchAnimate(element, tigger, opts, type);
			
			indicatorEl.eq(currentIndex).removeClass('carousel-show');
			indicatorEl.eq(index).addClass('carousel-show');
			
			opts.onSelect.call(this, index);
		});
	}
	/**
	 * 获取当前轮播内容序列
	 * 
	 * @param carousel
	 * 		轮播组件对象
	 * @return 当前轮播内容序列
	 */
	function getCurrentIndex(carousel) {
		let t = carousel.find('.carousel-item'), index = 0;
		for (index; index<t.length; index++) {
			if ($(t.get(index)).hasClass('carousel-show')) {
				break;
			}
		}
		return index;
	}
	/**
	 * 轮播组件切换动画
	 * 
	 * @param element
	 * 		当前轮播内容
	 * @param tigger
	 * 		切换轮播内容
	 * @param opts
	 * 		组件参数
	 * @param type
	 * 		切换动画类型:left,right
	 */
	function switchAnimate(element, tigger, opts, type) {
		let x = 0, y = 0;
		switch(type) {
		case 'left':
			x = -opts.width;
			break;
		case 'right':
			x = opts.width;
			break;
		case 'top':
			y = -opts.height;
			break;
		case 'bottom':
			y = opts.height;
			break;
		}
		switch(type) {
		case 'left':
		case 'right':
			tigger.addClass('carousel-show').css('left', x);
			element.animate({left: -x}, opts.duration, 'linear', function() {
				$(this).removeClass('carousel-show');
			});
			tigger.animate({left: 0}, opts.duration, 'linear');
			break;
		case 'top':
		case 'bottom':
			tigger.addClass('carousel-show').css('top', y);
			element.animate({top: -y}, opts.duration, 'linear', function() {
				$(this).removeClass('carousel-show');
			});
			tigger.animate({top: 0}, opts.duration, 'linear');
			break;
		}
	}
	/**
	 * 设置自动播放
	 * 
	 * @param target
	 * 		DOM对象
	 * @param autoplay
	 * 		是否自动播放。true-启用;false-禁用
	 */
	function setAutoPlay(target, autoplay) {
		let options = $.data(target, 'carousel');
		let opts = options.options;
		if (autoplay == true) {
			opts.autoplay = true;
			startAutoPlay(target);
		} else {
			opts.autoplay = false;
			stopAutoPlay(target);
		}
	}
	/**
	 * 开启自动轮播
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function startAutoPlay(target) {
		let options = $.data(target, 'carousel');
		let opts = options.options;
		let carousel = options.carousel;
		let interval = opts.interval > 800 ? opts.interval : 800;
		let autoplayInterval = setInterval(function() {
			let contentEl = carousel.find('.carousel-item');
			let indicatorEl = carousel.find('.carousel-indicator').find('li');
			let index = getCurrentIndex(carousel), limit = contentEl.length;
			let currentIndex = index, nextIndex = 0;
			if (++index < limit) {
				nextIndex = index;
			}
			
			let currentEl = contentEl.eq(currentIndex);
			let nextEl = contentEl.eq(nextIndex);
			if (opts.arrowAlign == 'horizontal' || opts.arrowAlign == 'h') {
				switchAnimate(currentEl, nextEl, opts, 'right');
			} else {
				switchAnimate(currentEl, nextEl, opts, 'bottom');
			}
			
			indicatorEl.eq(currentIndex).removeClass('carousel-show');
			indicatorEl.eq(nextIndex).addClass('carousel-show');
		}, interval);
		opts.autoplayInterval = autoplayInterval;
	}
	/**
	 * 停止自动轮播
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function stopAutoPlay(target) {
		let options = $.data(target, 'carousel');
		let opts = options.options;
		if (opts.autoplayInterval) {
			clearInterval(opts.autoplayInterval);
			opts.autoplayInterval = null;
		}
	}
	
	$.fn.carousel = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.carousel.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'carousel');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'carousel', {
					options: $.extend({}, $.fn.carousel.defaults, $.fn.carousel.parseOptions(this), options),
					carousel: init(this)
				});
			}
			
			createCarousel(this);
		});
	};
	
	$.fn.carousel.methods = {
		options: function(jq) {
			return $.data(jq[0], 'carousel').options;
		},
		resize: function(jq, param) {
			return jq.each(function() {
				let options = $.data(this, 'carousel');
				let opts = options.options;
				let carousel = options.carousel;
				let {width = opts.width, height = opts.height} = param;
				carousel.css({width: width, height: height});
				opts.width = width;
				opts.height = height;
				$.data(this, 'carousel', options);
			});
		},
		startPlay: function(jq) {
			return jq.each(function() {
				autoPlay(this, true);
			});
		},
		stopPlay: function(jq) {
			return jq.each(function() {
				autoPlay(this, false);
			});
		},
		select: function(jq, index) {
			return jq.each(function() {
				let options = $.data(this, 'carousel');
				let opts = options.options;
				let carousel = options.carousel;
				
				let contentEl = carousel.find('.carousel-item');
				let indicatorEl = carousel.find('.carousel-indicator').find('li');
				let currentIndex = indicatorEl.index(carousel.find('.carousel-indicator').find('.carousel-show')[0]);
				
				if (index >= contentEl.length || index == currentIndex) {
					return;
				}
				let element = contentEl.eq(currentIndex);
				let tigger = contentEl.eq(index);
				let type = null;
				if (opts.arrowAlign == 'horizontal' || opts.arrowAlign == 'h') {
					if (index > currentIndex) {
						type = 'right';
					} else if (index < currentIndex) {
						type = 'left';
					}
				} else if (opts.arrowAlign == 'vertical' || opts.arrowAlign == 'v') {
					if (index > currentIndex) {
						type = 'bottom';
					} else if (index < currentIndex) {
						type = 'top';
					}
				}
				switchAnimate(element, tigger, opts, type);
				
				indicatorEl.eq(currentIndex).removeClass('carousel-show');
				indicatorEl.eq(index).addClass('carousel-show');
				
				opts.onSelect.call(this, index);
			});
		}
	};
	
	$.fn.carousel.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['width','height','arrow','arrowAlign','indicator','indicatorAlign', 
			 {autoplay:'boolean', showBorder:'boolean'}, 
			 {interval:'number', duration:'number'}]
		));
	};
	
	$.fn.carousel.defaults = {
		width: 'auto',
		height: 'auto',
		autoplay: true,
		interval: 3000,
		duration: 500,
		arrow: 'hover',// hover,always,none
		arrowAlign: 'horizontal', // horizontal,vertical
		indicator: 'hover',// hover,always,none
		indicatorAlign: 'bottom',// top,bottom,left,right
		showBorder: true,
		onSelect: function(index) {},
		onBeforeNext: function(currentIndex, nextIndex) {},
		onNext: function(index) {},
		onBeforePreviou: function(currentIndex, previouIndex) {},
		onPreviou: function(index) {}
	};
})(jQuery);