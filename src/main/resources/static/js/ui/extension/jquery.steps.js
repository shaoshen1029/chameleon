/**
 * 步骤条组件
 */
(function($) {
	/**
	 * 创建步骤条UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createSteps(target) {
		let opts = $.data(target, 'steps').options;
		let steps = opts.steps ? opts.steps : [];
		if (steps.length == 0) {
			$(target).find('step').each(function() {
				let _t = $(this);
				let step = $.extend({}, $.parser.parseOptions(this, 
						['text', 'iconCls', 'description', 'space']
				), {
					text: ($.trim(_t.html()) || undefined),
					iconCls: (_t.attr('icon') || _t.attr('iconCls'))
				});
				steps.push(step);
			});
			$.data(target, 'steps').options = $.extend({}, opts, {steps: steps});
		}
		let t = $(target).empty();
		
		t.addClass('s-steps');
		t.removeClass('s-step-horizontal s-step-vertical').addClass('s-step-' + opts.direction);
		t.css({width: opts.width, height: opts.height});
		
		t.attr('id', opts.id || '');

		let innerSize = steps.length;
		for (let i=0; i<innerSize; i++) {
			let iconToken = false;
			let step = steps[i];
			step.index = i + 1;
			let inner = $('<span class="s-step"></span>').addClass('is-' + opts.direction).attr('index', step.index).appendTo(t);
			if (!opts.showTitle) {
				inner.addClass('is-title-hide');
			} else if (!opts.showDescription) {
				inner.addClass('is-description-hide');
			}
			let space = $.trim(step.space);
			if (space) {
				if (space.indexOf('%') == -1 && space.indexOf('px') == -1) {
					space = parseInt(space);
					if (isNaN(space)) {
						space = undefined;
					} else {
						space = space + 'px';
					}
				}
				step.space = space;
			} else {
				space = parseInt(100 / (innerSize - 1)) + '%';
			}
			inner.css('flex-basis', space);
			
			let head = createHead(step, opts);
			let main = createMain(step);
			if (opts.titleAlign == 'bottom' || opts.titleAlign == 'right') {
				head.appendTo(inner);
				main.appendTo(inner);
			} else {
				opts.titleAlign = opts.direction == 'horizontal' || opts.direction == 'h' ? 'top' : 'left';
				main.addClass('is-main-' + opts.titleAlign).appendTo(inner);
				head.appendTo(inner);
			}
			
			inner.each(function() {
				step.target = $(this);
				$.data(this, 'innerstep', { options: step });
			});
		}
		
		t.children().last().addClass('is-last');
		setActive(t[0], opts.active);
	}
	
	/**
	 * 创建步骤条head部分
	 * 
	 * @param step
	 * 		步骤参数
	 * @returns head部分
	 */
	function createHead(step, options) {
		let head = $('<div class="s-step-head">' +
					     '<div class="s-step-line">' +
					         '<i class="s-step-line-inner"></i>' +
					     '</div>' +
					     '<div class="s-step-icon is-text">' +
					         '<div class="s-step-icon-inner"></div>' +
					     '</div>' +
					 '</div>');
		let icon = head.find('.s-step-icon');
		let iconInner = head.find('.s-step-icon-inner');
		
		if (step.iconCls) {
			iconInner.addClass(step.iconCls);
		} else {
			iconInner.html(step.index);
		}
		if (!options.showTitle) {
			if (options.direction == 'horizontal' || options.direction == 'h') {
				icon.tooltip({
					position: 'top',
					content: step.text,
					deltaY: 4
				});
			} else {
				icon.tooltip({
					position: 'right',
					content: step.text,
					deltaX: -4
				});
			}
		}
		return head;
	}
	
	/**
	 * 创建步骤条main部分
	 * 
	 * @param step
	 * 		步骤参数
	 * @returns main部分
	 */
	function createMain(step) {
		let main = $('<div class="s-step-main">' +
					     '<div class="s-step-title">' + step.text + '</div>' +
					     '<div class="s-step-description">' + step.description + '</div>' +
					 '</div>');
		return main;
	}
	
	/**
	 * 设置当前激活步骤
	 * 
	 * @param active
	 * 		激活步骤序列
	 */
	function setActive(target, active) {
		let opts = $.data(target, 'steps').options;
		active = active || opts.active;
		active = active < 1 ? 1 : active;
		for (let step of opts.steps) {
			let t = step.target;
			if (step.index < active) {
				t.addClass('is-finish');
			} else if (step.index == active) {
				t.addClass('is-process');
			} else {
				t.addClass('is-wait');
			}
		}
		opts.active = active;
	}
	
	$.fn.steps = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.steps.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'steps');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'steps', {
					options: $.extend({}, $.fn.steps.defaults, $.fn.steps.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			
			createSteps(this);
		});
	};
	
	$.fn.steps.methods = {
		options: function(jq) {
			return $.data(jq[0], 'steps').options;
		},
		next: function(jq) {
			return jq.each(function() {
				let opts = $(this).steps('options');
				let active = opts.active || 1;
				if (active <= opts.steps.length) {
					opts.onBeforeNext.call(this);
					$(this).children().each(function() {
						let t = $(this);
						if (parseInt(t.attr('index')) == active) {
							t.removeClass('is-finish is-process is-wait').addClass('is-finish');
						} else if (parseInt(t.attr('index')) == active + 1) {
							t.removeClass('is-finish is-process is-wait').addClass('is-process');
						}
					});
					opts.active = active + 1;
					opts.onNext.call(this);
				}
			});
		},
		previou: function(jq) {
			return jq.each(function() {
				let opts = $(this).steps('options');
				let active = opts.active || 1;
				if (active > 1) {
					opts.onBeforePreviou.call(this);
					$(this).children().each(function() {
						let t = $(this);
						if (parseInt(t.attr('index')) == active) {
							t.removeClass('is-finish is-process is-wait').addClass('is-wait');
						} else if (parseInt(t.attr('index')) == active - 1) {
							t.removeClass('is-finish is-process is-wait').addClass('is-process');
						}
					});
					opts.active = active - 1;
					opts.onPreviou.call(this);
				}
			});
		},
		step: function(jq, active) {
			return jq.each(function() {
				let opts = $(this).steps('options');
				active = active < 1 ? 1 : active;
				active = active > opts.steps.length + 1 ? opts.steps.length + 1 : active;
				$(this).children().each(function() {
					let t = $(this);
					if (parseInt(t.attr('index')) < active) {
						t.removeClass('is-finish is-process is-wait').addClass('is-finish');
					} else if (parseInt(t.attr('index')) == active) {
						t.removeClass('is-finish is-process is-wait').addClass('is-process');
					} else {
						t.removeClass('is-finish is-process is-wait').addClass('is-wait');
					}
				});
				opts.active = active;
				opts.onStep.call(this);
			});
		}
	};
	
	$.fn.steps.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, 
			['id','width','height','direction','titleAlign',{active:'number'},{showTitle:'boolean',showDescription:'boolean'}]
		));
	};
	
	$.fn.steps.defaults = {
		id: null,
		width: '100%',
		height: '100%',
		direction: 'horizontal',// vertical,horizontal
		active: 1,
		titleAlign: 'bottom',// top,bottom,left,right
		showTitle: true,
		showDescription: true,
		onBeforeNext: function(){},
		onNext: function(){},
		onBeforePreviou:function(){},
		onPreviou: function(){},
		onStep: function(index){}
	};
})(jQuery);