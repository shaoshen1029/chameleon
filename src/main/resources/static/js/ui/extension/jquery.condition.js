/**
 * 筛选条件组件
 * @description
 * 筛选条件JSON结构说明:<br>
 * 筛选条件为数组结构：[{id:'userId',name:'userId',value:'admin',text:'超级管理员',label:'用户名',isDisplay:true},{},...]<br>
 * 属性说明:<br>
 * ● id: [string]筛选条件数据获取组件对应的ID
 * ● name: [string]筛选条件数据获取组件对应的NAME
 * ● value: [string]筛选条件真实值,即传递给服务端的参数值
 * ● text: [string]筛选条件显示值,即在客户端组件中显示的筛选条件内容
 * ● label: [string]筛选条件名称,即在客户端组件中显示的筛选条件名称
 * ● isDisplay: [boolean]是否在筛选条件组件中显示内容,该属性仅控制组件中筛选条件的显示/隐藏,不会影响传递给服务端的数据结构。true-显示;false-隐藏。
 */
(function($) {
	/**
	 * 初始化组件
	 */
	function init(target) {
		let state = $.data(target, 'condition');
		let opts = state.options;
		// 筛选条件框样式
		$(target).addClass('condition-component').css('width', width);
		$(target).css('display', opts.show == true ? 'block':'none');
		
		let el = $('<div class="condition-title"></div>' +
				   '<div class="condition-scroller-left soc-icon-font soc-icon-scroller-left"></div>' +
				   '<div class="condition-panel">' +
				       '<div class="condition-panel-wrap">' +
				           '<div class="condition-panel-inner"></div>' +
				       '</div>' +
				   '</div>' +
				   '<div class="condition-bt soc-icon-font soc-icon-repeat"></div>' +
				   '<div class="condition-scroller-right soc-icon-font soc-icon-scroller-right"></div>');
		$(target).append(el);
		// 声明对象
		let titleEl = $(target).find('.condition-title').html(opts.titleText + ':');
		let panelEl = $(target).find('.condition-panel');
		let leftEl = $(target).find('.condition-scroller-left').css('display', 'none');
		let rightEl = $(target).find('.condition-scroller-right').css('display', 'none');
		let btEl = $(target).find('.condition-bt').attr('title', opts.buttonText);
		// 绑定操作函数
		leftEl.bind('click', function() {
			$(target).condition('scroll', -opts.scrollIncrement);
		});
		rightEl.bind('click', function() {
			$(target).condition('scroll', opts.scrollIncrement);
		});
		btEl.bind('click', function() {
			doClean($(target));
		});
		// 组件宽度
		var width = $(target).parent().width() - 15;
		var titleWidth = titleEl.outerWidth();
		var btWidth = btEl.outerWidth();
		var leftWidth = leftEl.outerWidth();
		var rightWidth = rightEl.outerWidth();
		var panelWidth = width - titleWidth - btWidth - leftWidth - rightWidth;
		panelEl.css('width', panelWidth);
	}
	/**
	 * 渲染筛选条件
	 */
	function renderLabel(target, value) {
		let innerEl = $(target).find('.condition-panel-inner');
		innerEl.empty();
		for(let data of value) {
			if (data.value != "" || data.text != "") {
				let el = $('<span class="condition-label">' +
						       '<div>' + data.label + ': </div>' +
						       '<div title="' + data.text + '">' + data.text + '</div>' +
						       '<div class="condition-label-remove soc-icon-font soc-icon-close" data-id="' + data.id + '"></div>' +
						   '</span>');
				innerEl.append(el);
				
				let textEl = el.find('div[title]');
				textEl.tooltip({
					position: 'bottom',
					content: data.text,
					deltaY: -5
				});
				
				let btEl = el.find('.condition-label-remove');
				btEl.bind('click', function() {
					closeLabel($(target), $(this));
				});
			}
		}
		// 渲染面板样式
		renderPanel($(target));
	}
	/**
	 * 渲染面板样式
	 */
	function renderPanel(el) {
		let labelWidth = 0;
		let panelWidth = el.find('.condition-panel').width();
		el.find('.condition-label').each(function() {
			labelWidth += $(this).outerWidth(true);
		});
		if (panelWidth < labelWidth) {
			el.find('.condition-scroller-left').css('display', 'block');
			el.find('.condition-scroller-right').css('display', 'block');
		} else {
			el.find('.condition-scroller-left').css('display', 'none');
			el.find('.condition-scroller-right').css('display', 'none');
		}
	}
	/**
	 * 重置
	 */
	function doClean(el) {
		el.css('display', 'none');
		// 触发页面布局函数
		$(window).resize();
		// 清空筛选条件
		el.condition('setValue', []);
		let opts = el.condition('options');
		// 刷新列表
		doRefresh(el, opts, false);
		// 调用清空函数
		opts.onClean.call(el);
	}
	/**
	 * 刷新列表
	 * @param el
	 * 		筛选条件组件对象
	 * @param options
	 * 		筛选条件组件参数
	 * @param type
	 * 		刷新类型 true-保留页数刷新;false-刷新到第一页
	 */
	function doRefresh(el, options, type) {
		let grid = options.grid;
		// 分页组件
		let pager = $('#' + grid).datagrid('getPager');
		let pageNum = 0, pageSize = 0;
		if (pager && pager.length > 0) {
			let pagerOpts = pager.data("pagination").options;
			pageNum = type === true ? pagerOpts.pageNumber : 1;
			pageSize = pagerOpts.pageSize;
			// 刷新分页栏
			pager.pagination('refresh', {pageNumber:pageNum});
		}
		options.onRefresh.call(el, pageNum, pageSize);
	}
	/**
	 * 关闭标签
	 */
	function closeLabel(el, label) {
		let dataId = label.attr('data-id');
		let value = el.condition('getValue');
		for (let data of value) {
			if (dataId == data.id) {
				value.splice($.inArray(data, value), 1);
				break;
			}
		}
		// 移除被关闭的标签
		label.parent().remove();
		if (el.find('.condition-label').length == 0) {
			// 删除全部筛选条件后,关闭组件
			el.condition('hide');
		}
		// 刷新列表
		doRefresh(el, el.condition('options'), false);
		// 渲染面板样式
		renderPanel(el);
	}
	/**
	 * 校验查询组件条件合法性
	 */
	function checkData(data) {
		let check = false;
		if (typeof data == 'object' && !isNaN(data.length)) {
			for (let d of data) {
				if (d.value && d.value.trim().length > 0) {
					check = true;
					break;
				}
			}
		} else if (typeof data == 'object' && isNaN(data.length)) {
			if (data.value && data.value.trim().length > 0) {
				check = true;
			}
		}
		return check;
	}
	
	$.fn.condition = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.condition.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'condition');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'condition', {
					options: $.extend({}, $.fn.condition.defaults, $.fn.condition.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn.condition.methods = {
		// 获取参数
		options: function(jq) {
			return $.data(jq[0], 'condition').options;
		},
		// 设置筛选条件
		setValue: function(jq, data) {
			return jq.each(function() {
				let refresh = checkData(data);
				let opts = $(this).condition('options');
				$.data(this, 'condition', {
					options: $.extend({}, opts, {value: data, refresh: refresh})
				});
			});
		},
		// 获取筛选条件
		getValue: function(jq) {
			return $.data(jq[0], 'condition').options.value;
		},
		// 获取筛选条件JSON结构
		getJson: function(jq, page) {
			let value = $.data(jq[0], 'condition').options.value;
			let map = new HashMap();
			for (let data of value) {
				if (data.value && data.value.length > 0) {
					map.put(data.id, data.value);
				}
			}
			let json = map.json();
			if (page && page[0]) {
				json.pageNum = page[0];
			}
			if (page && page[1]) {
				json.pageSize = page[1];
			}
			return json;
		},
		// 显示组件
		show: function(jq) {
			return jq.each(function() {
				let opts = $.data(this, 'condition').options;
				let value = opts.value;
				if (value && value.length > 0) {
					renderLabel($(this), value);
					let labelEl = $(this).find('.condition-label');
					// 具有具有显示的查询条件时才显示组件
					if (labelEl && labelEl.length > 0) {
						$(this).css('display', 'block');
						// 触发页面布局函数
						$(window).resize();
						// 调用显示函数
						opts.onShow.call($(this));
					} else {
						$(this).css('display', 'none');
						// 触发页面布局函数
						$(window).resize();
						// 调用隐藏函数
						opts.onHide.call($(this));
					}
					// 具有真实的查询条件时调用刷新函数
					if (opts.refresh === true) {
						doRefresh($(this), opts, false);
					}
				}
			});
		},
		// 隐藏组件
		hide: function(jq) {
			return jq.each(function() {
				$(this).css('display', 'none');
				let opts = $.data(this, 'condition').options;
				// 触发页面布局函数
				$(window).resize();
				// 调用隐藏函数
				opts.onHide.call($(this));
			});
		},
		// 清空组件
		clean: function(jq) {
			return jq.each(function() {
				doClean($(this));
			});
		},
		// 筛选条件横向滚动
		scroll: function(jq, deltaX) {
			return jq.each(function() {
				let opts = $(this).condition('options');
				let wrapEl = $(this).find('.condition-panel-wrap');
				let pos = Math.min(wrapEl._scrollLeft() + deltaX, getMaxScrollWidth());
				wrapEl.animate({scrollLeft: pos}, opts.scrollDuration);
				
				function getMaxScrollWidth(){
					let w = 0;
					let innerEl = wrapEl.find('.condition-panel-inner')
					innerEl.children('span').each(function(){
						w += $(this).outerWidth(true);
					});
					return w - wrapEl.width() + (innerEl.outerWidth() - innerEl.width());
				}
			});
		},
		// 组件大小改变
		resize: function(jq) {
			return jq.each(function() {
				// 组件宽度
				let width = $(this).parent().width() - 15;
				let titleWidth = $(this).find('.condition-title').outerWidth();
				let scrollerLeftWidth = $(this).find('.condition-scroller-left').outerWidth();
				let scrollerRightWidth = $(this).find('.condition-scroller-right').outerWidth();
				let btWidth = $(this).find('.condition-bt').outerWidth();
				let panelWidth = width - titleWidth - btWidth - scrollerLeftWidth - scrollerRightWidth;
				$(this).css('width', width);
				$(this).find('.condition-panel').css('width', panelWidth);
				$(this).find('.condition-panel-wrap').css({'width':panelWidth});
				renderPanel($(this));
			});
		},
		// 刷新列表
		refresh: function(jq, type) {
			return jq.each(function() {
				let opts = $(this).condition('options');
				doRefresh($(this), opts, type);
			});
		}
	};
	
	$.fn.condition.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, ['grid',{show:'boolean', scrollIncrement:'number', scrollDuration:'number'}]));
	};
	
	$.fn.condition.defaults = {
		value: [], // 筛选条件数据结构
		grid: '', // 关联的Grid
		show: false, // 是否显示
		scrollIncrement: 100, // 滚动距离
		scrollDuration: 400, // 滚动动画时间
		titleText: '筛选条件',
		buttonText: '重置',
		onRefresh: function(pageNum, pageSize) {}, // 刷新回调函数
		onClean: function() {}, // 重置回调函数
		onShow: function() {}, // 显示回调函数
		onHide: function() {} // 隐藏回调函数
	};
})(jQuery);