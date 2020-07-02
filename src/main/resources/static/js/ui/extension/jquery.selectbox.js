/**
 * 选择框组件
 */
(function($) {
	/**
	 * 组件监听按钮
	 */
	let SELECTBOX_KEY_CODE = null;
	/**
	 * 初始化组件
	 */
	function init(target) {
		let t = $(target);
		t.addClass('selectbox-f').hide();
		let selectbox = $('<span class="selectbox">' +
						     '<div class="selectbox-waiting options-frame" tabindex="0"></div>' +
						 	 '<div class="selectbox-btn">' +
						 	     '<div class="selected-btn-warp">' +
						 	         '<span class="soc-icon-font selectbox-icon selectbox-icon-select"></span>' +
						 	         '<span class="soc-icon-font selectbox-icon selectbox-icon-remove"></span>' +
						 	         '<span class="soc-icon-font selectbox-icon selectbox-icon-selectAll"></span>' +
						 	         '<span class="soc-icon-font selectbox-icon selectbox-icon-removeAll"></span>' +
						 	         '<span class="soc-icon-font selectbox-icon selectbox-icon-up"></span>' +
						 	         '<span class="soc-icon-font selectbox-icon selectbox-icon-down"></span>' +
						 	     '</div>' +
						 	 '</div>' +
						 	 '<div class="selectbox-selected options-frame" tabindex="0"></div>' +
						 '</span>').insertAfter(target);
		let name = t.attr('name') || t.attr('selectboxName');
		if (name){
			t.removeAttr('name').attr('selectboxName', name);
		}
		return selectbox;
	}
	/**
	 * 创建组件UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createSelectbox(target) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		
		selectbox.empty();
		$('<div class="selectbox-waiting options-frame" tabindex="0"></div>' +
	 	  '<div class="selectbox-btn">' +
	 	      '<div class="selected-btn-warp">' +
	 	          '<span class="soc-icon-font selectbox-icon selectbox-icon-select"></span>' +
	 	          '<span class="soc-icon-font selectbox-icon selectbox-icon-remove"></span>' +
	 	          '<span class="soc-icon-font selectbox-icon selectbox-icon-selectAll"></span>' +
	 	          '<span class="soc-icon-font selectbox-icon selectbox-icon-removeAll"></span>' +
	 	          '<span class="soc-icon-font selectbox-icon selectbox-icon-up"></span>' +
	 	          '<span class="soc-icon-font selectbox-icon selectbox-icon-down"></span>' +
	 	      '</div>' +
	 	  '</div>' +
	 	  '<div class="selectbox-selected options-frame" tabindex="0"></div>').appendTo(selectbox);
		
		if (opts.width != 'auto') {
			selectbox.width(opts.width);
		}
		if (opts.height != 'auto') {
			selectbox.height(opts.height);
		}
		
		if (opts.direction == 'horizontal' || opts.direction == 'h') {
			selectbox.removeClass('is-horizontal is-vertical').addClass('is-horizontal');
		} else {
			selectbox.removeClass('is-horizontal is-vertical').addClass('is-vertical');
		}
		
		setDisabled(target, opts.disabled);
		setReadonly(target, opts.readonly);
		
		renderBtn(target);
		renderFrame(target);
		renderContent(target);
		
		bindEvent(target);
		
		_setValue(target);
	}
	/**
	 * 渲染按钮部分
	 * 
	 * @param target DOM对象
	 */
	function renderBtn(target) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		
		let t1 = selectbox.find('.selectbox-waiting');
		let btn = selectbox.find('.selectbox-btn');
		let deltaSize = 0;
		if (!opts.totalSelect) {
			btn.find('.selectbox-icon-selectAll').hide();
			btn.find('.selectbox-icon-removeAll').hide();
		}
		if (!opts.sort) {
			btn.find('.selectbox-icon-up').hide();
			btn.find('.selectbox-icon-down').hide();
		}
		
		if (opts.direction == 'horizontal' || opts.direction == 'h') {
			let width = btn.find('.selectbox-icon').outerWidth();
			deltaSize = t1.outerHeight() - t1.height();
			btn.width(width);
			btn.height(selectbox.height() - deltaSize);
		} else {
			let height = btn.find('.selectbox-icon').outerHeight();
			deltaSize = t1.outerWidth() - t1.width();
			btn.height(height);
			btn.width(selectbox.width() - deltaSize);
		}
	}
	/**
	 * 渲染选择框体
	 * 
	 * @param target DOM对象
	 */
	function renderFrame(target) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		
		let t1 = selectbox.find('.selectbox-waiting');
		let t2 = selectbox.find('.selectbox-selected');
		let btn = selectbox.find('.selectbox-btn');
		let [deltaSize, btnSize, frameSize] = [0, 0, 0];
		let [waitingPanelWidth, waitingPanelHeight, selectedPanelWidth, selectedPanelHeight] = [opts.waitingPanelWidth, opts.waitingPanelHeight, opts.selectedPanelWidth, opts.selectedPanelHeight];
		let setFrameSize = function(t, type, defaultSize, size) {
			size = defaultSize || size;
			t.css(type, size + 'px');
		};
		
		if (opts.direction == 'horizontal' || opts.direction == 'h') {
			btnSize = btn.outerWidth();
			deltaSize = t1.outerHeight() - t1.height();
			frameSize = (selectbox.width() - btnSize - deltaSize * 2) / 2;
			
			setFrameSize(t1, 'width', waitingPanelWidth, frameSize);
			setFrameSize(t1, 'height', waitingPanelHeight, selectbox.height() - deltaSize);
			setFrameSize(t2, 'width', selectedPanelWidth, frameSize);
			setFrameSize(t2, 'height', selectedPanelHeight, selectbox.height() - deltaSize);
		} else {
			btnSize = btn.outerHeight();
			deltaSize = t1.outerWidth() - t1.width();
			frameSize = (selectbox.height() - btnSize - deltaSize * 2) / 2;
			
			setFrameSize(t1, 'width', waitingPanelWidth, selectbox.width() - deltaSize);
			setFrameSize(t1, 'height', waitingPanelHeight, frameSize);
			setFrameSize(t2, 'width', selectedPanelWidth, selectbox.width() - deltaSize);
			setFrameSize(t2, 'height', selectedPanelHeight, frameSize);
		}
	}
	/**
	 * 渲染内容
	 * 
	 * @param target DOM对象
	 */
	function renderContent(target) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		
		let t1 = selectbox.find('.selectbox-waiting');
		let t2 = selectbox.find('.selectbox-selected');
		
		for (let data of opts.waiting) {
			let el = renderOption(opts, data, 0);
			el.appendTo(t1);
		}
		
		for (let data of opts.selected) {
			let el = renderOption(opts, data, 1);
			el.appendTo(t2);
		}
	}
	/**
	 * 渲染选项内容
	 * 
	 * @param opts 组件参数
	 * @param data 选项数据
	 * @param type 框体标识 0-待选框体 1-已选框体
	 * @returns 选项内容对象
	 */
	function renderOption(opts, data, type) {
		let value = data[opts.valueField];
		let text = data[opts.textField];
		let el = $('<span class="selectbox-option"></span>');
		el.attr('value', value).text(text);
		if (type == 1) {
			el.addClass(`align-${opts.selectedPanelAlign}`);
		} else {
			el.addClass(`align-${opts.waitingPanelAlign}`);
		}
		return el;
	}
	/**
	 * 绑定组件函数
	 * 
	 * @param target
	 */
	function bindEvent(target) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		let disabled = opts.disabled;
		let readonly = opts.readonly;
		
		// 键盘事件监听
		$(window).unbind('.selectbox').bind('keydown.selectbox', function(e) {
			SELECTBOX_KEY_CODE = e.keyCode;
		}).bind('keyup.selectbox', function(e) {
			SELECTBOX_KEY_CODE = null;
		});
		// 选项框函数
		selectbox.find('.options-frame').unbind('.selectbox').bind('blur.selectbox', function() {
			$(this).removeClass('textbox-focused');
		}).bind('focus.selectbox', function() {
			$(this).addClass('textbox-focused');
		});
		// 选项函数
		selectbox.find('.selectbox-option').each(function() {
			$(this).unbind('.selectbox').bind('click.selectbox', function(e) {
				if (disabled) 
					return false;
				let t = $(this);
				let t1 = t.parent().find('.selectbox-option');
				if (!opts.multiple) {
					t1.removeClass('selected');
				}
				if (t.hasClass('selected')) {
					t.removeClass('selected');
				} else {
					t.addClass('selected');
				}
				// Shift键复选判断
				if (SELECTBOX_KEY_CODE == 16) {
					let last = t.parent().find('.selectbox-option.last-selected');
					let start = $(t1).index(this);
					let end = $(t1).index(last[0]);
					if (end < start) {
						[start, end] = [end, start];
					}
					for (let i=start; i<end; i++) {
						if (!t1.eq(i).hasClass('selected')) {
							t1.eq(i).addClass('selected');
						}
					}
				}
				selectbox.find('.selectbox-option').removeClass('last-selected');
				t.addClass('last-selected');
			});
		});
		// 选择按钮函数
		selectbox.find('.selectbox-icon-select').unbind('.selectbox').bind('click.selectbox', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = selectbox.find('.selectbox-waiting').find('.selected').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(selectbox.find('.selectbox-selected'));
			_doSelect(data, selectbox);
			
			opts.onSelect.call(this, data);
		});
		// 移除按钮函数
		selectbox.find('.selectbox-icon-remove').unbind('.selectbox').bind('click.selectbox', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = selectbox.find('.selectbox-selected').find('.selected').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(selectbox.find('.selectbox-waiting'));
			_doRemove(data, selectbox);
			
			opts.onRemove.call(this, data);
		});
		// 全部选择按钮函数
		selectbox.find('.selectbox-icon-selectAll').unbind('.selectbox').bind('click.selectbox', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = selectbox.find('.selectbox-waiting').find('.selectbox-option').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(selectbox.find('.selectbox-selected'));
			_doSelect(data, selectbox);
			
			opts.onSelectAll.call(this, data);
		});
		// 全部移除按钮函数
		selectbox.find('.selectbox-icon-removeAll').unbind('.selectbox').bind('click.selectbox', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = selectbox.find('.selectbox-selected').find('.selectbox-option').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(selectbox.find('.selectbox-waiting'));
			_doRemove(data, selectbox);
			
			opts.onRemoveAll.call(this, data);
		});
		// 上移按钮函数
		selectbox.find('.selectbox-icon-up').unbind('.selectbox').bind('click.selectbox', function() {
			if (disabled || readonly) 
				return false;
			let index = 0;
			let selected = selectbox.find('.selectbox-selected').find('.selectbox-option').each(function() {
				if ($(this).hasClass('selected')) {
					return false;
				}
				index++;
			});
			if (index > 0) {
				let to = selected.eq(--index);
				let from = selectbox.find('.selectbox-selected').find('.selected');
				from.insertBefore(to);
				
				_setValue(target);
				
				opts.onUp.call(this, from, to);
			}
		});
		// 下移按钮函数
		selectbox.find('.selectbox-icon-down').unbind('.selectbox').bind('click.selectbox', function() {
			if (disabled || readonly) 
				return false;
			let selected = selectbox.find('.selectbox-selected').find('.selectbox-option');
			let from = selectbox.find('.selectbox-selected').find('.selected');
			let last = from.last();
			let index = $(selected).index(last);
			if (index < selected.length - 1) {
				let to = selected.eq(++index);
				from.insertAfter(to);
				
				_setValue(target);
				
				opts.onDown.call(this, from, to);
			}
		});
	}
	/**
	 * 设置组件禁用/启用
	 * 
	 * @param target DOM对象
	 * @param disabled 禁用/启用
	 */
	function setDisabled(target, disabled=false) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		
		opts.disabled = disabled;
		if (opts.disabled) {
			selectbox.addClass('is-disabled');
		} else {
			selectbox.removeClass('is-disabled');
		}
	}
	/**
	 * 设置组件只读/读写
	 * 
	 * @param target DOM对象
	 * @param readonly 只读/读写
	 */
	function setReadonly(target, readonly=false) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		
		opts.readonly = readonly;
		if (opts.readonly) {
			selectbox.addClass('is-readonly');
		} else {
			selectbox.removeClass('is-readonly');
		}
	}
	/**
	 * 设置组件值
	 * 
	 * @param target DOM对象
	 */
	function _setValue(target) {
		let options = $.data(target, 'selectbox');
		let opts = options.options;
		let selectbox = options.selectbox;
		
		selectbox.find('.selectbox-value').remove();
		selectbox.find('.selectbox-selected').find('.selectbox-option').each(function() {
			let value = $(this).attr('value');
			let text = $(this).text();
			let input = $('<input class="selectbox-value"></input>');
			input.hide().attr({value: value, text: text}).appendTo(selectbox);
		});
	}
	/**
	 * 选择
	 * 
	 * @param data 参数
	 * @param selectbox 组件对象
	 */
	function _doSelect(data, selectbox) {
		if (!$.isArray(data)) {
			data = [data];
		}
		for (let v of data) {
			let input = $('<input class="selectbox-value"></input>');
			input.hide().attr({value: v.value, text: v.text}).appendTo(selectbox);
		}
	}
	/**
	 * 移除
	 * 
	 * @param data 参数
	 * @param selectbox 组件对象
	 */
	function _doRemove(data, selectbox) {
		if (!$.isArray(data)) {
			data = [data];
		}
		for (let v of data) {
			selectbox.find('input[class="selectbox-value"][value="' + v.value + '"]').remove();
		}
	}
	
	$.fn.selectbox = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.selectbox.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'selectbox');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'selectbox', {
					options: $.extend({}, $.fn.selectbox.defaults, $.fn.selectbox.parseOptions(this), options),
					selectbox: init(this)
				});
			}
			createSelectbox(this);
		});
	};
	
	$.fn.selectbox.methods = {
		options: function(jq) {
			return $.data(jq[0], 'selectbox').options;
		},
		selectbox: function(jq) {
			return $.data(jq[0], 'selectbox').options.selectbox;
		},
		resize: function(jq, {width = 'auto', height = 'auto'}) {
			return jq.each(function() {
				let options = $.data(this, 'selectbox');
				let opts = options.options;
				let selectbox = options.selectbox;
				
				if (width != 'auto') {
					selectbox.width(width);
				}
				if (height != 'auto') {
					selectbox.height(height);
				}
				
				let t1 = selectbox.find('.selectbox-waiting');
				let t2 = selectbox.find('.selectbox-selected');
				let t3 = selectbox.find('.selectbox-btn');
				let [deltaSize, btnSize, frameSize] = [0, 0, 0];
				
				let setFrameSize = function(t, type, size) {
					t.css(type, size + 'px');
				};
				
				if (opts.direction == 'horizontal' || opts.direction == 'h') {
					btnSize = t3.outerWidth();
					deltaSize = t1.outerHeight() - t1.height();
					frameSize = (selectbox.width() - btnSize - deltaSize * 2) / 2;
					
					setFrameSize(t1, 'width', frameSize);
					setFrameSize(t1, 'height', selectbox.height() - deltaSize);
					setFrameSize(t2, 'width', frameSize);
					setFrameSize(t2, 'height', selectbox.height() - deltaSize);
					setFrameSize(t3, 'height', selectbox.height());
				} else {
					btnSize = t3.outerHeight();
					deltaSize = t1.outerWidth() - t1.width();
					frameSize = (selectbox.height() - btnSize - deltaSize * 2) / 2;
					
					setFrameSize(t1, 'width', selectbox.width() - deltaSize);
					setFrameSize(t1, 'height', frameSize);
					setFrameSize(t2, 'width', selectbox.width() - deltaSize);
					setFrameSize(t2, 'height', frameSize);
					setFrameSize(t3, 'width', selectbox.width());
				}
			});
		},
		reset: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'selectbox');
				let opts = options.options;
				let selectbox = options.selectbox;
				
				let t1 = selectbox.find('.selectbox-waiting').empty();
				let t2 = selectbox.find('.selectbox-selected').empty();
				
				for (let data of opts.waiting) {
					let el = renderOption(opts, data, 0);
					el.appendTo(t1);
				}
				
				for (let data of opts.selected) {
					let el = renderOption(opts, data, 1);
					el.appendTo(t2);
				}
			});
		},
		disable: function(jq) {
			return jq.each(function() {
				setDisabled(this, true);
			});
		},
		enable: function(jq) {
			return jq.each(function() {
				setDisabled(this, false);
			});
		},
		readonly: function(jq, mode) {
			return jq.each(function() {
				setReadonly(this, mode);
			});
		},
		select: function(jq, value = '') {
			return jq.each(function() {
				let options = $.data(this, 'selectbox');
				let opts = options.options;
				let selectbox = options.selectbox;
				
				let t1 = selectbox.find('.selectbox-waiting');
				let t2 = selectbox.find('.selectbox-selected');
				for (let v of value.split(opts.separator)) {
					let node = t1.find('.selectbox-option[value="' + v + '"]');
					node.appendTo(t2);
				}
				_setValue(this);
			});
		},
		remove: function(jq, value = '') {
			return jq.each(function() {
				let options = $.data(this, 'selectbox');
				let opts = options.options;
				let selectbox = options.selectbox;
				
				let t1 = selectbox.find('.selectbox-waiting');
				let t2 = selectbox.find('.selectbox-selected');
				for (let v of value.split(opts.separator)) {
					let node = t2.find('.selectbox-option[value="' + v + '"]');
					node.appendTo(t1);
				}
				_setValue(this);
			});
		},
		selectAll: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'selectbox');
				let opts = options.options;
				let selectbox = options.selectbox;
				
				let t1 = selectbox.find('.selectbox-waiting');
				let t2 = selectbox.find('.selectbox-selected');
				t1.find('.selectbox-option').appendTo(t2);
				
				_setValue(this);
			});
		},
		removeAll: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'selectbox');
				let opts = options.options;
				let selectbox = options.selectbox;
				
				let t1 = selectbox.find('.selectbox-waiting');
				let t2 = selectbox.find('.selectbox-selected');
				t2.find('.selectbox-option').appendTo(t1);
				
				_setValue(this);
			});
		},
		getValue: function(jq) {
			let options = $.data(jq[0], 'selectbox');
			let opts = options.options;
			let selectbox = options.selectbox;
			
			let value = '', separator = opts.separator;
			selectbox.find('.selectbox-value').each(function() {
				if (value) {
					value += separator + $(this).val();
				} else {
					value = $(this).val();
				}
			});
			return value;
		},
		setValue: function(jq, value = '') {
			return jq.each(function() {
				let options = $.data(jq[0], 'selectbox');
				let opts = options.options;
				let selectbox = options.selectbox;
				
				let t1 = selectbox.find('.selectbox-waiting');
				let t2 = selectbox.find('.selectbox-selected');
				for (let v of value.split(opts.separator)) {
					let node = t1.find('.selectbox-option[value="' + v + '"]');
					node.appendTo(t2);
				}
				_setValue(this);
			});
		},
		getSelected: function(jq) {
			let options = $.data(jq[0], 'selectbox');
			let opts = options.options;
			let selectbox = options.selectbox;
			
			let data = [];
			let valueField = opts.valueField, textField = opts.textField;
			selectbox.find('.selectbox-selected').find('.selectbox-option').each(function() {
				let v = {};
				v[valueField] = $(this).attr('value');
				v[textField] = $(this).text();
				data.push(v);
			});
			return data;
		},
		getWaiting: function(jq) {
			let options = $.data(jq[0], 'selectbox');
			let opts = options.options;
			let selectbox = options.selectbox;
			
			let data = [];
			let valueField = opts.valueField, textField = opts.textField;
			selectbox.find('.selectbox-waiting').find('.selectbox-option').each(function() {
				let v = {};
				v[valueField] = $(this).attr('value');
				v[textField] = $(this).text();
				data.push(v);
			});
			return data;
		}
	};
	
	$.fn.selectbox.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, 
			['width','height','direction','separator','waitingPanelAlign','selectedPanelAlign','valueField','textField',
			 {multiple:'boolean',sort:'boolean',totalSelect:'boolean',disabled:'boolean',readonly:'boolean'},
			 {waitingPanelWidth:'number',waitingPanelHeight:'number',selectedPanelWidth:'number',selectedPanelHeight:'number'}]
		));
	};
	
	$.fn.selectbox.defaults = {
		width: 'auto',
		height: 'auto',
		direction: 'horizontal',// vertical,horizontal
		separator: ',',
		multiple: true,
		sort: false,
		totalSelect: true,
		disabled: false,
		readonly: false,
		waiting: [],
		selected: [],
		waitingPanelWidth: null,
		waitingPanelHeight: null,
		waitingPanelAlign: 'left', // left,center,right
		selectedPanelWidth: null,
		selectedPanelHeight: null,
		selectedPanelAlign: 'left', // left,center,right
		valueField: 'value',
		textField: 'text',
		onSelect: function(data){},
		onRemove:function(data){},
		onSelectAll: function(data){},
		onRemoveAll: function(data){},
		onUp: function(from, to){},
		onDown: function(from ,to){}
	};
})(jQuery);