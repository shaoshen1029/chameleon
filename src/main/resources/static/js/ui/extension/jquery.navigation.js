/**
 * 导航菜单组件
 */
(function($) {
	/**
	 * 初始化函数
	 */
	function init(target) {
		let state = $.data(target, 'navigation');
		let opts = state.options;
		$(target).empty();
		$(target).addClass('menu-header');
		// 导航栏对象
		opts.navigationEl = $(target);
		
		// 渲染菜单面板容器
		let panelEL = $('<div>').addClass('menu-panel');
		// 渲染系统徽章
		renderBadge(panelEL, opts);
		// 菜单数据
		let hasMenuTree = opts.hasMenuTree;
		if (hasMenuTree && hasMenuTree.length > 0) {
			// 渲染左移按钮
			renderLeftBt(panelEL, opts);
			// 渲染菜单
			renderMenu(panelEL, hasMenuTree, opts);
		} else {
			// 渲染等待栏
			renderLoading(panelEL);
		}
		$(target).append(panelEL);
		// 渲染二级菜单容器盒模型
		renderMenuSub(target);
		// 渲染收缩按钮
		renderSildeBt(panelEL, target);
		if (hasMenuTree && hasMenuTree.length > 0) {
			// 渲染工具栏
			renderToolbar(panelEL, opts);
			// 渲染提示栏
			renderTipbar(panelEL, opts);
			// 渲染全局搜索工具
			renderSearch(panelEL, opts);
			// 渲染右移按钮
			renderRightBt(panelEL, opts);
			// 渲染位移按钮
			renderScrollBt(panelEL, opts);
		}
		// 绑定菜单事件
		bindMenuEvent($(target), panelEL, opts);
		
		if (opts.router) {
			// 监听浏览器路由hash事件,根据路由路径加载页面
			window.addEventListener('hashchange', function() {
				let mid = location.hash.slice(1) || null;
				if (mid) {
					// 移除弹窗
					$('.panel.window.panel-htop').remove();
					$('.window-shadow').remove();
					$('.window-mask').remove();
					$('.bh-bg.window-blur').removeClass('window-blur');
					// 页面跳转
					__forward($('span[menu-id="' + mid + '"]'));
				}
			} ,false);
		}
	}
	/**
	 * 渲染等待栏
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param msg
	 * 		导航菜单等待提示信息
	 */
	function renderLoading(el, msg) {
		msg = msg || $.fn.navigation.defaults.loading;
		let loadingEl = $('<div class="menu-loading">' +
						      '<i class="soc-icon-font soc-icon-refresh soc-spin"></i>' +
						      '<span style="padding-left: 10px;">' + msg + '</span>' +
						  '</div>');
		el.append(loadingEl);
	}
	/**
	 * 渲染系统徽章
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderBadge(el, opts) {
		let badgeEl = $('<div class="menu-badge icon-menu-badge"></div>');
		badgeEl.tooltip({
			position: 'bottom',
			content: opts.systemName,
			deltaY: -5
		});
		el.append(badgeEl);
		opts.badgeEl = badgeEl;
	}
	/**
	 * 渲染左移按钮
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderLeftBt(el, opts) {
		let btEl = $('<div class="menu-bt-scrollLeft soc-icon-scroller-left"></div>')
		btEl.css('display', 'none');
		el.append(btEl);
		opts.scrollLeft = btEl;
	}
	/**
	 * 渲染右移按钮
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderRightBt(el, opts) {
		let btEl = $('<div class="menu-bt-scrollRight soc-icon-scroller-right"></div>')
		btEl.css('display', 'none');
		el.append(btEl);
		opts.scrollRight = btEl;
	}
	/**
	 * 渲染位移按钮
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderScrollBt(el, opts) {
		let menuWidth = 0;
		let win_w = $(window).width();
		let badge_w = el.find('.menu-badge').outerWidth();
		let toolbar_w = el.find('.menu-toolbar').outerWidth();
		let tipbar_w = el.find('.menu-tipbar').outerWidth();
		let sildeup_w = el.find('.menu-bt-sildeup').outerWidth();
		let search_w = 0;
		if (!el.find('.menu-search').is(':hidden')) {
			search_w = el.find('.menu-search').outerWidth();
		}
		// 计算菜单栏宽度(消除徽章、全局搜索、通知栏、工具栏、关闭按钮的宽度)
		let wrapWidth = win_w - badge_w - search_w - toolbar_w - tipbar_w - sildeup_w;
		let menuEl = el.find('.menu-nav-panel-inner').find('span[menu-location][menu-id]');
		let length = menuEl.length;
		menuEl.each(function() {
			menuWidth += $(this).outerWidth(true);
		});
		menuWidth = menuWidth + 2 * (length - 1);
		if (wrapWidth < menuWidth) {
			el.find('.menu-nav-panel-wrap').width(wrapWidth - 21 * 2);
			opts.scrollLeft.css('display', 'block');
			opts.scrollRight.css('display', 'block');
		} else {
			el.find('.menu-nav-panel-wrap').width(wrapWidth);
			opts.scrollLeft.css('display', 'none');
			opts.scrollRight.css('display', 'none');
		}
	}
	/**
	 * 渲染提示栏
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderTipbar(el, opts) {
		// 提示栏主体
		let mainEl = $('<ul class="menu-tipbar menu-op-bar">' +
					       '<span class="icon-menu-bar"></span>' +
					       '<div class="menu-bar-sub"></div>' +
					   '</ul>');
		// 渲染提示栏内容
		if (opts.tips && opts.tips.length > 0) {
			let subEl = mainEl.find('.menu-bar-sub');
			let tipRefreshTotal = 0; // 提示框刷新内容总数
			const defaultTip = {name: '', iconCls: '', badge: true, refreshUrl: '', onClick: function() {}, onRefresh: function(data) {}};
			for (let i=0; i<opts.tips.length; i++) {
				let tip = $.extend({}, defaultTip, opts.tips[i]);
				let tipEl = $('<span id="menu_tip_' + i +'">' +
							     '<i class="' + tip.iconCls +'"></i>' +
							     '<i>' + tip.name+ '</i>' +
							     '<i class="menu-tipbar-badge"></i>' +
							 '</span>');
				if (tip.badge === true) {
					let badgeEl = tipEl.find('.menu-tipbar-badge');
					badgeEl.badge({number: 0, show: true, color: 'red'});
					tip.badgeEl = badgeEl;
					if (tip.refreshUrl) {
						tipRefreshTotal++;
					}
					tipEl.append(badgeEl);
				}
				subEl.append(tipEl);
				// 绑定数据信息
				$.data(tipEl[0], 'menuTip', tip);
				// 绑定点击事件
				tipEl.bind('click', function() {
					let tipOpts = $.data($(this)[0], 'menuTip');
					tipOpts.onClick.call($(this));
				});
				opts.tips[i] = tip;
			}
			// 执行提示栏刷新函数
			opts.tipRefreshTotal = tipRefreshTotal;
			doRefresh(opts);
			// 定时执行提示栏刷新函数
			let refreshTimer = setInterval(function() { doRefresh(opts); }, opts.tipRefreshTime);
			opts.refreshTimer = refreshTimer;
		}
		el.append(mainEl);
		opts.tipEl = mainEl;
	}
	/**
	 * 渲染工具栏
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderToolbar(el, opts) {
		// 工具栏主体
		let mainEl = $('<ul class="menu-toolbar menu-op-bar">' +
					       '<span class="icon-menu-bar"></span>' +
					       '<div class="menu-bar-sub"></div>' +
					   '</ul>');
		if (opts.tools && opts.tools.length > 0) {
			let subEl = mainEl.find('.menu-bar-sub');
			for (let i=0; i<opts.tools.length; i++) {
				let tool = opts.tools[i];
				let toolEl = $('<span id="menu_tool_' + i +'">' +
							       '<i class="' + tool.iconCls + '"></i>' +
							       '<i> ' + tool.name + '</i>' +
							   '</span>');
				if (tool.cls) {
					toolEl.addClass(tool.cls);
				}
				subEl.append(toolEl);
				// 绑定数据信息
				$.data(toolEl[0], 'menuTool', tool);
				// 绑定点击事件
				toolEl.bind('click', function() {
					let toolOpts = $.data($(this)[0], 'menuTool');
					toolOpts.onClick.call($(this));
				});
			}
			
			mainEl.append(subEl);
		}
		el.append(mainEl);
		opts.toolEl = mainEl;
	}
	/**
	 * 渲染全局搜索工具
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderSearch(el, opts) {
		if (opts.searchs && opts.searchs.length > 0) {
			// 全局搜索工具下拉内容
			let comboHtml = '';
			for (let search of opts.searchs) {
				comboHtml += '<div data-options="name:\'' + search.name + '\',iconCls:\'' + search.iconCls + '\'">' + search.label + '</div>';
			}
			// 全局搜索工具主体
			let mainEl = $('<ul class="menu-search">' +
						       '<input class="menu-searchbox" style="width:300px" />' +
						       '<div id="menu_search_combo" style="display: none;">' + comboHtml + '</div>' +
						   '</ul>');
			el.append(mainEl);
			// 实例化全局搜索工具
			let searchEl = mainEl.find('.menu-searchbox').searchbox({
				menu: '#menu_search_combo',
				searcher: opts.searchFn
			});
			opts.search = searchEl;
		}
	}
	/**
	 * 渲染收缩按钮
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param target
	 * 		导航菜单对象
	 */
	function renderSildeBt(el, target) {
		let btEl = $('<ul class="menu-bt-sildeup soc-icon-scroller-top-all"></ul>');
		btEl.bind('click', function() {
			doSildeUp($(target));
		});
		el.append(btEl);
	}
	/**
	 * 渲染菜单
	 * 
	 * @param el
	 * 		导航菜单面板对象
	 * @param hasMenuTree
	 * 		导航菜单树结构
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function renderMenu(el, hasMenuTree, opts) {
		if (!hasMenuTree || hasMenuTree.length == 0) {
			// 无菜单渲染等待栏
			renderLoading(el, opts.nothing);
		} else {
			let panelEl = $('<div class="menu-nav-panel">' +
							    '<div class="menu-nav-panel-wrap">' +
							    	'<div class="menu-nav-panel-inner"></div>' +
							    '</div>' +
							'</div>');
			let innerEl = panelEl.find('.menu-nav-panel-inner');
			let comboEl = $('<div class="menu-combo"></div>');
			for (let i=0; i<hasMenuTree.length; i++) {
				let menu = hasMenuTree[i];
				if (menu.parentId == opts.moudle) {
					if (i != 0) {
						innerEl.append($('<i></i>'));
					}
					// 菜单容器
					let menuEl = $('<span class="menu-nav">' +
								       '<i class="icon ' + menu.menuIcon +'"></i>' +
								       '<i class="name">' + menu.menuName + '</i>' +
								   '</span>');
					menuEl.attr({'menu-location':menu.menuLocation, 'menu-id':menu.menuId});
					menuEl.appendTo(innerEl);
					// 渲染二级菜单
					if (menu.children && menu.children.length > 0) {
						renderSecondMenu(comboEl, menu.children, menu.menuId, opts);
					}
					$.data(menuEl[0], 'menu', menu);
					$.data(menuEl[0], 'router', opts.router);
					menuEl.bind('click', function() {
						doClickFirstMenu($(this));
					});
				}
			}
			// 一级菜单
			el.append(panelEl);
			// 二级菜单
			el.append(comboEl);
		}
	}
	/**
	 * 渲染二级菜单
	 * 
	 * @param el
	 * 		菜单下拉面板对象
	 * @param hasMenuTree
	 * 		菜单树结构
	 * @param menuId
	 * 		点击一级菜单默认进入菜单ID
	 * @param opts
	 * 		导航菜单参数
	 */
	function renderSecondMenu(el, hasMenuTree, menuId, opts) {
		let subEl = $('<div class="menu-sub" menu-id="' + menuId + '"></div>').appendTo(el);
		let colNum = hasMenuTree.length;
		// 生成二级菜单列容器
		for (let i=0; i<colNum; i++) {
			$('<div class="cols"></div>').appendTo(subEl);
		}
		// 渲染二级菜单
		for (let i=0; i<colNum; i++) {
			let menu = hasMenuTree[i];
			let ulEl = $(`<div class="menu-sub-ul">
						      <div class="second-menu">
							      <span class="second-menu-href">
								      <i class="soc-icon-font ${menu.menuIcon}"></i>
								      <i>${menu.menuName}</i>
							      </span>
						      </div>
					      </div>`);
			let liEl = ulEl.find('.second-menu');
			let hrefEl = ulEl.find('.second-menu-href');
			if (menu.menuLocation && menu.menuLocation != '###') {
				hrefEl.attr({'menu-location':menu.menuLocation, 'menu-id':menu.menuId});
				liEl.attr({'menu-location':menu.menuLocation, 'menu-id':menu.menuId});
			}
			// 绑定菜单数据
			$.data(hrefEl[0], 'menu', menu);
			$.data(liEl[0], 'menu', menu);
			$.data(hrefEl[0], 'router', opts.router);
			liEl.bind('click', function()  {
				let menuOpts = $.data($(this)[0], 'menu');
				doForward($(this).find('span[menu-id="' + menuOpts.menuId + '"]'));
			});
			ulEl.append(liEl);
			// 渲染三级菜单
			if (menu.children && menu.children.length > 0) {
				renderThirdMenu(ulEl, menu.children, opts);
			}
			// 追加到对应的容器中
			subEl.find('div[class="cols"]:eq(' + i + ')').append(ulEl);
		}
	}
	/**
	 * 渲染三级菜单
	 * 
	 * @param el
	 * 		三级菜单对象
	 * @param hasMenuTree
	 * 		三级菜单数据集合
	 * @param opts
	 * 		导航菜单参数
	 */
	function renderThirdMenu(el, hasMenuTree, opts) {
		let rowNum = opts.rowNum, menuLength = hasMenuTree.length;
		let split = menuLength % rowNum == 0 ? menuLength / rowNum : menuLength / rowNum + 1;
		split = menuLength < rowNum ? 1 : split;
		for (let i=0; i<split; i++) {
			let ulEl = $('<div class="menu-sub-ul" style="float:left;"></div>');
			for (let j=0; j<rowNum; j++) {
				let menu = hasMenuTree[j + rowNum * i];
				if (menu) {
					let liEl = $('<div class="third-menu">' +
								     '<span class="third-menu-href">' +
									     '<i class="soc-icon-font ' + menu.menuIcon + '"></i>' +
									     '<i>' + menu.menuName + '</i>' +
								     '</span>' +
								 '</div>');
					let hrefEl = liEl.find('.third-menu-href');
					if (menu.menuLocation && menu.menuLocation != '###') {
						hrefEl.attr({'menu-location':menu.menuLocation, 'menu-id':menu.menuId});
						liEl.attr({'menu-location':menu.menuLocation, 'menu-id':menu.menuId});
					}
					// 绑定菜单数据
					$.data(hrefEl[0], 'menu', menu);
					$.data(liEl[0], 'menu', menu);
					$.data(hrefEl[0], 'router', opts.router);
					liEl.bind('click', function()  {
						let menuOpts = $.data($(this)[0], 'menu');
						doForward($(this).find('span[menu-id="' + menuOpts.menuId + '"]'));
					});
					ulEl.append(liEl);
				}
			}
			el.append(ulEl);
		}
	}
	/**
	 * 渲染二级菜单容器盒模型
	 * 
	 * @param target
	 * 		导航菜单对象
	 */
	function renderMenuSub(target) {
		$(target).find('.menu-sub').each(function() {
			$(this).width($(window).width() - ($(this).outerWidth() - $(this).width()));
		});
	}
	/**
	 * 渲染面包屑导航面板
	 * 
	 * @param mid
	 * 		菜单ID
	 */
	function renderNavPanel(mid) {
		let el = $('.socui-navigation');
		let opts = el.navigation('options');
		if (opts.navigation) {
			let panel = $('.menu-crumbs-panel');
			if (panel.length == 0) {
				panel = $('<div>').addClass('menu-crumbs-panel');
				el.append(panel);
			} else {
				panel.empty();
			}
			renderNavMenu(panel, mid, opts.hasMenu, null);
		}
	}
	/**
	 * 渲染面包屑导航内容
	 * 
	 * @param el
	 *            导航菜单面板对象
	 * @param menuId
	 *            菜单ID
	 * @param hasMenu
	 *            登录用户拥有的扁平化菜单集合
	 * @param navMenu
	 *            导航菜单目录
	 */
	function renderNavMenu(el, menuId, hasMenu, navMenu) {
		navMenu = null || navMenu;
		if (menuId == 'soc' || menuId == 'show' || menuId == 'sys') {
			// 追加到导航菜单栏中
			el.append(navMenu);
		} else {
			let menu = null;
			for (let i=0; i< hasMenu.length; i++) {
				if (menuId == hasMenu[i].menuId) {
					menu = hasMenu[i];
					break;
				}
			}
			if (navMenu) {
				navMenu = menu.menuName + '<i></i>' + navMenu;
			} else {
				navMenu = menu.menuName;
			}
			renderNavMenu(el, menu.parentId, hasMenu, navMenu);
		}
	}
	/**
	 * 渲染页面主体内容
	 * 
	 * @param url
	 * 		页面主体请求URL
	 */
	function renderContent(url) {
		$.ajax({
			url: $soc.basePath + url,
			dataType: 'html',
			loading: false,
			success :function(data) {
				// 计算正文内容布局
				_layout();
				// 移除进场动画
				$('#soc_content').removeClass('bh-content-fadeInUp');
				// 先隐藏页面主体,放置出现为渲染的组件
				$('#soc_content').css('visibility', 'hidden');
				// 加载页面内容
				$('#soc_content').html(data);
				// 加载正文内容组件
				$.parser.parse('#soc_content');
				// 组件渲染后显示页面主体
				$('#soc_content').css('visibility', 'visible');
				// 添加进场动画
				$("#soc_content").addClass('bh-content-fadeInUp').attr('data-menu', url);
				// 调用页面入口函数
				initContent();
				// 表单追加CSRF攻击安全防御令牌隐藏域
				$('form').each(function() {
					let csrfToken = $(this).find('input[name="' + COMMON_CONFIG.G_AJAX_CSRF_TOKEN + '"]');
					// 删除原安全令牌
					if (csrfToken && csrfToken.length > 0) {
						csrfToken.remove();
					}
					// 创建新安全令牌
					csrfToken = '<input type="hidden" name="' + COMMON_CONFIG.G_AJAX_CSRF_TOKEN + '" value="' + $soc.csrfToken + '" />';
					$(this).append(csrfToken);
				});
			}
		});
	}
	/**
	 * 绑定菜单事件
	 * 
	 * @param target
	 * 		导航菜单对象
	 * @param el
	 * 		导航菜单面板对象
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function bindMenuEvent(target, el, opts) {
		el.find('.menu-nav-panel-inner').find('span').each(function() {
			let token = $(this).attr('menu-id');
			let subEl = el.find('div[class="menu-sub"][menu-id="' + token + '"]');
			// 一级菜单鼠标事件
			$(this).mouseover(function() {
				subEl.css('display', 'table');
				if (!$(this).hasClass('menu-no')) {
					$(this).addClass('menu-no');
				}
			}).mouseout(function() {
				subEl.css('display', 'none');
				$(this).removeClass('menu-no');
			});
			// 菜单栏鼠标事件
			subEl.mouseover(function() {
				$(this).css('display', 'table');
			});
			subEl.mouseout(function() {
				$(this).css('display', 'none');
			});
		});
		el.find('.menu-sub').each(function() {
			let token = $(this).attr('menu-id');
			let navEl = el.find('span[class="menu-nav"][menu-id="' + token + '"]');
			$(this).mouseover(function() {
				if (!navEl.hasClass('menu-no')) {
					navEl.addClass('menu-no');
				}
			}).mouseout(function() {
				navEl.removeClass('menu-no');
			});
		});
		// 左移事件
		opts.scrollLeft.click(function() {
			target.navigation('scroll', -100);
		});
		// 右移事件
		opts.scrollRight.click(function() {
			target.navigation('scroll', 100);
		});
	}
	/**
	 * 控制菜单收缩
	 * 
	 * @param el
	 * 		导航菜单对象
	 */
	function doSildeUp(el) {
		let opts = $.data(el[0], 'navigation').options;
		el.animate({'margin-top': -el.outerHeight()}, 300, function() {
			// 渲染菜单展开展开按钮
			let downEl = $('<div class="menu-bt-sildedown soc-icon-font soc-icon-scroller-down"></div>');
			el.after(downEl);
			downEl.bind('click', function() {
				doSildeDown(el);
			});
			
			$(window).resize();
		});
	}
	/**
	 * 控制菜单展开
	 * 
	 * @param el
	 * 		导航菜单对象
	 */
	function doSildeDown(el) {
		$('.menu-bt-sildedown').remove();
		let opts = $.data(el[0], 'navigation').options;
		el.animate({'margin-top': 0}, 300, function() {
			$(window).resize();
		});
	}
	/**
	 * 一级菜单点击函数
	 * 
	 * @param el
	 * 		菜单对象
	 */
	function doClickFirstMenu(el) {
		if (el && el.length > 0) {
			let menu = $.data(el[0], 'menu');
			if (menu.menuLocation && menu.menuLocation == '###') {
				// 获取最近具有URL的孩子节点跳转
				let token = el.attr('menu-id');
				let subEl = $('div[class="menu-sub"][menu-id="' + token + '"]');
				subEl.find('span[menu-location!="###"]:first').trigger('click');
			} else {
				doForward(el);
			}
		}
	}
	/**
	 * 点击菜单跳转函数
	 * 
	 * @param el
	 * 		菜单对象
	 */
	function doForward(el) {
		let mid = location.hash.slice(1);
		let menu = $.data(el[0], 'menu');
		if (mid == menu.menuId) {
			__forward(el);
		} else {
			if ($.data(el[0], 'router') === true) {
				location.hash = `#${menu.menuId}`;// 刷新路由
			} else {
				__forward(el);
			}
		}
	}
	/**
	 * 菜单调整内部函数
	 * 
	 * @param el 菜单对象
	 */
	function __forward(el) {
		if (el[0]) {
			let menu = $.data(el[0], 'menu');
			// 调用页面销毁函数
			destroyContent();
			// 渲染导航面板
			renderNavPanel(menu.menuId);
			renderContent(menu.menuLocation);
		} else {
			// 无菜单对象,重定向到404页面
			window.location.href = $soc.basePath + '/commonController/404';
		}
	}
	/**
	 * 提示栏刷新函数
	 * 
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function doRefresh(opts) {
		opts.tipRefreshNum = 0;
		for (let tip of opts.tips) {
			if (tip.badge == true && tip.refreshUrl) {
				$.ajax({
					type : "POST",
					dataType : 'json',
					url : $soc.basePath + tip.refreshUrl,
					success : function(data) {
						tip.badgeEl.badge('setValue', data);
						opts.tipRefreshNum++;
						tip.onRefresh.call(this, tip);
					}
				});
			}
		}
		setTimeout(function() { doTipFlash(opts); }, 100);
	}
	/**
	 * 触发提示栏动画
	 * 
	 * @param opts
	 * 		导航菜单组件参数
	 */
	function doTipFlash(opts) {
		if (opts.tipRefreshNum == opts.tipRefreshTotal) {
			// 更新提示栏数值
			let el = opts.navigationEl;
			el.navigation('setTip', el.navigation('getTip'));
		} else {
			setTimeout(function() { doTipFlash(opts); }, 100);
		}
	}
	/**
	 * 计算正文内容布局
	 */
	function _layout() {
		let win_h = $(window).height();
		let target = $('#soc_content');
		let content_top = target.offset().top;
		let content_h = win_h - content_top;
		target.height(content_h);
		target.slimScroll({height: content_h});
		// 滚动条滚动距离
		let top = target.parent().find('.slimScrollBar').css('top');
		// 滚动条回归顶端
		target.parent().find('.slimScrollBar').css('top', '0px');
		// 内容回归顶端
		target.scrollTop(-top);
	}
	
	$.fn.navigation = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.navigation.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'navigation');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'navigation', {
					options: $.extend({}, $.fn.navigation.defaults, $.fn.navigation.parseOptions(this), options)
				});
			}
			init(this);
		});
	}
	
	$.fn.navigation.methods = {
		// 获取菜单参数
		options: function(jq) {
			return $.data(jq[0], 'navigation').options;
		},
		// 触发菜单跳转
		forward: function(jq, mid) {
			return jq.each(function() {
				if (mid && mid != '-1') {
					doForward($('span[menu-id="' + mid + '"]'));
				} else {
					// 默认加载排序在最前的菜单
					let menuEl = $('span[menu-location!="###"][menu-id]:eq(0)');
					doClickFirstMenu(menuEl);
				}
			});
		},
		// 根据URL加载页面
		render: function(jq, url) {
			return jq.each(function() {
				if (url) {
					renderContent(url);
				}
			});
		},
		// 获取提示栏提示数量
		getTip: function(jq) {
			let num = 0;
			let opts = $.data(jq[0], 'navigation').options;
			opts.tipEl.find('i[class*="badge"]').each(function() {
				let value = parseInt($(this).html());
				num += value;
			});
			return num;
		},
		// 设置提示栏提示效果
		setTip: function(jq, num) {
			return jq.each(function() {
				let opts = $.data(jq[0], 'navigation').options;
				let el = opts.tipEl;
				let iconEL = el.find('.icon-menu-bar');
				if (num != 0) {
					iconEL.addClass('menu-tipbar-animate');
				} else {
					iconEL.removeClass('menu-tipbar-animate');
				}
				opts.tipNum = num;
			});
		},
		// 横向滚动
		scroll: function(jq, deltaX) {
			return jq.each(function() {
				let opts = $(this).navigation('options');
				let wrapEl = $(this).find('.menu-nav-panel-wrap');
				let pos = Math.min(wrapEl._scrollLeft() + deltaX, getMaxScrollWidth());
				wrapEl.animate({scrollLeft: pos}, 400);
				
				function getMaxScrollWidth(){
					let w = 0;
					let innerEl = wrapEl.find('.menu-nav-panel-inner')
					innerEl.children('span').each(function(){
						w += $(this).outerWidth(true);
					});
					return w - wrapEl.width() + (innerEl.outerWidth() - innerEl.width());
				}
			});
		},
		// 组件改变大小
		resize: function(jq) {
			return jq.each(function() {
				let opts = $.data(jq[0], 'navigation').options;
				let el = $(this).find('.menu-panel');
				// 计算全局搜索组件状态
				let panel_w = el.width();
				let search_w = el.find('.menu-search').outerWidth();
				if (panel_w / 2 <= search_w) {
					el.find('.menu-search').hide();
				} else {
					el.find('.menu-search').show();
				}
				renderScrollBt(el, opts);
				// 组件改变大小横向滚动复位
				let wrapEl = el.find('.menu-nav-panel-wrap');
				$(this).navigation('scroll', -(wrapEl.scrollLeft()));
				// 计算二级菜单盒模型宽度
				$('.menu-combo .menu-sub').each(function() {
					$(this).width($(window).width() - ($(this).outerWidth() - $(this).width()));
				});
			});
		},
		// 折叠导航菜单
		collapse: function(jq) {
			return jq.each(function() {
				doSildeUp($(this));
			});
		},
		// 展开导航菜单
		expand: function(jq) {
			return jq.each(function() {
				doSildeDown($(this));
			});
		}
	};
	
	$.fn.navigation.parseOptions = function(target) {
		return $.extend({}, $.parser.parseOptions(target, ['systemName','loading','nothing',
           {rowNum:'boolean',navigation:'boolean', rootNavMenu:'boolean', router:'boolean'},
           {tipRefreshNum:'number', tipRefreshTime:'number', tipNum:'number', duration:'number'}]));
	};
	
	$.fn.navigation.defaults = {
		systemName: '', // 系统名称
		loading: '',
		nothing: '',
		rowNum: 5,// 三级菜单折行数量
		moudle: null, // 加载菜单模块
		navigation: true, // 面包屑导航标识。true-开启;false-关闭
		hasMenu: null, // 扁平菜单结构
		hasMenuTree: null, // 树型菜单结构
		tools: null, // 工具栏内容
		tips: null, // 提示栏内容
		tipRefreshNum: 0, // 提示栏异步请求次数
		tipRefreshTime: 300000, // 提示栏刷新时间
		tipNum: 0, // 提示栏提示信息数量
		duration: 300, // 菜单折叠/展开动画持续时间
		router: true, // 菜单路由开启/关闭
		searchs: null, // 全局搜索工具查询内容
		searchFn: null // 全局搜索查询函数
	};
})(jQuery);