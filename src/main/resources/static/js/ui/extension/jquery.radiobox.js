/**
 * 单选组件
 */
(function($) {
	function init(target) {
		let state = $.data(target, 'radiobox');
		let opts = state.options;
		let t = $(target);
		t.addClass('radiobox-f').hide();
		let name = t.attr('name') || t.attr('radioboxName');
		if (name){
			t.removeAttr('name').attr('radioboxName', name);
		}
		opts.name = name;
		
		let dataProvider = opts.dataProvider || [];
		if (dataProvider.length == 0) {
			$('label[name="' + name + '"]').each(function() {
				let _opts = $.extend({}, {
					text: $.trim($(this).html()),
					value: $(this).attr('value')
				});
				dataProvider.push(_opts);
				$(this).remove();
			});
			$.data(target, 'radiobox').options = $.extend({}, opts, {dataProvider: dataProvider});
		} else {
			$('label[name="' + name + '"]').remove();
		}
		let radiobox = renderRadiobox(t, opts);
		$.data(target, 'radiobox').options = $.extend({}, opts, {radiobox: radiobox});
		if (opts.width) {
			setWidth(radiobox, opts.width);
		}
		if (opts.height) {
			setHeight(radiobox, opts.height);
		}
		if (opts.readonly) {
			setReadonly(radiobox, opts.readonly);
		}
		if (opts.disabled) {
			setDisabled(radiobox, opts.disabled);
		}
		if (opts.value) {
			setValue(radiobox, opts.value);
		}
		radiobox.insertAfter(target);
		let maxLabelWidth = 0; // 最大标签文字宽度
		radiobox.find('.radiobox-label').each(function() {
			if (maxLabelWidth < $(this).width()) {
				maxLabelWidth = $(this).width();
			}
		});
		radiobox.find('.radiobox-label').each(function() {
			$(this).width(maxLabelWidth);
		});
	}
	/**
	 * 渲染单选框
	 */
	function renderRadiobox(target, opts) {
		if (opts.radiobox) {
			opts.radiobox.remove();
		}
		let radioboxEl = $('<span class="radiobox" name="' + opts.name + '"></span>');
		let dataProvider = opts.dataProvider;
		if (dataProvider != undefined && dataProvider.length > 0) {
			for (let i=0; i<dataProvider.length; i++) {
				let data = dataProvider[i];
				let inner = '';
				if (opts.labelAlign == 'right') {
					inner = '' +
					'<span class="radiobox-inner" data-value="' + data[opts.valueField] + '" data-text="' + data[opts.textField] + '">' +
						'<span class="radiobox-label" style="text-align:right;">' + data[opts.textField] + '</span>' +
						'<span class="radiobox-button check" style="display:none;"></span>' +
						'<span class="radiobox-button uncheck" style="display:block;"></span>' +
					'</span>';
				} else {
					inner = '' +
					'<span class="radiobox-inner" data-value="' + data[opts.valueField] + '" data-text="' + data[opts.textField] + '">' +
						'<span class="radiobox-button check" style="display:none;"></span>' +
						'<span class="radiobox-button uncheck" style="display:block;"></span>' +
						'<span class="radiobox-label">' + data[opts.textField] + '</span>' +
					'</span>';
				}
				let innerEl = $(inner);
				if (opts.cols != 'auto' && i % parseInt(opts.cols) == 0) {
					innerEl.addClass('rodiobox-clear');
				}
				// 绑定点击函数
				innerEl.bind('click.radiobox', function() {
					if (opts.disabled === false && opts.readonly === false) {
						let oldValue = getValue(radioboxEl);
						let value = $(this).attr('data-value');
						setValue(radioboxEl, value);
						if (oldValue != value) {
							opts.onChange.call(target, value, oldValue);
						}
					}
				});
				radioboxEl.append(innerEl);
			}
		}
		let valueEl = $('<input class="radiobox-value" type="hidden" name="' + opts.name + '" value="' + (opts.value || '') + '"></input>');
		radioboxEl.append(valueEl);
		return radioboxEl;
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
			el.find('.radiobox-inner').each(function() {
				$(this).addClass('radiobox-readonly');
			});
		} else {
			el.find('.radiobox-inner').each(function() {
				$(this).removeClass('radiobox-readonly');
			});
		}
	}
	/**
	 * 设置禁用
	 */
	function setDisabled(el, disabled) {
		if (disabled === true) {
			el.find('.radiobox-inner').each(function() {
				$(this).addClass('radiobox-disabled');
			});
		} else {
			el.find('.radiobox-inner').each(function() {
				$(this).removeClass('radiobox-disabled');
			});
		}
	}
	/**
	 * 获取值
	 */
	function getValue(el) {
		let value = el.find('.radiobox-value').attr('value');
		return value ? value : null;
	}
	/**
	 * 设置值
	 */
	function setValue(el, value) {
		el.find('.radiobox-value').attr('value', value);
		el.find('.radiobox-inner').each(function() {
			let dataValue = $(this).attr('data-value');
			if (dataValue == value) {
				$(this).find('.check').css('display', 'block');
				$(this).find('.uncheck').css('display', 'none');
				el.find('.radiobox-value').attr('text', $(this).attr('data-text'));
			} else {
				$(this).find('.check').css('display', 'none');
				$(this).find('.uncheck').css('display', 'block');
			}
		});
	}
	/**
	 * 重置组件
	 */
	function reset(el) {
		el.find('.radiobox-inner').each(function() {
			$(this).find('.check').css('display', 'none');
			$(this).find('.uncheck').css('display', 'block');
		});
		el.find('.radiobox-value').attr('value', null);
		el.find('.radiobox-value').attr('text', null);
	}
	
	$.fn.radiobox = function(options, param){
		if (typeof options == 'string') {
			let method = $.fn.radiobox.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'radiobox');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'radiobox', {
					options: $.extend({}, $.fn.radiobox.defaults, $.fn.radiobox.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn.radiobox.methods = {
		/**
		 * 获取参数
		 */
		options: function(jq){
			return $.data(jq[0], 'radiobox').options;
		},
		/**
		 * 禁用
		 */
		disabled: function(jq, disabled) {
			return jq.each(function() {
				let opts = $(this).radiobox('options');
				setDisabled(opts.radiobox, disabled);
				opts.disabled = disabled;
			});
		},
		/**
		 * 只读
		 */
		readonly: function(jq, readonly) {
			return jq.each(function() {
				let opts = $(this).radiobox('options');
				setReadonly(opts.radiobox, readonly);
				opts.readonly = readonly;
			});
		},
		/**
		 * 重置单选框值
		 */
		reset: function(jq) {
			return jq.each(function() {
				let opts = $(this).radiobox('options');
				let value = opts.value;
				reset(opts.radiobox);
				if (value) {
					setValue(opts.radiobox, value);
				}
			});
		},
		/**
		 * 获取值
		 */
		getValue: function(jq) {
			let opts = jq.radiobox('options');
			return getValue(opts.radiobox);
		},
		/**
		 * 设置值
		 */
		setValue: function(jq, value) {
			return jq.each(function() {
				let opts = $(this).radiobox('options');
				setValue(opts.radiobox, value);
			});
		},
		/**
		 * 获取文本
		 */
		getText: function(jq) {
			let opts = jq.radiobox('options');
			let value = opts.radiobox.find('.radiobox-value').attr('text');
			return value ? value : null;
		}
	};
	
	$.fn.radiobox.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
           'width', 'hieght', 'cols', 'labelAlign', 'value', {disabled:'boolean',readonly:'boolean'}
        ]), {
			dataProvider: (t.attr('dataProvider') ? eval(t.attr('dataProvider')) : undefined)
		});
	};
	
	$.fn.radiobox.defaults = {
		width: 'auto',
		height: 'auto',
		cols: 'auto',
		disabled: false,
		readonly: false,
		labelAlign: 'left',
		textField: 'text',
		valueField: 'value',
		dataProvider: [],
		value: null,
		onChange: function(value, oldValue){}
	};
})(jQuery);