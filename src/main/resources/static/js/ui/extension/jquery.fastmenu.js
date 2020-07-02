/**
 * 快捷菜单组件
 */
(function($) {
	/**
	 * 初始化组件
	 */
	function init(target) {
		$(target).addClass('fastmenu-panel');
		$(target).empty();
		let fastmenu = $('<div class="fastmenu-panel-header">' +
						 	'<div class="fastmenu-panel-title"></div>' +
						 	'<div class="fastmenu-panel-bt"></div>' +
						 '</div>' +
						 '<div class="fastmenu-panel-content">' +
						 	'<div class="inner"></div>' +
						 '</div>').appendTo(target);
		return $(target);
	}
	/**
	 * 创建组件UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createFastmenu(target) {
		let options = $.data(target, 'fastmenu');
		let opts = options.options;
		let fastmenu = options.fastmenu;
		
		if (opts.width != 'auto') {
			fastmenu.width(opts.width);
		}
		if (opts.height != 'auto') {
			fastmenu.height(opts.height);
		}
		
		renderHeader(target);
		renderContent(target);
	}
	/**
	 * 渲染头部
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function renderHeader(target) {
		let options = $.data(target, 'fastmenu');
		let opts = options.options;
		let fastmenu = options.fastmenu;
		fastmenu.find('.fastmenu-panel-title').text(opts.title);
		let bt = fastmenu.find('.fastmenu-panel-bt');
		let addBt = $('<div class="soc-icon-font soc-icon-add"></div>').attr('title', opts.addText).appendTo(bt);
		let editBt = $('<div class="soc-icon-font soc-icon-edit"></div>').attr({'title': opts.editText, 'edit': false}).appendTo(bt);
		let closeBt = $('<div class="soc-icon-font soc-icon-caret-down"></div>').attr('title', opts.closeText).appendTo(bt);
		// 绑定按钮点击事件
		addBt.bind('click', function() {
			fastmenu.find('.fastmenu-panel-content').removeClass('fastmenu-edit');
			$(this).siblings('.soc-icon-edit').attr('edit', false);
			
			opts.onAdd.call(target);
		});
		editBt.bind('click', target, function(e) {
			let t = $(this);
			if (t.attr('edit') == 'true') {
				fastmenu.find('.fastmenu-panel-content').removeClass('fastmenu-edit');
				t.attr('edit', false);
				bindDragEvent(target, false);
			} else {
				fastmenu.find('.fastmenu-panel-content').addClass('fastmenu-edit');
				t.attr('edit', true);
				bindDragEvent(target, true);
			}
		});
		closeBt.bind('click', function() {
			fastmenu.find('.fastmenu-panel-content').removeClass('fastmenu-edit');
			$(this).siblings('.soc-icon-edit').attr('edit', false);
			
			let height = fastmenu.outerHeight();
			fastmenu.animate({'bottom': -height}, opts.duration);
			
			opts.onCollapse.call(this);
		});
	}
	/**
	 * 渲染内容
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function renderContent(target) {
		let options = $.data(target, 'fastmenu');
		let opts = options.options;
		let fastmenu = options.fastmenu;
		let menus = opts.menus ? opts.menus : [];
		let inner = fastmenu.find('.fastmenu-panel-content .inner');
		inner.empty();
		
		for (let menu of menus) {
			let menuEl = renderFastmenu(target, menu);
			menuEl.appendTo(inner);
		}
		
		let inner_width = 0;
		inner.find('.warp').each(function() {
			inner_width += $(this).outerWidth();
		});
		inner.width(inner_width);
	}
	/**
	 * 渲染快捷菜单模块
	 * 
	 * @param target
	 * 			DOM对象
	 * @param menu
	 * 		快捷菜单参数
	 * @returns 快捷菜单模块对象
	 */
	function renderFastmenu(target, menu) {
		let opts = $.data(target, 'fastmenu').options;
		let menuEl = $('<div class="warp">' +
					       '<div class="fastmenu">' +
						       '<span class="icon soc-icon-font ' + menu.iconCls + '"></span>' +
						       '<span class="title">' + menu.name + '</span>' +
					       '</div>' +
					       '<div class="button soc-icon-font soc-icon-close" menu-name="' + menu.name + '"></div>' +
				       '</div>');
		$.data(menuEl[0], 'menu', menu);
		// 处理未授权快捷菜单
		if (menu.authority == '0' && menu.type == '0') {
			menuEl.find('.fastmenu').addClass('disabled');
		}
		// 快捷菜单区域函数
		menuEl.find('.fastmenu').bind('click', function() {
			if ($(this).siblings('.button').is(':hidden') == true && !$(this).hasClass('disabled')) {
				// 快捷菜单未处于编辑状态或未禁用状态可触发点击函数
				let data = $.data($(this).parent()[0], 'menu');
				let type = data.type;
				let location = data.location;
				if (type == 0) {
					$('.socui-navigation').navigation('forward', location);
				} else {
					window.open(location);
				}
			}
		});
		// 快捷菜单删除按钮点击函数
		menuEl.find('.button').bind('click', function() {
			let t = $(this).parent();
			let data = $.data(t[0], 'menu');
			t.animate({opacity: 0}, 150, function() {
				let width = $(this).outerWidth();
				let innerEl = $(this).parent();
				innerEl.width(innerEl.width() - width);
				$(this).remove();
				
				opts.onDelete.call(target, data);
			});
			
		});
		
		return menuEl;
	}
	/**
	 * 绑定拖拽函数
	 * 
	 * @param target
	 * 			DOM对象
	 * @param edit
	 * 			编辑状态
	 */
	function bindDragEvent(target, edit) {
		let options = $.data(target, 'fastmenu');
		let opts = options.options;
		let fastmenu = options.fastmenu;
		if (edit == true) {
			let range = { x: 0, y: 0 };// 鼠标元素偏移量
			let sourcePos = { x: 0, y: 0, x1: 0, y1: 0 };// 拖拽对象坐标系
			let targetPos = { x: 0, y: 0, x1: 0, y1: 0 };// 目标对象坐标系
			let move = false;// 拖拽状态
			let [sourceDom, sourceDomWidth, sourceDomHalf] = [null, 0, 0];// 拖拽对象, 拖拽对象宽度, 拖拽对象半宽度
			let [targetDom, targetDomFirst, targetDomFristX] = [null, null, 0];// 目标对象, 第一个目标对象, 第一个目标对象X坐标
			let tmpDom = null;// 临时对象
			
			fastmenu.find('.fastmenu').each(function() {
				$(this).bind('mousedown', function(e) {
					sourceDom = $(this).parent();
					// 鼠标元素相对偏移量
					let left = parseInt(sourceDom.offset().left);
					let top = parseInt(sourceDom.offset().top);
					range.x = e.pageX - left;
					range.y = e.pageY - top;
					
					sourceDomWidth = sourceDom.outerWidth();
					sourceDomHalf = sourceDomWidth / 2;
					move = true;
					
					sourceDom.addClass('source').css({left: left});
					// 创建并插入虚线占位框
					$('<div class="warp dash"></div>').css({width: sourceDom.width(), height: sourceDom.height()}).insertBefore(sourceDom);
				});
			});
			
			// 菜单区域
			fastmenu.find('.fastmenu-panel-content').bind('mousemove', function(e) {
				if (!move)
					return false;
				tmpDom = $(this).find('.dash');// 获取虚线占位框
				sourcePos.x = e.pageX - range.x;
				sourcePos.y = e.pageY - range.y;
				sourcePos.x1 = sourcePos.x + sourceDomWidth;
				sourceDom.css({left: sourcePos.x});
				let warp = $(this).find('.warp').not('.source').not('.dash');
				warp.each(function() {
					targetDom = $(this);
					targetPos.x = targetDom.offset().left;
					targetPos.y = targetDom.offset().top;
					targetPos.x1 = targetPos.x + targetDom.outerWidth() / 2;
					targetDomFirst = warp.eq(0);
					targetDomFristX = targetDomFirst.offset().left + sourceDomHalf;// 第一个目标对象对象的中心横坐标
					if (sourcePos.x <= targetDomFristX) {
						// 拖拽到第一个位置
						tmpDom.insertBefore(targetDomFirst); 
					}
					if (sourcePos.x >= targetPos.x - sourceDomHalf && sourcePos.x1 >= targetPos.x1) {
						// 拖拽到目标对象之后
						tmpDom.insertAfter(targetDom);
					}
				});
			}).bind('mouseup', function() {
				if (tmpDom) {
					sourceDom.insertBefore(tmpDom);// 拖拽对象插入到占位虚线框位置上
					sourceDom.removeClass('source');
					sourceDom.removeAttr('style');
					tmpDom.remove();
					move = false;
					let sort = [];
					$(this).find('.warp').each(function() {
						let menu = $.data(this, 'menu');
						sort.push(menu.id);
					});
					opts.onDrag.call(target, sort);
					// 拖拽结束后解绑并重新绑定拖拽函数,解决因为拖拽后点击删除图标错误的删除元素的问题
					bindDragEvent(target, false);
					bindDragEvent(target, true);
				}
				// 清理错误创建的虚线占位框
				$(this).find('.dash').remove();
				// 清理错误创建的拖拽对象
				$(this).find('.source').removeClass('source');
			});
		} else {
			fastmenu.find('.fastmenu').each(function() {
				$(this).unbind('mousedown');
			});
			fastmenu.find('.fastmenu-panel-content').unbind('mousemove').unbind('mouseup');
		}
	}
	
	$.fn.fastmenu = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.fastmenu.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'fastmenu');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'fastmenu', {
					options: $.extend({}, $.fn.fastmenu.defaults, $.fn.fastmenu.parseOptions(this), options),
					fastmenu: init(this)
				});
				createFastmenu(this);
			}
			renderContent(this);
		});
	};
	
	$.fn.fastmenu.methods = {
		options: function(jq) {
			return $.data(jq[0], 'fastmenu').options;
		},
		add: function(jq, menu) {
			return jq.each(function() {
				let options = $.data(this, 'fastmenu');
				let opts = options.options;
				let fastmenu = options.fastmenu;
				let inner = fastmenu.find('.fastmenu-panel-content .inner');
				
				let menuEl = renderFastmenu(this, menu);
				menuEl.appendTo(inner);
				
				let inner_width = 0;
				inner.find('.warp').each(function() {
					inner_width += $(this).outerWidth();
				});
				inner.width(inner_width);
			});
		},
		del: function(jq, index) {
			return jq.each(function() {
				let options = $.data(this, 'fastmenu');
				let opts = options.options;
				let fastmenu = options.fastmenu;
				let button = fastmenu.find('.button');
				if (index < button.length) {
					button.eq(index).trigger('click');
				}
			});
		},
		collapse: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'fastmenu');
				let opts = options.options;
				let fastmenu = options.fastmenu;
				
				fastmenu.find('.fastmenu-panel-content').removeClass('fastmenu-edit');
				$(this).siblings('.soc-icon-edit').attr('edit', false);
				
				fastmenu.animate({'bottom': -fastmenu.outerHeight()}, opts.duration);
				
				opts.onCollapse.call(this);
			});
		},
		expand: function(jq) {
			return jq.each(function() {
				let options = $.data(this, 'fastmenu');
				let opts = options.options;
				let fastmenu = options.fastmenu;
				fastmenu.css({'bottom': -fastmenu.outerHeight()});
				fastmenu.animate({'bottom': 0}, opts.duration);
				
				opts.onExpand.call(this);
			});
		}
	};
	
	$.fn.fastmenu.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, ['width','height','title','addText','editText','closeText',{duration:'number'}]));
	};
	
	$.fn.fastmenu.defaults = {
		width: 'auto',
		height: 'auto',
		title: '',
		addText: 'Add',
		editText: 'Edit',
		closeText: 'Close',
		duration: 300,
		menus: [],
		onAdd: function() {},
		onDelete: function(menu) {},
		onDrag: function(sort) {},
		onCollapse: function() {},
		onExpand: function() {}
	};
})(jQuery);