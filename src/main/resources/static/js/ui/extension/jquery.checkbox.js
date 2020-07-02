/**
 * 复选组件
 */
(function($) {
	function init(target) {
		let state = $.data(target, 'checkbox');
		let opts = state.options;
		let t = $(target);
		t.addClass('checkbox-f').hide();
		let name = t.attr('name') || t.attr('checkboxName');
		if (name){
			t.removeAttr('name').attr('checkboxName', name);
		}
		opts.name = name;
		
		let dataProvider = opts.dataProvider || [];
		if (dataProvider.length == 0) {
			$('label[name="' + name + '"]').each(function() {
				var _opts = $.extend({}, {
					text: $.trim($(this).html()),
					value: $(this).attr('value')
				});
				dataProvider.push(_opts);
				$(this).remove();
			});
			$.data(target, 'checkbox').options = $.extend({}, opts, {dataProvider: dataProvider});
		} else {
			$('label[name="' + name + '"]').remove();
		}
		
		let checkbox = renderCheckbox(t, opts);
		$.data(target, 'checkbox').options = $.extend({}, opts, {checkbox: checkbox});
		if (opts.width) {
			setWidth(checkbox, opts.width);
		}
		if (opts.height) {
			setHeight(checkbox, opts.height);
		}
		if (opts.readonly) {
			setReadonly(checkbox, opts.readonly);
		}
		if (opts.disabled) {
			setDisabled(checkbox, opts.disabled);
		}
		if (opts.value) {
			setValue(checkbox, opts.value, t);
		}
		checkbox.insertAfter(target);
		let maxLabelWidth = 0; // 最大标签文字宽度
		checkbox.find('.checkbox-label').each(function() {
			if (maxLabelWidth < $(this).width()) {
				maxLabelWidth = $(this).width();
			}
		});
		checkbox.find('.checkbox-label').each(function() {
			$(this).width(maxLabelWidth);
		});
	}
	/**
	 * 渲染复选框
	 */
	function renderCheckbox(target, opts) {
		if (opts.checkbox) {
			opts.checkbox.remove();
		}
		let checkboxEl = $('<span class="checkbox" name="' + opts.name + '"></span>');
		let dataProvider = opts.dataProvider;
		if (dataProvider != undefined && dataProvider.length > 0) {
			for (let i=0; i<dataProvider.length; i++) {
				let data = dataProvider[i];
				let inner = '';
				if (opts.labelAlign == 'right') {
					inner = '' +
					'<span class="checkbox-inner" data-value="' + data[opts.valueField] + '" data-text="' + data[opts.textField] + '" check="false">' +
						'<span class="checkbox-label" style="text-align:right;">' + data[opts.textField] + '</span>' +
						'<span class="checkbox-button check" style="display:none;"></span>' +
						'<span class="checkbox-button uncheck" style="display:block;"></span>' +
					'</span>';
				} else {
					inner = '' +
					'<span class="checkbox-inner" data-value="' + data[opts.valueField] + '" data-text="' + data[opts.textField] + '" check="false">' +
						'<span class="checkbox-button check" style="display:none;"></span>' +
						'<span class="checkbox-button uncheck" style="display:block;"></span>' +
						'<span class="checkbox-label">' + data[opts.textField] + '</span>' +
					'</span>';
				}
				let innerEl = $(inner);
				if (opts.cols != 'auto' && i % parseInt(opts.cols) == 0) {
					innerEl.addClass('checkbox-clear');
				}
				// 绑定点击函数
				innerEl.bind('click.checkbox', function() {
					if (opts.disabled === false && opts.readonly === false) {
						doClick($(this), checkboxEl, target);
					}
				});
				checkboxEl.append(innerEl);
			}
		}
		let valueEl = $('<input class="checkbox-value" type="hidden" name="' + opts.name + '" value="' + (opts.value || '') + '"></input>');
		checkboxEl.append(valueEl);
		return checkboxEl;
	}
	/**
	 * 设置宽度
	 */
	function setWidth(el, width) {
		el.css('width', width);
	}
	/**
	 * 设置高度
	 */
	function setHeight(el, height) {
		el.css('height', height);
	}
	/**
	 * 设置只读
	 */
	function setReadonly(el, readonly) {
		if (readonly === true) {
			el.find('.checkbox-inner').each(function() {
				$(this).addClass('checkbox-readonly');
			});
		} else {
			el.find('.checkbox-inner').each(function() {
				$(this).removeClass('checkbox-readonly');
			});
		}
	}
	/**
	 * 设置禁用
	 */
	function setDisabled(el, disabled) {
		if (disabled === true) {
			el.find('.checkbox-inner').each(function() {
				$(this).addClass('checkbox-disabled');
			});
		} else {
			el.find('.checkbox-inner').each(function() {
				$(this).removeClass('checkbox-disabled');
			});
		}
	}
	/**
	 * 获取值
	 */
	function getValue(el) {
		let value = el.find('.checkbox-value').attr('value');
		return value ? value : null;
	}
	/**
	 * 设置值
	 */
	function setValue(el, value, jq) {
		let opts = $.data(jq[0], 'checkbox').options;
		// 重置
		reset(el);
		// 生成正则
		let regex = new RegExp(opts.separator, 'g');
		let values = value.split(regex);
		let text = null;
		for (let i=0; i<values.length; i++) {
			let target = el.find('[class*="checkbox-inner"][data-value="' + values[i] + '"]');
			// 勾选
			target.find('.check').css('display', 'block');
			target.find('.uncheck').css('display', 'none');
			target.attr('check', 'true');
			let dataText = target.attr('data-text');
			if (text) {
				text += opts.separator + dataText;
			} else {
				text = dataText;
			}
		}
		let oldValue = el.find('.checkbox-value').attr('value');
		el.find('.checkbox-value').attr('value', value);
		el.find('.checkbox-value').attr('text', text);
		if (oldValue != value) {
			opts.onChange.call(jq, value, oldValue);
		}
	}
	/**
	 * 点击函数
	 */
	function doClick(target, el, jq) {
		let opts = $.data(jq[0], 'checkbox').options;
		let check = target.attr('check');
		if (check == 'true') {
			target.find('.check').css('display', 'none');
			target.find('.uncheck').css('display', 'block');
			target.attr('check', 'false');
		} else {
			target.find('.check').css('display', 'block');
			target.find('.uncheck').css('display', 'none');
			target.attr('check', 'true');
		}
		let value = null; // 组件值
		let text = null; // 组件文字
		el.find('[class*="checkbox-inner"][check="true"]').each(function() {
			let dataValue = $(this).attr('data-value');
			let dataText = $(this).attr('data-text');
			if (value) {
				value += opts.separator + dataValue;
				text += opts.separator + dataText;
			} else {
				value = dataValue;
				text = dataText;
			}
		});
		let oldValue = el.find('.checkbox-value').attr('value');
		el.find('.checkbox-value').attr('value', value);
		el.find('.checkbox-value').attr('text', text);
		if (oldValue != value) {
			opts.onChange.call(jq, value, oldValue);
		}
	}
	/**
	 * 重置组件
	 */
	function reset(el) {
		el.find('.checkbox-inner').each(function() {
			$(this).find('.check').css('display', 'none');
			$(this).find('.uncheck').css('display', 'block');
			$(this).attr('check', 'false');
		});
		el.find('.checkbox-value').attr('value', null);
		el.find('.checkbox-value').attr('text', null);
	}
	
	$.fn.checkbox = function(options, param){
		if (typeof options == 'string') {
			let method = $.fn.checkbox.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'checkbox');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'checkbox', {
					options: $.extend({}, $.fn.checkbox.defaults, $.fn.checkbox.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn.checkbox.methods = {
		/**
		 * 获取参数
		 */
		options: function(jq){
			return $.data(jq[0], 'checkbox').options;
		},
		/**
		 * 禁用
		 */
		disabled: function(jq, disabled) {
			return jq.each(function() {
				let opts = $(this).checkbox('options');
				setDisabled(opts.checkbox, disabled);
				opts.disabled = disabled;
			});
		},
		/**
		 * 只读
		 */
		readonly: function(jq, readonly) {
			return jq.each(function() {
				let opts = $(this).checkbox('options');
				setReadonly(opts.checkbox, readonly);
				opts.readonly = readonly;
			});
		},
		/**
		 * 重置复选框值
		 */
		reset: function(jq) {
			return jq.each(function() {
				let opts = $(this).checkbox('options');
				let value = opts.value;
				reset(opts.checkbox);
				if (value) {
					setValue(opts.checkbox, value, $(this));
				}
			});
		},
		/**
		 * 获取值
		 */
		getValue: function(jq) {
			let opts = jq.checkbox('options');
			return getValue(opts.checkbox);
		},
		/**
		 * 设置值
		 */
		setValue: function(jq, value) {
			return jq.each(function() {
				let opts = $(this).checkbox('options');
				setValue(opts.checkbox, value, $(this));
			});
		},
		/**
		 * 获取文本
		 */
		getText: function(jq) {
			let opts = jq.checkbox('options');
			let value = opts.checkbox.find('.radiobox-value').attr('text');
			return value ? value : null;
		},
		/**
		 * 全选
		 */
		checkAll: function(jq) {
			return jq.each(function() {
				let opts = $(this).checkbox('options');
				let el = opts.checkbox;
				let value = null; // 组件值
				let text = null; // 组件文字
				el.find('[class*="checkbox-inner"]').each(function() {
					if ($(this).attr('check') == 'false') {
						$(this).attr('check', 'true');
						$(this).find('.check').css('display', 'block');
						$(this).find('.uncheck').css('display', 'none');
					}
					let dataValue = $(this).attr('data-value');
					let dataText = $(this).attr('data-text');
					if (value) {
						value += opts.separator + dataValue;
						text += opts.separator + dataText;
					} else {
						value = dataValue;
						text = dataText;
					}
				});
				el.find('.checkbox-value').attr('value', value);
				el.find('.checkbox-value').attr('text', text);
			});
		},
		/**
		 * 全不选
		 */
		uncheckAll: function(jq) {
			return jq.each(function() {
				let opts = $(this).checkbox('options');
				let el = opts.checkbox;
				el.find('[class*="checkbox-inner"]').each(function() {
					if ($(this).attr('check') == 'true') {
						$(this).attr('check', 'false');
						$(this).find('.check').css('display', 'none');
						$(this).find('.uncheck').css('display', 'block');
					}
				});
				el.find('.checkbox-value').attr('value', null);
				el.find('.checkbox-value').attr('text', null);
			});
		},
		/**
		 * 反选
		 */
		checkReverse: function(jq) {
			return jq.each(function() {
				let opts = $(this).checkbox('options');
				let el = opts.checkbox;
				let value = null; // 组件值
				let text = null; // 组件文字
				el.find('[class*="checkbox-inner"]').each(function() {
					if ($(this).attr('check') == 'false') {
						$(this).attr('check', 'true');
						$(this).find('.check').css('display', 'block');
						$(this).find('.uncheck').css('display', 'none');
						var dataValue = $(this).attr('data-value');
						var dataText = $(this).attr('data-text');
						if (value) {
							value += opts.separator + dataValue;
							text += opts.separator + dataText;
						} else {
							value = dataValue;
							text = dataText;
						}
					} else {
						$(this).attr('check', 'false');
						$(this).find('.check').css('display', 'none');
						$(this).find('.uncheck').css('display', 'block');
					}
				});
				el.find('.checkbox-value').attr('value', value);
				el.find('.checkbox-value').attr('text', text);
			});
		}
	};
	
	$.fn.checkbox.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
           'width', 'hieght', 'cols', 'labelAlign', 'separator', 'value', {disabled:'boolean',readonly:'boolean'}
        ]), {
			dataProvider: (t.attr('dataProvider') ? eval(t.attr('dataProvider')) : undefined)
		});
	};
	
	$.fn.checkbox.defaults = {
		width: 'auto',
		height: 'auto',
		cols: 'auto',
		disabled: false,
		readonly: false,
		labelAlign: 'left',
		textField: 'text',
		valueField: 'value',
		separator: ',',
		dataProvider: [],
		value: null,
		onChange: function(value, oldValue){}
	};
})(jQuery);