/**
 * 穿梭框组件
 */
(function($) {
	/**
	 * 组件监听按钮
	 */
	let SELECTBOX_KEY_CODE = null;
	/**
	 * 穿梭框组件模板
	 */
	const TRANSFER_TEMPLATE = '' +
	'<div class="transfer-waiting transfer-panel" tabindex="0">' +
		'<div class="transfer-header">' +
  	  		'<span class="title"></span>' +
  		'</div>' +
  		'<div class="options-frame"></div>' +
	'</div>' +
	'<div class="transfer-btn">' +
		'<div class="selected-btn-warp">' +
		     '<span class="soc-icon-font transfer-icon transfer-icon-select"></span>' +
		     '<span class="soc-icon-font transfer-icon transfer-icon-remove"></span>' +
		     '<span class="soc-icon-font transfer-icon transfer-icon-selectAll"></span>' +
		     '<span class="soc-icon-font transfer-icon transfer-icon-removeAll"></span>' +
		     '<span class="soc-icon-font transfer-icon transfer-icon-up"></span>' +
		     '<span class="soc-icon-font transfer-icon transfer-icon-down"></span>' +
	     '</div>' +
     '</div>' +
     '<div class="transfer-selected transfer-panel" tabindex="0">' +
 	  	'<div class="transfer-header">' +
 	  	  	'<span class="title"></span>' +
  	  	'</div>' +
  	  	'<div class="options-frame"></div>' +
  	 '</div>';
	/**
	 * 初始化组件
	 */
	function init(target) {
		let t = $(target);
		t.addClass('transfer-f').hide();
		let transfer = $('<span class="transfer">' + TRANSFER_TEMPLATE + '</span>').insertAfter(target);
		let name = t.attr('name') || t.attr('selectboxName');
		if (name){
			t.removeAttr('name').attr('selectboxName', name);
		}
		return transfer;
	}
	/**
	 * 创建组件UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createSelectbox(target) {
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		
		transfer.empty();
		$(TRANSFER_TEMPLATE).appendTo(transfer);
		
		if (opts.width != 'auto') {
			transfer.width(opts.width);
		}
		if (opts.height != 'auto') {
			transfer.height(opts.height);
			let frameHeight = transfer.find('.transfer-panel').height();
			if (opts.showHeader) {
				frameHeight -= transfer.find('.transfer-header').outerHeight();
			}
			transfer.find('.options-frame').height(frameHeight);
		}
		
		if (opts.showHeader) {
			transfer.find('.transfer-waiting .transfer-header .title').text(opts.waitingTitle);
			transfer.find('.transfer-selected .transfer-header .title').text(opts.selectedTitle);
		} else {
			transfer.find('.transfer-header').css('display', 'none');
		}
		
		if (opts.direction == 'horizontal' || opts.direction == 'h') {
			transfer.removeClass('is-horizontal is-vertical').addClass('is-horizontal');
		} else {
			transfer.removeClass('is-horizontal is-vertical').addClass('is-vertical');
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
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		
		let t1 = transfer.find('.transfer-waiting');
		let btn = transfer.find('.transfer-btn');
		let deltaSize = 0;
		if (!opts.totalSelect) {
			btn.find('.transfer-icon-selectAll').hide();
			btn.find('.transfer-icon-removeAll').hide();
		}
		if (!opts.sort) {
			btn.find('.transfer-icon-up').hide();
			btn.find('.transfer-icon-down').hide();
		}
		
		if (opts.direction == 'horizontal' || opts.direction == 'h') {
			let width = btn.find('.transfer-icon').outerWidth();
			deltaSize = t1.outerHeight() - t1.height();
			btn.width(width);
			btn.height(transfer.height() - deltaSize);
		} else {
			let height = btn.find('.transfer-icon').outerHeight();
			deltaSize = t1.outerWidth() - t1.width();
			btn.height(height);
			btn.width(transfer.width() - deltaSize);
		}
	}
	/**
	 * 渲染选择框体
	 * 
	 * @param target DOM对象
	 */
	function renderFrame(target) {
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		
		let t1 = transfer.find('.transfer-waiting');
		let t2 = transfer.find('.transfer-selected');
		let btn = transfer.find('.transfer-btn');
		let [deltaSize, btnSize, frameSize] = [0, 0, 0];
		let [waitingPanelWidth, waitingPanelHeight, selectedPanelWidth, selectedPanelHeight] = [opts.waitingPanelWidth, opts.waitingPanelHeight, opts.selectedPanelWidth, opts.selectedPanelHeight];
		let setFrameSize = function(t, type, defaultSize, size) {
			size = defaultSize || size;
			t.css(type, size + 'px');
		};
		
		if (opts.direction == 'horizontal' || opts.direction == 'h') {
			btnSize = btn.outerWidth();
			deltaSize = t1.outerHeight() - t1.height();
			frameSize = (transfer.width() - btnSize - deltaSize * 2) / 2;
			
			setFrameSize(t1, 'width', waitingPanelWidth, frameSize);
			setFrameSize(t1, 'height', waitingPanelHeight, transfer.height() - deltaSize);
			setFrameSize(t2, 'width', selectedPanelWidth, frameSize);
			setFrameSize(t2, 'height', selectedPanelHeight, transfer.height() - deltaSize);
		} else {
			btnSize = btn.outerHeight();
			deltaSize = t1.outerWidth() - t1.width();
			frameSize = (transfer.height() - btnSize - deltaSize * 2) / 2;
			
			setFrameSize(t1, 'width', waitingPanelWidth, transfer.width() - deltaSize);
			setFrameSize(t1, 'height', waitingPanelHeight, frameSize);
			setFrameSize(t2, 'width', selectedPanelWidth, transfer.width() - deltaSize);
			setFrameSize(t2, 'height', selectedPanelHeight, frameSize);
		}
	}
	/**
	 * 渲染内容
	 * 
	 * @param target DOM对象
	 */
	function renderContent(target) {
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		
		let t1 = transfer.find('.transfer-waiting .options-frame');
		let t2 = transfer.find('.transfer-selected .options-frame');
		
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
		let el = $('<span class="transfer-option"></span>');
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
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		let disabled = opts.disabled;
		let readonly = opts.readonly;
		
		// 键盘事件监听
		$(window).unbind('.transfer').bind('keydown.transfer', function(e) {
			SELECTBOX_KEY_CODE = e.keyCode;
		}).bind('keyup.transfer', function(e) {
			SELECTBOX_KEY_CODE = null;
		});
		// 选项框函数
		transfer.find('.options-frame').unbind('.transfer').bind('blur.transfer', function() {
			$(this).removeClass('textbox-focused');
		}).bind('focus.transfer', function() {
			$(this).addClass('textbox-focused');
		});
		// 选项函数
		transfer.find('.transfer-option').each(function() {
			$(this).unbind('.transfer').bind('click.transfer', function(e) {
				if (disabled) 
					return false;
				let t = $(this);
				let t1 = t.parent().find('.transfer-option');
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
					let last = t.parent().find('.transfer-option.last-selected');
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
				transfer.find('.transfer-option').removeClass('last-selected');
				t.addClass('last-selected');
			});
		});
		// 选择按钮函数
		transfer.find('.transfer-icon-select').unbind('.transfer').bind('click.transfer', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = transfer.find('.transfer-waiting').find('.selected').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(transfer.find('.transfer-selected .options-frame'));
			_doSelect(data, transfer);
			
			opts.onSelect.call(this, data);
		});
		// 移除按钮函数
		transfer.find('.transfer-icon-remove').unbind('.transfer').bind('click.transfer', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = transfer.find('.transfer-selected').find('.selected').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(transfer.find('.transfer-waiting .options-frame'));
			_doRemove(data, transfer);
			
			opts.onRemove.call(this, data);
		});
		// 全部选择按钮函数
		transfer.find('.transfer-icon-selectAll').unbind('.transfer').bind('click.transfer', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = transfer.find('.transfer-waiting').find('.transfer-option').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(transfer.find('.transfer-selected .options-frame'));
			_doSelect(data, transfer);
			
			opts.onSelectAll.call(this, data);
		});
		// 全部移除按钮函数
		transfer.find('.transfer-icon-removeAll').unbind('.transfer').bind('click.transfer', function() {
			if (disabled || readonly) 
				return false;
			let data = [];
			let selected = transfer.find('.transfer-selected').find('.transfer-option').each(function() {
				$(this).removeClass('selected');
				data.push({value: $(this).attr('value'), text: $(this).text()});
			});
			selected.appendTo(transfer.find('.transfer-waiting .options-frame'));
			_doRemove(data, transfer);
			
			opts.onRemoveAll.call(this, data);
		});
		// 上移按钮函数
		transfer.find('.transfer-icon-up').unbind('.transfer').bind('click.transfer', function() {
			if (disabled || readonly) 
				return false;
			let index = 0;
			let selected = transfer.find('.transfer-selected').find('.transfer-option').each(function() {
				if ($(this).hasClass('selected')) {
					return false;
				}
				index++;
			});
			if (index > 0) {
				let to = selected.eq(--index);
				let from = transfer.find('.transfer-selected').find('.selected');
				from.insertBefore(to);
				
				_setValue(target);
				
				opts.onUp.call(this, from, to);
			}
		});
		// 下移按钮函数
		transfer.find('.transfer-icon-down').unbind('.transfer').bind('click.transfer', function() {
			if (disabled || readonly) 
				return false;
			let selected = transfer.find('.transfer-selected').find('.transfer-option');
			let from = transfer.find('.transfer-selected').find('.selected');
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
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		
		opts.disabled = disabled;
		if (opts.disabled) {
			transfer.addClass('is-disabled');
		} else {
			transfer.removeClass('is-disabled');
		}
	}
	/**
	 * 设置组件只读/读写
	 * 
	 * @param target DOM对象
	 * @param readonly 只读/读写
	 */
	function setReadonly(target, readonly=false) {
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		
		opts.readonly = readonly;
		if (opts.readonly) {
			transfer.addClass('is-readonly');
		} else {
			transfer.removeClass('is-readonly');
		}
	}
	/**
	 * 设置组件值
	 * 
	 * @param target DOM对象
	 */
	function _setValue(target) {
		let options = $.data(target, 'transfer');
		let opts = options.options;
		let transfer = options.transfer;
		
		transfer.find('.transfer-value').remove();
		transfer.find('.transfer-selected').find('.transfer-option').each(function() {
			let value = $(this).attr('value');
			let text = $(this).text();
			let input = $('<input class="transfer-value"></input>');
			input.hide().attr({value: value, text: text}).appendTo(transfer);
		});
	}
	/**
	 * 选择
	 * 
	 * @param data 参数
	 * @param transfer 组件对象
	 */
	function _doSelect(data, transfer) {
		if (!$.isArray(data)) {
			data = [data];
		}
		for (let v of data) {
			let input = $('<input class="transfer-value"></input>');
			input.hide().attr({value: v.value, text: v.text}).appendTo(transfer);
		}
	}
	/**
	 * 移除
	 * 
	 * @param data 参数
	 * @param transfer 组件对象
	 */
	function _doRemove(data, transfer) {
		if (!$.isArray(data)) {
			data = [data];
		}
		for (let v of data) {
			transfer.find('input[class="transfer-value"][value="' + v.value + '"]').remove();
		}
	}
	
	$.fn.transfer = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.transfer.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'transfer');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'transfer', {
					options: $.extend({}, $.fn.transfer.defaults, $.fn.transfer.parseOptions(this), options),
					transfer: init(this)
				});
			}
			createSelectbox(this);
		});
	};
	
	$.fn.transfer.methods = {
		options: function(jq) {
			return $.data(jq[0], 'transfer').options;
		},
		transfer: function(jq) {
			return $.data(jq[0], 'transfer').options.transfer;
		},
		resize: function(jq, {width = 'auto', height = 'auto'}) {
			return jq.each(function() {
				let options = $.data(this, 'transfer');
				let opts = options.options;
				let transfer = options.transfer;
				
				if (width != 'auto') {
					transfer.width(width);
				}
				if (height != 'auto') {
					transfer.height(height);
				}
				
				let t1 = transfer.find('.transfer-waiting');
				let t2 = transfer.find('.transfer-selected');
				let t3 = transfer.find('.transfer-btn');
				let [deltaSize, btnSize, frameSize] = [0, 0, 0];
				
				let setFrameSize = function(t, type, size) {
					t.css(type, size + 'px');
				};
				
				if (opts.direction == 'horizontal' || opts.direction == 'h') {
					btnSize = t3.outerWidth();
					deltaSize = t1.outerHeight() - t1.height();
					frameSize = (transfer.width() - btnSize - deltaSize * 2) / 2;
					
					setFrameSize(t1, 'width', frameSize);
					setFrameSize(t1, 'height', transfer.height() - deltaSize);
					setFrameSize(t2, 'width', frameSize);
					setFrameSize(t2, 'height', transfer.height() - deltaSize);
					setFrameSize(t3, 'height', transfer.height());
				} else {
					btnSize = t3.outerHeight();
					deltaSize = t1.outerWidth() - t1.width();
					frameSize = (transfer.height() - btnSize - deltaSize * 2) / 2;
					
					setFrameSize(t1, 'width', transfer.width() - deltaSize);
					setFrameSize(t1, 'height', frameSize);
					setFrameSize(t2, 'width', transfer.width() - deltaSize);
					setFrameSize(t2, 'height', frameSize);
					setFrameSize(t3, 'width', transfer.width());
				}
			});
		},
		reset: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'transfer');
				let opts = options.options;
				let transfer = options.transfer;
				
				let t1 = transfer.find('.transfer-waiting .options-frame').empty();
				let t2 = transfer.find('.transfer-selected .options-frame').empty();
				
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
				let options = $.data(this, 'transfer');
				let opts = options.options;
				let transfer = options.transfer;
				
				let t1 = transfer.find('.transfer-waiting');
				let t2 = transfer.find('.transfer-selected');
				for (let v of value.split(opts.separator)) {
					let node = t1.find('.transfer-option[value="' + v + '"]');
					node.appendTo(t2);
				}
				_setValue(this);
			});
		},
		remove: function(jq, value = '') {
			return jq.each(function() {
				let options = $.data(this, 'transfer');
				let opts = options.options;
				let transfer = options.transfer;
				
				let t1 = transfer.find('.transfer-waiting');
				let t2 = transfer.find('.transfer-selected');
				for (let v of value.split(opts.separator)) {
					let node = t2.find('.transfer-option[value="' + v + '"]');
					node.appendTo(t1);
				}
				_setValue(this);
			});
		},
		selectAll: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'transfer');
				let opts = options.options;
				let transfer = options.transfer;
				
				let t1 = transfer.find('.transfer-waiting');
				let t2 = transfer.find('.transfer-selected');
				t1.find('.transfer-option').appendTo(t2);
				
				_setValue(this);
			});
		},
		removeAll: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'transfer');
				let opts = options.options;
				let transfer = options.transfer;
				
				let t1 = transfer.find('.transfer-waiting');
				let t2 = transfer.find('.transfer-selected');
				t2.find('.transfer-option').appendTo(t1);
				
				_setValue(this);
			});
		},
		getValue: function(jq) {
			let options = $.data(jq[0], 'transfer');
			let opts = options.options;
			let transfer = options.transfer;
			
			let value = '', separator = opts.separator;
			transfer.find('.transfer-value').each(function() {
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
				let options = $.data(jq[0], 'transfer');
				let opts = options.options;
				let transfer = options.transfer;
				
				let t1 = transfer.find('.transfer-waiting');
				let t2 = transfer.find('.transfer-selected');
				for (let v of value.split(opts.separator)) {
					let node = t1.find('.transfer-option[value="' + v + '"]');
					node.appendTo(t2);
				}
				_setValue(this);
			});
		},
		getSelected: function(jq) {
			let options = $.data(jq[0], 'transfer');
			let opts = options.options;
			let transfer = options.transfer;
			
			let data = [];
			let valueField = opts.valueField, textField = opts.textField;
			transfer.find('.transfer-selected').find('.transfer-option').each(function() {
				let v = {};
				v[valueField] = $(this).attr('value');
				v[textField] = $(this).text();
				data.push(v);
			});
			return data;
		},
		getWaiting: function(jq) {
			let options = $.data(jq[0], 'transfer');
			let opts = options.options;
			let transfer = options.transfer;
			
			let data = [];
			let valueField = opts.valueField, textField = opts.textField;
			transfer.find('.transfer-waiting').find('.transfer-option').each(function() {
				let v = {};
				v[valueField] = $(this).attr('value');
				v[textField] = $(this).text();
				data.push(v);
			});
			return data;
		}
	};
	
	$.fn.transfer.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, 
			['width','height','direction','separator','waitingPanelAlign','selectedPanelAlign','valueField','textField','waitingTitle','selectedTitle',
			 {multiple:'boolean',sort:'boolean',totalSelect:'boolean',disabled:'boolean',readonly:'boolean',showHeader:'boolean'},
			 {waitingPanelWidth:'number',waitingPanelHeight:'number',selectedPanelWidth:'number',selectedPanelHeight:'number'}]
		));
	};
	
	$.fn.transfer.defaults = {
		width: 'auto',
		height: 'auto',
		direction: 'horizontal',// vertical,horizontal
		separator: ',',
		multiple: true,
		sort: false,
		totalSelect: true,
		disabled: false,
		readonly: false,
		showHeader: true,
		waiting: [],
		selected: [],
		waitingPanelWidth: null,
		waitingPanelHeight: null,
		waitingPanelAlign: 'left', // left,center,right
		waitingTitle: 'Choose',
		selectedPanelWidth: null,
		selectedPanelHeight: null,
		selectedPanelAlign: 'left', // left,center,right
		selectedTitle: 'Selected',
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