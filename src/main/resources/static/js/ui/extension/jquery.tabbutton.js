/**
 * 按钮组组件
 */
(function($) {
	/**
	 * 设置UI尺寸
	 * 
	 * @param target
	 * 			DOM对象
	 * @param param
	 * 			参数
	 */
	function setSize(target, param){
		let opts = $.data(target, 'tabbutton').options;
		if (param){
			$.extend(opts, param);
		}
		if (opts.width || opts.height || opts.fit){
			let btn = $(target);
			let parent = btn.parent();
			let isVisible = btn.is(':visible');
			if (!isVisible){
				let spacer = $('<div style="display:none"></div>').insertBefore(target);
				let style = {
					position: btn.css('position'),
					display: btn.css('display'),
					left: btn.css('left')
				};
				btn.appendTo('body');
				btn.css({
					position: 'absolute',
					display: 'inline-block',
					left: -20000
				});
			}
			btn._size(opts, parent);
			let left = btn.find('.tab-btn-left');
			left.css('margin-top', 0);
			left.css('margin-top', parseInt((btn.height()-left.height())/2)+'px');
			if (!isVisible){
				btn.insertAfter(spacer);
				btn.css(style);
				spacer.remove();
			}
		}
	}
	
	/**
	 * 创建按钮组UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createButton(target) {
		let opts = $.data(target, 'tabbutton').options;
		let buttons = opts.buttons ? opts.buttons : [];
		if (buttons.length == 0) {
			$(target).find('button').each(function() {
				let bt = $(this);
				let button = $.extend({}, $.parser.parseOptions(this, 
						['text','iconCls','iconAlign',{selected:'boolean'}]
				), {
					disabled: (bt.attr('disabled') ? true : undefined),
					text: ($.trim(bt.html()) || undefined),
					iconCls: (bt.attr('icon') || bt.attr('iconCls'))
				});
				buttons.push(button);
			});
			$.data(target, 'tabbutton').options = $.extend({}, opts, {buttons: buttons});
		}
		let t = $(target).empty();
		
		t.addClass('tab-btn').removeClass('tab-btn-plain tab-btn-selected');
		t.removeClass('tab-btn-small tab-btn-medium tab-btn-large').addClass('tab-btn-'+opts.size);
		if (opts.plain) {
			t.addClass('tab-btn-plain')
		}
		t.attr('id', opts.id || '');
		
		let innerSize = buttons.length;
		
		for (var i=0; i<innerSize; i++) {
			let iconToken = false;
			let button = buttons[i];
			let inner = $('<span class="tab-btn-left"></span>').attr({'index': i, 'check': false}).appendTo(t);
			if (button.text) {
				$('<span class="tab-btn-text"></span>').html(button.text).appendTo(inner);
			} else {
				iconToken = true;
				$('<span class="tab-btn-text tab-btn-empty">&nbsp;</span>').appendTo(inner);
			}
			if (button.iconCls) {
				if (iconToken) {
					$('<span class="tab-btn-icon"></span>').addClass(button.iconCls).appendTo(inner);
				} else {
					$('<span class="tab-btn-icon">&nbsp;</span>').addClass(button.iconCls).appendTo(inner);
				}
				inner.addClass('tab-btn-icon-' + (button.iconAlign ? button.iconAlign : opts.iconAlign));
			}
			inner.unbind('.tabbutton').bind('click.tabbutton', {opts: opts, innerOpts: button}, function(e) {
				let opts_ = e.data.opts;
				let innerOpts = e.data.innerOpts;
				if (!opts_.disabled && !innerOpts.disabled) {
					if ($(this).attr('check') == 'true') {
						$(this).removeClass('tab-btn-selected').attr('check', false);
					} else {
						if (!opts_.toggle) {
							$(this).siblings('.tab-btn-selected').removeClass('tab-btn-selected').attr('check', false);
						}
						$(this).addClass('tab-btn-selected').attr('check', true);
					}
					opts_.onClick.call(this);
				}
			});
			inner.each(function() {
				button.target = $(this);
				$.data(this, 'innerbutton', { options: button });
				setButtonSelected(this, opts);
				setButtonDisabled(this, button.disabled);
			});
		}
		setDisabled(target, opts.disabled);
	}
	
	/**
	 * 设置按钮选中状态
	 * 
	 * @param target
	 * 			按钮对象
	 * @param opts
	 * 			按钮组参数
	 */
	function setButtonSelected(target, opts) {
		let innerOpts = $.data(target, 'innerbutton').options;
		let t = $(target);
		if (innerOpts.selected === true) {
			if (opts.toggle) {
				if (t.attr('check') == 'false') {
					t.addClass('tab-btn-selected');
					t.attr('check', true);
				}
			} else {
				t.siblings('.tab-btn-selected').removeClass('tab-btn-selected').attr('check', false);
				t.addClass('tab-btn-selected');
				t.attr('check', true);
			}
		}
	}
	
	/**
	 * 设置按钮使用状态
	 * 
	 * @param target
	 * 			按钮对象
	 * @param disabled
	 * 			使用状态 true-禁用;false-可用
	 */
	function setButtonDisabled(target, disabled) {
		let state = $.data(target, 'innerbutton');
		let opts = state.options;
		$(target).removeClass('tab-btn-inner-disabled');
		if (disabled) {
			opts.disabled = true;
			$(target).addClass('tab-btn-inner-disabled');
		} else {
			opts.disabled = false;
		}
	}
	
	/**
	 * 设置UI选中状态
	 * 
	 * @param target
	 * 			DOM对象
	 * @param selected
	 * 			选中序列(按钮组下角标号),e.g: 0,1,2
	 */
	function setSelected(target, selected) {
		let opts = $.data(target, 'tabbutton').options;
		let selectedArray = selected ? selected.split(',') : [];
		for (let i=0; i<selectedArray.length; i++) {
			let t = $(target).children('span[class*="tab-btn-left"][index="' + selectedArray[i] + '"]');
			if (opts.toggle) {
				if (t.attr('check') == 'false') {
					t.addClass('tab-btn-selected');
					t.attr('check', true);
				}
			} else {
				t.siblings('.tab-btn-selected').removeClass('tab-btn-selected').attr('check', false);
				t.addClass('tab-btn-selected');
				t.attr('check', true);
			}
		}
	}
	
	/**
	 * 设置UI非选中状态
	 * 
	 * @param target
	 * 			DOM对象
	 * @param unselected
	 * 			非选中序列(按钮组下角标号),e.g: 0,1,2
	 */
	function setUnselected(target, unselected) {
		let opts = $.data(target, 'tabbutton').options;
		let selectedArray = selected ? selected.split(',') : [];
		for (let i=0; i<selectedArray.length; i++) {
			let t = $(target).children('span[class*="tab-btn-left"][index="' + selectedArray[i] + '"]');
			if (t.attr('check') == 'true') {
				t.removeClass('tab-btn-selected');
				t.attr('check', false);
			}
		}
	}
	
	/**
	 * 设置UI使用状态
	 * 
	 * @param target
	 * 			DOM对象
	 * @param disabled
	 * 			使用状态 true-禁用;false-可用
	 */
	function setDisabled(target, disabled) {
		let state = $.data(target, 'tabbutton');
		let opts = state.options;
		$(target).removeClass('tab-btn-disabled tab-btn-plain-disabled');
		if (disabled) {
			opts.disabled = true;
			let href = $(target).attr('href');
			if (href){
				state.href = href;
				$(target).attr('href', 'javascript:;');
			}
			if (target.onclick){
				state.onclick = target.onclick;
				target.onclick = null;
			}
			opts.plain ? $(target).addClass('tab-btn-disabled tab-btn-plain-disabled') : $(target).addClass('tab-btn-disabled');
		} else {
			opts.disabled = false;
			if (state.href) {
				$(target).attr('href', state.href);
			}
			if (state.onclick) {
				target.onclick = state.onclick;
			}
		}
	}
	
	$.fn.tabbutton = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.tabbutton.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'tabbutton');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'tabbutton', {
					options: $.extend({}, $.fn.tabbutton.defaults, $.fn.tabbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
				$(this).bind('_resize', function(e, force){
					if ($(this).hasClass('socui-fluid') || force){
						setSize(this);
					}
					return false;
				});
			}
			
			createButton(this);
			setSize(this);
		});
	};
	
	$.fn.tabbutton.methods = {
		// 获取参数
		options: function(jq) {
			return $.data(jq[0], 'tabbutton').options;
		},
		resize: function(jq, param) {
			return jq.each(function() {
				setSize(this, param);
			});
		},
		enable: function(jq) {
			return jq.each(function() {
				setDisabled(this, false);
			});
		},
		disable: function(jq) {
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		buttonEnable: function(jq, value) {
			return jq.each(function() {
				let btns = value.split(',');
				let buttons = $(this).tabbutton('options').buttons;
				for (let i=0; i<btns.length; i++) {
					setButtonDisabled(buttons[btns[i]].target[0], false);
				}
			});
		},
		buttonDisable: function(jq, value) {
			return jq.each(function() {
				let btns = value.split(',');
				let buttons = $(this).tabbutton('options').buttons;
				for (let i=0; i<btns.length; i++) {
					setButtonDisabled(buttons[btns[i]].target[0], true);
				}
			});
		},
		select: function(jq, value) {
			return jq.each(function() {
				setSelected(this, value);
			});
		},
		unselect: function(jq, value) {
			return jq.each(function() {
				setUnselected(this, value);
			});
		},
		getSelect: function(jq) {
			let select = '';
			jq.find('span[class*="tab-btn-left"][check="true"]').each(function() {
				let index = $(this).attr('index');
				if (select) {
					select += ',' + index;
				} else {
					select = index;
				}
			});
			return select;
		}
	};
	
	$.fn.tabbutton.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['id','iconCls','iconAlign','size','text','selected',{plain:'boolean',toggle:'boolean'}]
		), {
			disabled: (t.attr('disabled') ? true : undefined),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		});
	};
	
	$.fn.tabbutton.defaults = {
		id: null,
		disabled: false,
		toggle: false,
		plain: false,
		iconAlign: 'left',
		size: 'small',	// small,large
		onClick: function(){}
	};
})(jQuery);