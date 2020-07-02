/**
 * 划词框组件
 */
(function($) {
	let INDEX = 0;
	/**
	 * 初始化组件
	 */
	function init(target) {
		$(target).addClass('rangebox-f').hide();
		let span = $('<span class="textbox rangebox">'
						+ '<div class="textbox-text rangebox-text" tabindex="-1"></div>'
						+ '<input type=\"hidden\" class=\"rangebox-value\">'
						+ '<div class="rangebox-mask"></div>'
					+ '</span>').insertAfter(target);
		let name = $(target).attr("name");
		if (name) {
			span.find("input.rangebox-value").attr("name", name);
			$(target).removeAttr("name").attr("rangeboxName", name);
		}
		return span;
	}
	/**
	 * 渲染划词框
	 */
	function renderRangebox(target) {
		let options = $.data(target, "rangebox");
		let opts = options.options;
		let rb = options.rangebox;
		let rbId = '_socui_rangebox_input' + (++INDEX);
		let textarea = rb.find('.textbox-text');
		textarea.attr({id: rbId, contenteditable: opts.editable});
		if (opts.value) {
			textarea.text(opts.value);
		}
		setReadonly(target, opts.readonly);
		setDisabled(target, opts.disabled);
	}
	/**
	 * 组件渲染禁用
	 */
	function setDisabled(target, mode) {
		let options = $.data(target, "rangebox");
		let opts = options.options;
		let rb = options.rangebox;
		opts.disabled = mode;
		if (opts.disabled) {
			rb.addClass('rangebox-disabled');
			rb.removeClass('textbox-focused');
		} else {
			rb.removeClass('rangebox-disabled');
		}
	}
	/**
	 * 组件渲染只读
	 */
	function setReadonly(target, mode) {
		let options = $.data(target, 'rangebox');
		let opts = options.options;
		let rb = options.rangebox;
		opts.readonly = mode;
		if (opts.readonly) {
			rb.addClass('rangebox-readonly');
			rb.find('div[class*="rangebox-text"]').attr('contenteditable', false);
		} else {
			rb.removeClass('rangebox-readonly');
			rb.find('div[class*="rangebox-text"]').attr('contenteditable', opts.editable);
		}
	}
	/**
	 * 组件渲染是否可写
	 */
	function setEditable(target, mode) {
		let options = $.data(target, 'rangebox');
		let opts = options.options;
		let rb = options.rangebox;
		opts.editable = mode;
		rb.find('div[class*="rangebox-text"]').attr('contenteditable', opts.editable);
	}
	/**
	 * 组件设置尺寸
	 */
	function doResize(target, param) {
		let options = $.data(target, 'rangebox');
		let opts = options.options;
		let rb = options.rangebox;
		let parentEl = rb.parent();
		if (param) {
			if (typeof param == 'object') {
				$.extend(opts, param);
			} else {
				opts.width = param;
			}
		}
		if (isNaN(parseInt(opts.width))) {
			let c = $(target).clone();
			c.css('visibility', 'hidden');
			c.insertAfter(target);
			opts.width = c.outerWidth();
			c.remove();
		}
		let visible = rb.is(':visible');
		if (!visible) {
			rb.appendTo('body');
		}
		let txt = rb.find('.rangebox-text');
		rb._size(opts, parentEl);
		let rb_width = rb.width();
		let rb_height = opts.height == 'auto' ? txt.outerHeight() : rb.height();
		txt._outerWidth(rb_width);
		txt._outerHeight(rb_height);
	}
	/**
	 * 绑定组件触发事件
	 */
	function bindEvent(target) {
		let options = $.data(target, 'rangebox');
		let opts = options.options;
		let rb = options.rangebox;
		let txt = rb.find('.rangebox-text');
		txt.unbind('.rangebox');
		if (!opts.disabled && !opts.readonly) {
			txt.bind('mouseup.rangebox', function() {
				let sel = window.getSelection();
				if (sel.anchorNode == null) {
					return;
				}
				let range = sel.getRangeAt(0);
				let text = sel.toString();
				if (text) {
					range.deleteContents();
					let node = range.createContextualFragment(text);
					range.insertNode(node);
					window.getSelection().removeAllRanges();
					// 框选划词
					setRange(target, text);
					// 移除空的划词标签
					$(this).find('span[class="rangebox-label"]').each(function() {
						if (!$(this).text()) {
							$(this).remove();
						}
					});
				}
			});
		}
		txt.bind('focus.rangebox', function() {
			if (!$(this).parent().hasClass('textbox-focused')) {
				$(this).parent().addClass('textbox-focused');
			}
		}).bind('blur.rangebox', function() {
			$(this).parent().removeClass('textbox-focused');
		}).bind('keyup.rangebox', function(e) {
			if (e.keyCode == 8) {// backspace键
				$(this).find('span[class="rangebox-label"]').each(function() {
					let btn = $(this).find('a[class="rangebox-remove"]');
					if (btn[0] == undefined) {
						let index = $(this).attr('index');
						btn = $('<a href="javascript:;" class="rangebox-remove"></a>').attr({index: index});
						btn.appendTo($(this));
						$.data(btn[0], 'rangevalue', {index: index, value: $(this).text()});
						btn.bind('click', function() {
							if (opts.disabled || opts.readonly) {
								return;
							}
							let index_ = $(this).attr('index');
							let range = null;
							rb.find('span[class="rangebox-label"][index="' + index_ + '"]').each(function() {
								let t = $(this);
								let btn_ = t.find('a[class="rangebox-remove"][index="' + index_ + '"]');
								if (!range) {
									range = $.data(btn_[0], 'rangevalue');
								}
								btn_.remove();
								t.replaceWith(t.html());
							});
							
							opts.onClose.call(this, range);
						});
					}
				});
			} else if (e.keyCode == 46) {// del键
				$(this).find('span[class="rangebox-label"]').each(function() {
					let btn = $(this).find('a[class="rangebox-remove"]');
					if (btn[0] != undefined) {
						let range = $.data(btn[0], 'rangevalue');
						let txt = $(this).text();
						if (txt != range.value) {
							let index = opts.tagIndex;
							$(this).attr('index', index);
							btn.attr('index', index);
							range.index = index;
							range.value = txt;
							$.data(btn[0], 'rangevalue', range);
							opts.tagIndex = ++index;
						}
					}
				});
			}
			opts.onKeyup.call(this, e);
		});
	}
	/**
	 * 设置划词标签
	 */
	function setRange(target, txt) {
		let options = $.data(target, 'rangebox');
		let opts = options.options;
		let rb = options.rangebox;
		let content = rb.find('div[class*="rangebox-text"]').html();
		let index = opts.tagIndex;
		let tag = $('<span class="rangebox-label rangebox-create"></span>').text(txt).attr({index:index});
		
		let regex = new RegExp(txt, 'g');
		let match = content.match(regex) || [];
		content = content.replace(regex, tag[0].outerHTML);
		rb.find('div[class*="rangebox-text"]').html(content);
		
		rb.find('span[class="rangebox-label rangebox-create"]').each(function() {
			let t = $(this).removeClass('rangebox-create');
			let btn = $('<a href="javascript:;" class="rangebox-remove"></a>').attr({index: index});
			btn.appendTo(t);
			$.data(btn[0], 'rangevalue', {index: index, value: txt});
			
			if ($(this).parent().hasClass('rangebox-label')) {
				let parent = $(this).parent();
				let _index = parent.attr('index');
				parent.find('a[class="rangebox-remove"][index="' + _index + '"]').remove();
				parent.replaceWith(parent.html());
			}
		});
		
		rb.find('a[class="rangebox-remove"]').each(function() {
			let btn = $(this);
			btn.unbind('click').bind('click', function() {
				if (opts.disabled || opts.readonly) {
					return;
				}
				let index = $(this).attr('index');
				let range = null;
				rb.find('span[class="rangebox-label"][index="' + index + '"]').each(function() {
					let t = $(this);
					let btn_ = t.find('a[class="rangebox-remove"][index="' + index + '"]');
					if (!range) {
						range = $.data(btn_[0], 'rangevalue');
					}
					btn_.remove();
					t.replaceWith(t.html());
				});
				
				opts.onClose.call(this, range);
			});
		});
		
		let range = {index: index, value: txt};
		opts.onRange.call(this, range);
		
		if (match.length > 0) {
			opts.tagIndex = ++index;
		}
	}
	
	$.fn.rangebox = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.rangebox.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'rangebox');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'rangebox', {
					options: $.extend({}, $.fn.rangebox.defaults, $.fn.rangebox.parseOptions(this), options),
					rangebox: init(this)
				});
			}
			renderRangebox(this);
			doResize(this);
			bindEvent(this);
		});
	};
	
	$.fn.rangebox.methods = {
		options: function(jq) {
			return $.data(jq[0], 'rangebox').options;
		},
		initValue: function(jq, value) {
			return jq.each(function() {
				let opts = $.data(this, 'rangebox');
				$(this).rangebox('setText', value);
				opts.rangebox.find('.rangebox-value').val(value);
				$(this).val(value);
				opts.value = value;
			});
		},
		setText: function(jq, value) {
			return jq.each(function() {
				let opts = $.data(this, 'rangebox');
				let txt = opts.rangebox.find('.rangebox-text');
				value = value == undefined ? '' : String(value);
				txt.text(value);
			});
		},
		getText: function(jq) {
			let opts = $.data(jq[0], 'rangebox');
			let txt = opts.rangebox.find('.rangebox-text');
			return txt.val();
		},
		disable: function(jq) {
			return jq.each(function() {
				setDisabled(this, true);
				bindEvent(this);
			});
		},
		enable: function(jq) {
			return jq.each(function() {
				setDisabled(this, false);
				bindEvent(this);
			});
		},
		readonly: function(jq, mode) {
			return jq.each(function() {
				mode = mode || true;
				setReadonly(this, mode);
				bindEvent(this);
			});
		},
		editable: function(jq, mode) {
			return jq.each(function() {
				mode = mode || true;
				setEditable(this, mode);
			});
		},
		resize: function(jq, param) {
			return jq.each(function() {
				doResize(this, param);
			});
		},
		getRanges: function(jq, index) {
			let opts = $.data(jq[0], 'rangebox');
			let rb = opts.rangebox;
			if (index != undefined) {
				if (rb.find('span[class="rangebox-label"]').length >= index) {
					let t = rb.find('span[class="rangebox-label"]').eq(--index).find('a[class="rangebox-remove"]');
					let range = $.data(t[0], 'rangevalue');
					return range;
				}
				return null;
			} else {
				let ranges = [];
				let map = new HashMap();
				rb.find('span[class="rangebox-label"]').each(function() {
					let t = $(this).find('a[class="rangebox-remove"]');
					let range = $.data(t[0], 'rangevalue');
					if (!map.containsKey(range.index)) {
						ranges.push(range);
					}
					map.put(range.index, range.value);
				});
				return ranges;
			}
		},
		setRanges: function(jq, txt) {
			return jq.each(function() {
				if (typeof txt == 'string') {
					setRange(this, txt);
				} else if (typeof txt == 'object') {
					for (var i=0; i<txt.length; i++) {
						setRange(this, txt[i]);
					}
				}
			});
		}
	};
	
	$.fn.rangebox.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, ['width','height','value',{disabled:'boolean',readonly:'boolean',editable:'boolean'}]));
	};
	
	$.fn.rangebox.defaults = {
		width: 'auto',
		height: 'auto',
		value: '',
		tagIndex: 0,
		disabled: false,
		readonly: false,
		editable: true,
		onRange: function(range) {},
		onClose: function(range) {},
		onKeyup: function(event) {}
	};
})(jQuery);