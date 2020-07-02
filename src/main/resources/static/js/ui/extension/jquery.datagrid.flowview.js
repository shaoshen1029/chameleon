/**
 * 可视化图表组件
 */
(function($) {
	let INDEX = 0;
	/**
	 * 可视化表格面板默认参数
	 */
	const flowview_panel_defaults = {
		title: '',
		iconCls: null,
		collapsible: true,
		onCollapse: function() {},
		onExpand: function() {}
	};
	/**
	 * 可视化图表表格主体默认参数
	 */
	const flowview_table_defaults = {
		headerHeight: 32,
		rowHeight: 32
	};
	/**
	 * 可视化图表表格列默认参数
	 */
	const flowview_colum_defaults = {
		title: '',
		field: '',
		width: '',
		align: 'left',
		iconCls: '',
		iconAlign: 'left',
		fixed: true,
		checkbox: false,
		rownumber: false
	};
	/**
	 * 初始化组件
	 */
	function init(target) {
		$(target).addClass('flowview-f').hide();
		let view = $('<div class="flowview-datagrid">' +
					     '<div class="flowview-datagrid-panel"></div>' +
					     '<div class="flowview-datagrid-body">' +
					         '<div class="flowview-datagrid-pager"></div>' +
					     '</div>' +
					 '</div>').insertAfter(target);
		$(target).appendTo(view);
		return view;
	}
	/**
	 * 创建组件UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createGrid(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let view = options.view;
		
		// 获取可视化表格标题面板参数
		opts.panelOpts = $.extend({}, flowview_panel_defaults, parsePanelOptions(target), opts.panelOpts);
		// 获取可视化图表表格主体参数
		opts.tableOpts = $.extend({}, flowview_table_defaults, parseTableOptions(target), opts.tableOpts);
		// 获取可视化图表列表参数
		if (!opts.columns) {
			opts.columns = parseColumnOptions(target);
		} else {
			let index = 0;
			let columns = [];
			for (let column of opts.columns) {
				column = $.extend({}, flowview_table_defaults, column, {index: index++});
				columns.push(column);
			}
			opts.columns = columns;
		}
		// 设置可视化表格序列
		opts.gridIndex = INDEX;
		$.data(target, 'flowview', options);
		
		let panel = renderGridPanel(target);
		options.panel = panel;
		let grid = renderGridBody(target);
		options.grid = grid;
		let pager = renderGridPager(target).appendTo(grid);
		options.pager = pager;
		$.data(target, 'flowview', options);
		// 加载可视化表格数据
		renderGridData(target);
		// 属性参数设置
		isShowPanel(target, opts.showPanel);
		isShowHeader(target, opts.showHeader);
		isShowPagination(target, opts.pagination);
		// 尺寸设置
		setSize(target);
		// 绑定触发事件
		bindEvent(target);
		++INDEX;
	}
	/**
	 * 渲染可视化表格面板
	 * 
	 * @param target
	 * 			DOM对象
	 * @return 可视化表格面板对象
	 */
	function renderGridPanel(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let view = options.view;
		let panel = view.find('.flowview-datagrid-panel').empty();
		let panelOpts = opts.panelOpts;
		let content = $(`<div class="panel-text">${panelOpts.title}</div>
						 <div class="panel-icon icon ${panelOpts.iconCls}"></div>
						 <div class="panel-tool">
							 <span class="icon soc-icon-caret-up" iconType="collapse"></span>
						 </div>`);
		
		content.appendTo(panel);
		if (panelOpts.iconCls) {
			panel.addClass('panel-with-icon');
		} else {
			panel.addClass('panel-no-icon');
			panel.find('.panel-icon').css('display', 'none');
		}
		if (!panelOpts.collapsible) {
			panel.find('.panel-tool').find('[iconType="collapse"]').css('display', 'none');
		}
		return panel;
	}
	/**
	 * 渲染可视化表格主体
	 * 
	 * @param target
	 * 			DOM对象
	 * @return 可视化表格主体对象
	 */
	function renderGridBody(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let view = options.view;
		let body = view.find('.flowview-datagrid-body').empty();
		let bodyView = $(`
				<div class="flowview-datagrid-loading">
					<div class="soc-icon-font soc-icon-spinner soc-pulse loading"></div>
				</div>
				<div class="flowview-datagrid-view">
					<div class="flowview-datagrid-view1"></div>
					<div class="flowview-datagrid-view2"></div>
					<div class="flowview-datagrid-view3"></div>
				</div>`);
		bodyView.appendTo(body);
		// 列表头部
		let bodyHeader1 = renderGridBodyHeader(target, 'left');
		bodyHeader1.appendTo(body.find('.flowview-datagrid-view1'));
		let bodyHeader2 = renderGridBodyHeader(target, 'center');
		bodyHeader2.appendTo(body.find('.flowview-datagrid-view2'));
		let bodyHeader3 = renderGridBodyHeader(target, 'right');
		bodyHeader3.appendTo(body.find('.flowview-datagrid-view3'));
		// 列表主体
		let bodyContent1 = renderGridBodyContent(target);
		bodyContent1.appendTo(body.find('.flowview-datagrid-view1'));
		let bodyContent2 = renderGridBodyContent(target);
		bodyContent2.appendTo(body.find('.flowview-datagrid-view2'));
		let bodyContent3 = renderGridBodyContent(target);
		bodyContent3.appendTo(body.find('.flowview-datagrid-view3'));
		
		return body;
	}
	/**
	 * 渲染可视化表格主体头部
	 * 
	 * @param target
	 * 			DOM对象
	 * @param frozen
	 * 			固定方式
	 * @return 可视化表格主体头部对象
	 */
	function renderGridBodyHeader(target, frozen = 'center') {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let view = options.view;
		let columns = opts.columns, gridIndex = opts.gridIndex;
		let bodyHeader = $(`<div class="flowview-datagrid-view-header">
								<div class="flowview-datagrid-view-header-inner">
									<table class="flowview-datagrid-htable">
										<tr class="flowview-datagrid-row flowview-datagrid-header-row flowview-datagrid${gridIndex}-header-row"></tr>
									</table>
								</div>
							</div>`);
		let row = bodyHeader.find('.flowview-datagrid-row');
		for (let column of columns) {
			if (column.frozen == frozen) {
				let td = '';
				if (column.checkbox) {
					td = $(`<td field="${column.field}">
								<div class="flowview-datagrid-cell flowview-datagrid${gridIndex}-cell-c${column.index} cell-checkbox">
									<label>
										<input type="checkbox"></input>
										<i></i>
									</label>
								</div>
							</td>`);
				} else if (column.rownumber) {
					td = $(`<td field="${column.field}">
								<div class="flowview-datagrid-cell flowview-datagrid${gridIndex}-cell-c${column.index} cell-rownumber">
								</div>
							</td>`);
				} else {
					td = $(`<td field="${column.field}">
								<div class="flowview-datagrid-cell flowview-datagrid${gridIndex}-cell-c${column.index} align-${column.align}">
									<span class="flowview-datagrid-cell-text">${column.title}</span>
								</div>
							</td>`);
				}
				if (column.title) {
					td.find('.flowview-datagrid-cell').addClass('is-label');
				}
				if (column.iconCls) {
					let title = td.find('.flowview-datagrid-cell-text');
					let icon = $(`<span class="icon ${column.iconCls}"></span>`);
					if (column.iconAlign == 'left') {
						title.before(icon);
					} else if (column.iconAlign == 'right') {
						title.after(icon);
					}
				}
				td.appendTo(row);
			}
		}
		return bodyHeader;
	}
	/**
	 * 渲染可视化表格主体内容
	 * 
	 * @param target
	 * 			DOM对象
	 * @return 可视化表格主体内容对象
	 */
	function renderGridBodyContent(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let bodyContent = $(`<div class="flowview-datagrid-view-body">
								<table class="flowview-datagrid-btable"></table>
							 </div>`);
		return bodyContent;
	}
	/**
	 * 渲染可视化表格分页栏
	 * 
	 * @param target
	 * 		DOM对象
	 * @return 可视化表格分页栏对象
	 */
	function renderGridPager(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let pager = $('<div class="flowview-datagrid-pager"></div>');
		if (opts.pagination) {
			pager.pagination({
				total: 0,
				pageSize: opts.pageSize,
				pageNumber: opts.pageNumber,
				pageList: opts.pageList,
				showPageList: opts.showPageList,
				onSelectPage : function(pageNum, pageSize) {
					$(this).pagination('refresh', {pageNumber: pageNum, pageSize: pageSize});
					opts.onSelectPage.call(this, pageNum, pageSize);
				}
			});
		}
		return pager;
	}
	/**
	 * 渲染可视化表格内容值
	 * 
	 * @param target
	 * 			DOM对象
	 * @param data
	 * 			数据
	 */
	function renderGridData(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		if (opts.data || opts.url) {
			if (opts.data) {
				renderGridRow(target, opts.data);
			} else {
				$.ajax({
					type: opts.method,
					dataType: 'json',
					url: opts.url,
					data: opts.queryParams,
					success: function(data) {
						renderGridRow(target, data);
					}
				});
			}
		}
	}
	/**
	 * 渲染可视化表格行
	 * 
	 * @param target
	 * 		DOM对象
	 * @param data
	 * 		数据集合
	 */
	function renderGridRow(target, data) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let grid = options.grid;
		// 处理分页数据结构
		if (opts.pagination) {
			let pager = options.pager;
			let {pageNum = opts.pageNumber, pageSize = opts.pageSize, total = 0} = data;
			pager.pagination('refresh', {
				total: total, 
				pageNumber: pageNum, 
				pageSize: pageSize
			});
			data = data.rows || [];
		}
		// 加载loading
		grid.addClass('is-loading');
		// 调整滚动条
		grid.find('.flowview-datagrid-view-body').prop('scrollTop', 0);
		grid.find('.flowview-datagrid-view-body').prop('scrollLeft', 0);
		// 生成行
		let rows = [
            renderGridRowData(target, data, 'left'),
            renderGridRowData(target, data, 'center'),
            renderGridRowData(target, data, 'right')
        ];
		grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function(viewIndex) {
			$(this).find('.flowview-datagrid-btable').empty().append(rows[viewIndex].children());
		});
		// 移除loading
		grid.removeClass('is-loading');
		// 添加斑马线
		if (opts.striped) {
			grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row:odd').addClass('row-alt');
		}
		// 加载动画效果
		if (opts.animate) {
			let animateView = grid.find('.flowview-datagrid-view-body');
			animateView.addClass('flowview-loaded-animation');
			setTimeout(()=>{
				animateView.removeClass('flowview-loaded-animation');
			}, 1000);
		}
		opts.onLoad.call(target, data);
	}
	/**
	 * 渲染可视化表格行
	 * 
	 * @param target
	 * 		DOM对象
	 * @param data
	 * 		数据集合
	 * @param frozen
	 * 		固定方式
	 * @returns 行对象
	 */
	function renderGridRowData(target, data, frozen = 'center') {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let columns = opts.columns, gridIndex = opts.gridIndex;
		let rows = $('<div class="row-warp"></div>'), rowIndex = 0;
		
		for (let d of data) {
			let row = $(`<tr class="flowview-datagrid-row flowview-datagrid-body-row flowview-datagrid${gridIndex}-body-row"></tr>`);
			for (let column of columns) {
				if (column.frozen == frozen) {
					let value = d[column.field] || '';
					let td = '';
					if (column.checkbox) {
						td = $(`<td field="${column.field}">
									<div class="flowview-datagrid-cell flowview-datagrid${gridIndex}-cell-c${column.index} cell-checkbox">
										<label>
											<input type="checkbox"></input>
											<i></i>
										</label>
									</div>
								</td>`);
					} else if (column.rownumber) {
						td = $(`<td field="${column.field}">
									<div class="flowview-datagrid-cell flowview-datagrid${gridIndex}-cell-c${column.index} cell-rownumber">
										<span class="flowview-datagrid-cell-text">${rowIndex + 1}</span>
									</div>
								</td>`);
					} else {
						if (column.formatter) {
							value = column.formatter.call(this, value, d, rowIndex);
						}
						td = $(`<td field="${column.field}">
									<div class="flowview-datagrid-cell flowview-datagrid${gridIndex}-cell-c${column.index} align-${column.align}">
										<span class="flowview-datagrid-cell-text">${value}</span>
									</div>
								</td>`);
					}
					td.appendTo(row);
				}
			}
			$.data(row[0], 'rowdata', d);
			rows.append(row);
			rowIndex++;
		}
		rows.children(':last').addClass('is-last-row');
		return rows;
	}
	/**
	 * 设置组件尺寸
	 * 
	 * @param target
	 * 		DOM对象
	 * @param width
	 * 		组件宽度
	 * @param height
	 * 		组件高度
	 */
	function setSize(target, width, height) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let [view, panel, grid, pager] = [options.view, options.panel, options.grid, options.pager];
		width = width || opts.width;
		height = height || opts.height;
		// 设置组件外层尺寸
		view.width(_parserSize(width, view.parent().width()));
		view.height(_parserSize(height));
		// 设置组件主体尺寸
		let gridWidthOffset = grid.outerWidth() - grid.width();// 宽度偏移量
		let gridWidth = view.width() - gridWidthOffset;// 主体宽度
		let gridHeightOffset = grid.outerHeight() - grid.height();// 高度偏移量
		let gridHeight = view.height() - gridHeightOffset - (opts.showPanel ? panel.outerHeight() : 0);// 主体高度
		let viewHeight = gridHeight - (opts.pagination ? pager.outerHeight() : 0);// 组件内部view高度
		// 设置组件主体尺寸
		grid.width(gridWidth).height(gridHeight);
		grid.find('.flowview-datagrid-loading').width(gridWidth).height(gridHeight);
		grid.find('.flowview-datagrid-view').height(viewHeight);
		// 设置组件列宽度
		let style = _parserCellSize(target, 0);
		$(style.join('\n')).appendTo(grid);
		grid.children('style[socui]:not(:last)').remove();
		// 设置组件主体标题尺寸
		let gridHeader = grid.find('.flowview-datagrid-view-header');
		let headerHeight = opts.tableOpts.headerHeight + 'px';
		gridHeader.find('.flowview-datagrid-header-row').css({
			'height': headerHeight, 'line-height': headerHeight
		});
		// 计算内部view宽度
		let viewWidth1 = grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-header-row').width();
		let viewWidth3 = grid.find('.flowview-datagrid-view3').find('.flowview-datagrid-header-row').width();
		let viewWidth2 = gridWidth - viewWidth1 - viewWidth3;
		// 设置组件内部view高度
		grid.find('.flowview-datagrid-view').children().height(viewHeight);
		// 设置组件主体头部尺寸
		grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-view-header').width(viewWidth1);
		grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-view-header').width(viewWidth2);
		grid.find('.flowview-datagrid-view3').find('.flowview-datagrid-view-header').width(viewWidth3);
		grid.find('.flowview-datagrid-view2').css('left', viewWidth1);
		// 设置组件主体内容尺寸
		grid.find('.flowview-datagrid-view-body').height(viewHeight - (opts.showHeader ? gridHeader.outerHeight() : 0));
		grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-view-body').width(viewWidth1);
		grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-view-body').width(viewWidth2);
		grid.find('.flowview-datagrid-view3').find('.flowview-datagrid-view-body').width(viewWidth3);
		// 设置组件主体内容Y轴滚动条状态
		if (viewWidth3 <= 0) {
			grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-view-body').addClass('is-last-view');
			// 判断滚动条状态
			let viewOuterHeight = grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-view-body').height();
			let viewInnerHeight = grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-btable').height();
			if (viewOuterHeight < viewInnerHeight) {
				// 在无view3且view2存在Y轴滚动条情况下，重新计算列宽度
				let style = _parserCellSize(target, _getScrollbarWidth());
				$(style.join('\n')).appendTo(grid);
				grid.children('style[socui]:not(:last)').remove();
			}
		} else {
			grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-view-body').removeClass('is-last-view');
		}
		// 重新绑定尺寸数据
		opts.width = width;
		opts.height = height;
		$.data(target, 'flowview', options);
	}
	/**
	 * 获取滚动条宽度
	 * 
	 * @returns 滚动条宽度
	 */
	function _getScrollbarWidth() {
		let dom = document.createElement('div');
		let styles = {
			width: '100px',
	        height: '100px',
	        overflowY: 'scroll',
	        top: '-10000px',
	        left: '-10000px',
	        position: 'absolute'
		};
		for (let i in styles) {
			dom.style[i] = styles[i];
		}
		document.body.appendChild(dom);
		let scrollbarWidth = dom.offsetWidth - dom.clientWidth;
		dom.remove();
		return scrollbarWidth;
	}
	/**
	 * 解析列尺寸
	 * 
	 * @param target
	 * 		DOM对象
	 * @param offsetWidth
	 * 		偏移量
	 * @return 列尺寸样式集合
	 */
	function _parserCellSize(target, offsetWidth) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let grid = options.grid;
		let columns = opts.columns, gridIndex = opts.gridIndex;
		let gridWidth = grid.width() - offsetWidth, totalWidth = grid.width() - offsetWidth, computeWidth = 0;
		// 去除固定长度
		for (let column of columns) {
			if (column.fixed) {
				gridWidth -= _parserSize(column.width);
			}
		}
		let style = ['<style type="text/css" socui="true">'];
		style.push(`.flowview-datagrid${gridIndex}-body-row {height: ${opts.tableOpts.rowHeight}px; line-height: ${opts.tableOpts.rowHeight}px;}`);
		for (let i=0; i<columns.length; i++) {
			let column = columns[i];
			let cell = grid.find('.flowview-datagrid-view-header').find('.flowview-datagrid-cell').eq(column.index);
			let offset = cell.outerWidth() - cell.width();
			offset = Number.isNaN(offset) ? 0 : offset;
			let width = Number.parseInt((_parserSize(column.width, gridWidth) - offset).toFixed(0));
			computeWidth += width + offset;
			if (i + 1 == columns.length) {
				width += totalWidth - computeWidth;
			}
			
			style.push(`.flowview-datagrid${gridIndex}-cell-c${column.index} {width: ${width}px;}`);
		}
		style.push('</style>');
		return style;
	}
	/**
	 * 解析尺寸
	 * 
	 * @param value
	 * 		尺寸值
	 * @param ratio
	 * 		尺寸系数
	 * return size
	 * 		尺寸
	 */
	function _parserSize(value, ratio = 1) {
		let regex = new RegExp(/[0-9]+%$/);
		if (value == 'auto') {
			return '100%';
		} else if (regex.test(value)) {
			return Number.parseFloat(value) / 100 * ratio;
		} else {
			return Number.parseFloat(value);
		}
	}
	/**
	 * 设置显示/隐藏面板
	 * 
	 * @param target
	 * 		DOM对象
	 * @param type
	 * 		显示/隐藏
	 */
	function isShowPanel(target, type = true) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let view = options.view;
		if (type) {
			view.removeClass('no-panel');
		} else {
			view.addClass('no-panel');
		}
		opts.showPanel = type;
		$.data(target, 'flowview', options);
	}
	/**
	 * 设置显示/隐藏列标题
	 * 
	 * @param target
	 * 		DOM对象
	 * @param type
	 * 		显示/隐藏
	 */
	function isShowHeader(target, type = true) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let view = options.view;
		if (type) {
			view.removeClass('no-header');
		} else {
			view.addClass('no-header');
		}
		opts.showHeader = type;
		$.data(target, 'flowview', options);
	}
	/**
	 * 设置显示/隐藏分页栏
	 * 
	 * @param target
	 * 		DOM对象
	 * @param type
	 * 		显示/隐藏
	 */
	function isShowPagination(target, type = true) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let view = options.view;
		if (type) {
			view.removeClass('no-pagination');
		} else {
			view.addClass('no-pagination');
		}
		opts.pagination = type;
		$.data(target, 'flowview', options);
	}
	/**
	 * 绑定组件触发事件
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function bindEvent(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let [view, panel, grid] = [options.view, options.panel, options.grid];
		let [panelOpts, tableOpts] = [opts.panelOpts, opts.tableOpts];
		// 绑定事件函数
		_bindPanelEvent(target, opts, panelOpts, panel, grid);
		_bindRowEvent(target, opts, grid);
		_bindCellEvent(target, opts, grid);
		_bindScrollEvent(target, opts, grid);
		_bindCheckEvent(target, opts, grid);
	}
	/**
	 * 绑定可视化表格面板触发事件
	 * 
	 * @param target
	 * 		DOM对象
	 * @param opts
	 * 		组件参数
	 * @param panelOpts
	 * 		面板参数
	 * @param panel
	 * 		面板对象
	 * @param grid
	 * 		表格对象
	 */
	function _bindPanelEvent(target, opts, panelOpts, panel, grid) {
		// 可视化表格面板折叠按钮
		panel.find('.panel-tool').find('[iconType="collapse"]').unbind('.flowview').bind('click.flowview', function() {
			if (opts.showPanel && panelOpts.collapsible) {
				if ($(this).hasClass('soc-icon-caret-up')) {
					_doPanelCollapse($(this), panel, grid, panelOpts);
				} else if ($(this).hasClass('soc-icon-caret-down')) {
					_doPanelExpand($(this), panel, grid, panelOpts);
				}
			}
		});
	}
	/**
	 * 绑定可视化表格行触发事件
	 * 
	 * @param target
	 * 		DOM对象
	 * @param opts
	 * 		组件参数
	 * @param grid
	 * 		表格对象
	 */
	function _bindRowEvent(target, opts, grid) {
		// 可视化表格行触发事件
		grid.find('.flowview-datagrid-body-row').unbind('.flowview').bind('click.flowview', function(e) {
			let rows = $(this).parent().find('.flowview-datagrid-body-row');
			let index = rows.index($(this));
			let data = $.data(this, 'rowdata');
			let checkbox = grid.find('.flowview-datagrid-body-row').eq(index).find('.cell-checkbox');
			let check = checkbox.length > 0 ? true : false;
			if ($(this).hasClass('row-selected')) {
				grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
					$(this).find('.flowview-datagrid-body-row').eq(index).removeClass('row-selected');
				});
				
				opts.onUnselect.call(target, index, data);
			} else {
				if (opts.singleSelect) {
					grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
						$(this).find('.flowview-datagrid-body-row').eq(index).removeClass('row-selected');
					});
				}
				grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
					$(this).find('.flowview-datagrid-body-row').eq(index).addClass('row-selected');
				});
				
				opts.onSelect.call(target, index, data);
			}
			if (check && opts.selectOnCheck) {
				e.preventDefault();
				if (opts.singleSelect) {
					grid.find('.flowview-datagrid-body-row').find('.cell-checkbox').find('input').prop('checked', false);
				}
				if ($(this).hasClass('row-selected')) {
					checkbox.find('input').prop('checked', true);
				} else {
					checkbox.find('input').prop('checked', false);
				}
			}
			opts.onClickRow.call(this, index, data);
		}).bind('dblclick.flowview', function() {
			let rows = $(this).parent().find('.flowview-datagrid-body-row');
			let index = rows.index($(this));
			let data = $.data(this, 'rowdata');
			opts.onDblClickRow.call(this, index, data);
		}).bind('mouseover.flowview', function() {
			let rows = $(this).parent().find('.flowview-datagrid-body-row');
			let index = rows.index($(this));
			grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
				$(this).find('.flowview-datagrid-body-row').eq(index).addClass('row-over');
			});
		}).bind('mouseout.flowview', function() {
			grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
				$(this).find('.flowview-datagrid-body-row').removeClass('row-over');
			});
		});
	}
	/**
	 * 绑定可视化表格列触发事件
	 * 
	 * @param target
	 * 		DOM对象
	 * @param opts
	 * 		组件参数
	 * @param grid
	 * 		表格对象
	 */
	function _bindCellEvent(target, opts, grid) {
		// 可视化表格列触发事件
		grid.find('.flowview-datagrid-btable').find('td[field]').unbind('.flowview').bind('click.flowview', function() {
			let cells = $(this).siblings('td[field]');
			let index = cells.index($(this));
			let field = $(this).attr('field');
			let value = $.data($(this).parent()[0], 'rowdata')[field];
			opts.onClickCell.call(this, index, field, value);
		}).bind('dblclick.flowview', function() {
			let cells = $(this).siblings('td[field]');
			let index = cells.index($(this));
			let field = $(this).attr('field');
			let value = $.data($(this).parent()[0], 'rowdata')[field];
			opts.onClickCell.call(this, index, field, value);
		});
	}
	/**
	 * 绑定可视化表格滚动条监听事件
	 * 
	 * @param target
	 * 		DOM对象
	 * @param opts
	 * 		组件参数
	 * @param grid
	 * 		表格对象
	 */
	function _bindScrollEvent(target, opts, grid) {
		// 可视化表格view2滚动条事件监听
		grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-view-body').unbind('scroll.flowview').bind('scroll.flowview', function() {
			// 横向滚动
			_scrollLeft($(this).parent().children('.flowview-datagrid-view-header'), $(this).scrollLeft());
			// 纵向滚动
			_scrollTop(grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-view-body'), $(this).scrollTop());
			_scrollTop(grid.find('.flowview-datagrid-view3').find('.flowview-datagrid-view-body'), $(this).scrollTop());
		});
		// 可视化表格view3滚动条事件监听
		grid.find('.flowview-datagrid-view3').find('.flowview-datagrid-view-body').unbind('scroll.flowview').bind('scroll.flowview', function() {
			_scrollTop(grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-view-body'), $(this).scrollTop());
			_scrollTop(grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-view-body'), $(this).scrollTop());
		});
		// 可视化表格鼠标滚轮事件监听
		grid.find('.flowview-datagrid-view-body').unbind('mousewheel.flowview DOMMouseScroll.flowview').bind('mousewheel.flowview DOMMouseScroll.flowview', function(e) {
			e.preventDefault();
			let e1 = e.originalEvent || window.event;
			let distance = e1.wheelDelta || e1.detail * (-1);
			let scrollTop = $(this).scrollTop();
			if ("deltaY" in e1) {
				distance = e1.deltaY * -1;
			}
			grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
				let view = $(this).find('.flowview-datagrid-view-body');
				_scrollTop(view, (scrollTop - distance));
			});
		});		
	}
	/**
	 * 绑定可视化表格头部复选框事件监听
	 * 
	 * @param target
	 * 		DOM对象
	 * @param opts
	 * 		组件参数
	 * @param grid
	 * 		表格对象
	 */
	function _bindCheckEvent(target, opts, grid) {
		// 可视化表格头部复选框事件监听
		grid.find('.flowview-datagrid-header-row').find('.cell-checkbox').find('input').unbind('.flowview').bind('click.flowview', function(e) {
			if (!opts.singleSelect) {
				let index = 0, rows = [];
				if ($(this).prop('checked')) {
					grid.find('.flowview-datagrid-body-row').find('.cell-checkbox').find('input').each(function() {
						$(this).prop('checked', true);
						let row = grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-body-row').eq(index);
						rows.push($.data(row[0], 'rowdata'));
						index++;
					});
					grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
						$(this).find('.flowview-datagrid-body-row').addClass('row-selected');
					});
					
					opts.onSelectAll.call(target, rows);
				} else {
					grid.find('.flowview-datagrid-body-row').find('.cell-checkbox').find('input').each(function() {
						$(this).prop('checked', false);
						let row = grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-body-row').eq(index);
						rows.push($.data(row[0], 'rowdata'));
						index++;
					});

					grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
						$(this).find('.flowview-datagrid-body-row').removeClass('row-selected');
					});
					
					opts.onUnselectAll.call(target, rows);
				}
			}
		});
	}
	/**
	 * 执行面板折叠点击事件
	 * 
	 * @param btn
	 * 		折叠按钮
	 * @param panel
	 * 		面板对象
	 * @param grid
	 * 		表格主体对象
	 * @param panelOpts
	 * 		面板参数
	 */
	function _doPanelCollapse(btn, panel, grid, panelOpts) {
		btn.removeClass('soc-icon-caret-up').addClass('soc-icon-caret-down');
		$.data(btn[0], 'gridheight', grid.css('height'));
		grid.animate({height: 0}, 500, function() {
			$(this).css('border-width', 0);
			panel.css({'border-bottom-left-radius': '4px', 'border-bottom-right-radius': '4px'});
		});
		panelOpts.onCollapse.call(this);
	}
	/**
	 * 执行面板折叠点击事件
	 * 
	 * @param btn
	 * 		折叠按钮
	 * @param panel
	 * 		面板对象
	 * @param grid
	 * 		表格主体对象
	 * @param panelOpts
	 * 		面板参数
	 */
	function _doPanelExpand(btn, panel, grid, panelOpts) {
		let height = $.data(btn[0], 'gridheight');
		btn.removeClass('soc-icon-caret-down').addClass('soc-icon-caret-up');
		panel.css({'border-bottom-left-radius': 0, 'border-bottom-right-radius': 0});
		grid.css({'border-width': '0 1px 1px'});
		grid.animate({height: height}, 500);
		panelOpts.onExpand.call(this);
	}
	/**
	 * 横向滚动条触发函数
	 * 
	 * @param target
	 * 		待滚动对象
	 * @param left
	 * 		位移量
	 */
	function _scrollLeft(target, left) {
		target.each(function() {
			$(this).scrollLeft(left);
		});
	}
	/**
	 * 纵向滚动条触发函数
	 * 
	 * @param target
	 * 		待滚动对象
	 * @param top
	 * 		位移量
	 */
	function _scrollTop(target, top) {
		target.each(function() {
			$(this).scrollTop(top);
		});
	}
	/**
	 * 解析可视化表格面板参数
	 * 
	 * @param target
	 * 		DOM对象
	 * @returns 面板参数
	 */
	function parsePanelOptions(target) {
		let self = $(target).find('panel');
		return $.extend({}, $.parser.parseOptions(self[0], 
				['title','iconCls',{collapsible:'boolean'}]
		), {
			title: (self.text() || self.attr('title')),
			iconCls: (self.attr('icon') || self.attr('iconCls'))
		});
	};
	/**
	 * 解析可视化表格主体参数
	 * 
	 * @param target
	 * 		DOM对象
	 * @returns 表格主体参数
	 */
	function parseTableOptions(target) {
		let self = $(target).find('table');
		return $.extend({}, flowview_table_defaults, $.parser.parseOptions(self[0], [{headerHeight:'number', rowHeight:'number'}]));
	}
	/**
	 * 解析可视化表格列参数
	 * 
	 * @param target
	 * 		DOM对象
	 * @returns 表格列参数
	 */
	function parseColumnOptions(target) {
		let options = $.data(target, 'flowview');
		let opts = options.options;
		let columns = [], left = [], center = [], right = [];
		let index = 0;
		let self = $(target).find('table');
		self.children('thead').each(function(index) {
			let theadOpts = $.extend({}, {frozen: 'center'}, $.parser.parseOptions(this, ['frozen']));
			$(this).find('th').each(function() {
				let column = $.extend({}, flowview_colum_defaults, $.parser.parseOptions(this, 
					['title','field','width','align','iconCls','iconAlign',{fixed:'boolean',checkbox:'boolean',rownumber:'boolean'}]
				), {
					title: ($(this).text() || $(this).attr('title')),
					iconCls: ($(this).attr('icon') || $(this).attr('iconCls')),
					formatter: ($(this).attr('formatter') ? eval($(this).attr('formatter')) : undefined),
					index: index
				}, theadOpts);
				
				if (column.checkbox) {
					column.width = column.width || opts.checkboxWidth;
				} else if (column.rownumber) {
					column.width = column.width || opts.rownumberWidth;
				}
				
				let regex = new RegExp(/[0-9]+%$/);
				column.fixed = regex.test(column.width) ? false : true;
				
				if (opts.frozen == 'left') {
					left.push(column);
				} else if (opts.frozen == 'right') {
					right.push(column);
				} else {
					center.push(column);
				}
				index++;
			});
		});
		columns = columns.concat(left, center, right);
		return columns;
	}
	
	$.fn.flowview = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.flowview.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'flowview');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'flowview', {
					options: $.extend({}, $.fn.flowview.defaults, $.fn.flowview.parseOptions(this), options),
					view: init(this)
				});
			}
			
			createGrid(this);
		});
	};
	
	$.fn.flowview.methods = {
		options: function(jq) {
			return $.data(jq[0], 'flowview').options;
		},
		resize: function(jq, param) {
			return jq.each(function() {
				setSize(this, param.width, param.height);
			});
		},
		load: function(jq, param) {
			return jq.each(function() {
				let options = $.data(this, 'flowview');
				let opts = options.options;
				let grid = options.grid;
				if (opts.url) {
					param = param || opts.queryParams;
					$.ajax({
						type: opts.method,
						dataType: 'json',
						url: opts.url,
						data: opts.queryParams,
						success: function(data) {
							// 渲染行数据
							renderGridRow(this, data);
							// 重新绑定函数
							_bindRowEvent(this, opts, grid);
							_bindCellEvent(this, opts, grid);
							_bindScrollEvent(this, opts, grid);
							opts.queryParams = param;
							opts.data = data;
							$.data(this, 'flowview', options);
							setSize(this);
						}
					});
				}
			});
		},
		loadData: function(jq, data) {
			return jq.each(function() {
				let options = $.data(this, 'flowview');
				let opts = options.options;
				let grid = options.grid;
				// 渲染行数据
				renderGridRow(this, data);
				// 重新绑定函数
				_bindRowEvent(this, opts, grid);
				_bindCellEvent(this, opts, grid);
				_bindScrollEvent(this, opts, grid);
				opts.data = data;
				$.data(this, 'flowview', options);
				setSize(this);
			});
		},
		loading: function(jq) {
			return jq.each(function() {
				let grid = $.data(this, 'flowview').grid;
				grid.addClass('is-loading');
			});
		},
		loaded: function(jq) {
			return jq.each(function() {
				let grid = $.data(this, 'flowview').grid;
				grid.removeClass('is-loading');
			});
		},
		getPanel: function(jq) {
			return $.data(jq[0], 'flowview').panel;
		},
		getGrid: function(jq) {
			return $.data(jq[0], 'flowview').grid;
		},
		getPager: function(jq) {
			return $.data(jq[0], 'flowview').pager;
		},
		getRows: function(jq) {
			let grid = $(jq[0]).flowview('getGrid');
			let rows = [];
			grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-btable').children().each(function() {
				let row = $.data(this, 'rowdata');
				rows.push(row);
			});
			return rows;
		},
		getRow: function(jq, index) {
			let grid = $(jq[0]).flowview('getGrid');
			let row = grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-body-row').eq(index);
			return $.data(row[0], 'rowdata');
		},
		getRowIndex: function(jq, row) {
			let rows = $(jq[0]).flowview('getRows');
			return $socui.indexOfArray(rows, row);
		},
		getRowLength: function(jq) {
			let grid = $(jq[0]).flowview('getGrid');
			let length = grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-body-row').length;
			return length;
		},
		getData: function(jq) {
			return $.data(jq[0], 'flowview').options.data;
		},
		getSelected: function(jq) {
			let opts = $(jq[0]).flowview('options');
			let grid = $(jq[0]).flowview('getGrid');
			if (opts.singleSelect) {
				let row = grid.find('.flowview-datagrid-view2').find('.row-selected:first');
				return $.data(row[0], 'rowdata');
			} else {
				let rows = [];
				grid.find('.flowview-datagrid-view2').find('.row-selected').each(function() {
					rows.push($.data(this, 'rowdata'));
				});
				return rows;
			}
		},
		setShowPanel: function(jq, type) {
			return jq.each(function() {
				isShowPanel(this, type);
				setSize(this);
			});
		},
		setShowHeader: function(jq, type) {
			return jq.each(function() {
				isShowHeader(this, type);
				setSize(this);
			});
		},
		setShowPagination: function(jq, type) {
			return jq.each(function() {
				isShowPagination(this, type);
				setSize(this);
			});
		},
		gotoPage: function(jq, pageNumber) {
			return jq.each(function() {
				let opts = $(this).flowview('options');
				let pager = $(this).flowview('getPager');
				pager.pagination('refresh', {pageNumber: pageNumber});
				opts.onSelectPage.call(pager[0], pageNumber, opts.pageSize);
			});
		},
		selectAll: function(jq) {
			return jq.each(function() {
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				if (!opts.singleSelect) {
					let rows = [];
					grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-body-row').each(function() {
						rows.push($.data(this, 'rowdata'));
					});
					grid.find('.flowview-datagrid-body-row').addClass('row-selected');
					let checkbox = grid.find('.flowview-datagrid-body-row').find('.cell-checkbox');
					let check = checkbox.length > 0 ? true : false;
					if (check && opts.selectOnCheck) {
						checkbox.find('input').prop('checked', true);
					}
					
					opts.onSelectAll.call(this, rows);
				}
			});
		},
		unselectAll: function(jq) {
			return jq.each(function() {
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				if (!opts.singleSelect) {
					let rows = [];
					grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-body-row').each(function() {
						rows.push($.data(this, 'rowdata'));
					});
					grid.find('.flowview-datagrid-body-row').removeClass('row-selected');
					let checkbox = grid.find('.flowview-datagrid-body-row').find('.cell-checkbox');
					let check = checkbox.length > 0 ? true : false;
					if (check && opts.selectOnCheck) {
						checkbox.find('input').prop('checked', false);
					}
					
					opts.onUnselectAll.call(this, rows);
				}
			});
		},
		selectRow: function(jq, index) {
			return jq.each(function() {
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				
				let row = grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-body-row').eq(index);
				row.addClass('row-selected');
				grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-body-row').eq(index).addClass('row-selected');
				grid.find('.flowview-datagrid-view3').find('.flowview-datagrid-body-row').eq(index).addClass('row-selected');
				let checkbox = grid.find('.flowview-datagrid-body-row').eq(index).find('.cell-checkbox');
				let check = checkbox.length > 0 ? true : false;
				if (check && opts.selectOnCheck) {
					checkbox.find('input').prop('checked', true);
				}
				
				opts.onSelect.call(this, index, $.data(row[0], 'rowdata'));
			});
		},
		unselectRow: function(jq, index) {
			return jq.each(function() {
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				
				let row = grid.find('.flowview-datagrid-view2').find('.flowview-datagrid-body-row').eq(index);
				row.removeClass('row-selected');
				grid.find('.flowview-datagrid-view1').find('.flowview-datagrid-body-row').eq(index).addClass('row-selected');
				grid.find('.flowview-datagrid-view3').find('.flowview-datagrid-body-row').eq(index).addClass('row-selected');
				let checkbox = grid.find('.flowview-datagrid-body-row').eq(index).find('.cell-checkbox');
				let check = checkbox.length > 0 ? true : false;
				if (check && opts.selectOnCheck) {
					checkbox.find('input').prop('checked', false);
				}
				
				opts.onUnselect.call(this, index, $.data(row[0], 'rowdata'));
			});
		},
		insertRow: function(jq, param) {
			return jq.each(function() {
				let {index, row} = param;
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				// 调整滚动条
				grid.find('.flowview-datagrid-view-body').prop('scrollTop', 0);
				grid.find('.flowview-datagrid-view-body').prop('scrollLeft', 0);
				// 生成行
				let data = Array.isArray(row) ? row : [row];
				let rows = [
		            renderGridRowData(this, data, 'left'),
		            renderGridRowData(this, data, 'center'),
		            renderGridRowData(this, data, 'right')
	            ];
				grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function(viewIndex) {
					let row = rows[viewIndex].children().removeClass('is-last-row');
					if (opts.animate) {
						row.addClass('flowview-insert-animation');
						setTimeout(function() {row.removeClass('flowview-insert-animation')}, 1000);
					}
					$(this).find('.flowview-datagrid-body-row').eq(index).before(row);
				});
				// 重置斑马线
				if (opts.striped) {
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row').removeClass('row-alt');
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row:odd').addClass('row-alt');
				}
				// 重置行号
				let rownumber = false;
				for (let column of opts.columns) {
					if (column.rownumber) {
						rownumber = true;
						break;
					}
				}
				if (rownumber) {
					grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
						$(this).find('.flowview-datagrid-view-body').find('.cell-rownumber').each(function(rowIndex) {
							$(this).find('.flowview-datagrid-cell-text').text(rowIndex + 1);
						});
					});
				}
				// 重新绑定函数
				_bindRowEvent(this, opts, grid);
				_bindCellEvent(this, opts, grid);
				_bindScrollEvent(this, opts, grid);
			});
		},
		updateRow: function(jq, param) {
			return jq.each(function() {
				let {index, row} = param;
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				// 调整滚动条
				grid.find('.flowview-datagrid-view-body').prop('scrollTop', 0);
				grid.find('.flowview-datagrid-view-body').prop('scrollLeft', 0);
				// 生成行
				let data = Array.isArray(row) ? row : [row];
				let rows = [
		            renderGridRowData(this, data, 'left'),
		            renderGridRowData(this, data, 'center'),
		            renderGridRowData(this, data, 'right')
	            ];
				grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function(viewIndex) {
					let row = rows[viewIndex].children().removeClass('is-last-row');
					if (opts.animate) {
						row.addClass('flowview-insert-animation');
						setTimeout(function() {row.removeClass('flowview-insert-animation')}, 1000);
					}
					$(this).find('.flowview-datagrid-body-row').eq(index).before(row).remove();
				});
				// 重置斑马线
				if (opts.striped) {
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row').removeClass('row-alt');
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row:odd').addClass('row-alt');
				}
				// 重置行号
				let rownumber = false;
				for (let column of opts.columns) {
					if (column.rownumber) {
						rownumber = true;
						break;
					}
				}
				if (rownumber) {
					grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
						$(this).find('.flowview-datagrid-view-body').find('.cell-rownumber').each(function(rowIndex) {
							$(this).find('.flowview-datagrid-cell-text').text(rowIndex + 1);
						});
					});
				}
				// 重新绑定函数
				_bindRowEvent(this, opts, grid);
				_bindCellEvent(this, opts, grid);
				_bindScrollEvent(this, opts, grid);
			});
		},
		deleteRow: function(jq, index) {
			return jq.each(function() {
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				// 调整滚动条
				grid.find('.flowview-datagrid-view-body').prop('scrollTop', 0);
				grid.find('.flowview-datagrid-view-body').prop('scrollLeft', 0);
				grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
					$(this).find('.flowview-datagrid-body-row').eq(index).remove();
				});
				// 重置斑马线
				if (opts.striped) {
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row').removeClass('row-alt');
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row:odd').addClass('row-alt');
				}
				// 重置行号
				let rownumber = false;
				for (let column of opts.columns) {
					if (column.rownumber) {
						rownumber = true;
						break;
					}
				}
				if (rownumber) {
					grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
						$(this).find('.flowview-datagrid-view-body').find('.cell-rownumber').each(function(rowIndex) {
							$(this).find('.flowview-datagrid-cell-text').text(rowIndex + 1);
						});
					});
				}
			});
		},
		appendRow: function(jq, row) {
			return jq.each(function() {
				let opts = $(this).flowview('options');
				let grid = $(this).flowview('getGrid');
				let length = $(this).flowview('getRowLength');
				let index = length > 0 ? length - 1 : 0;
				// 调整滚动条
				grid.find('.flowview-datagrid-view-body').prop('scrollTop', 0);
				grid.find('.flowview-datagrid-view-body').prop('scrollLeft', 0);
				// 生成行
				let data = Array.isArray(row) ? row : [row];
				let rows = [
		            renderGridRowData(this, data, 'left'),
		            renderGridRowData(this, data, 'center'),
		            renderGridRowData(this, data, 'right')
	            ];
				grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function(viewIndex) {
					let row = rows[viewIndex].children().removeClass('is-last-row');
					if (opts.animate) {
						row.addClass('flowview-insert-animation');
						setTimeout(function() {row.removeClass('flowview-insert-animation')}, 1000);
					}
					$(this).find('.flowview-datagrid-body-row').eq(index).after(row);
				});
				// 重置斑马线
				if (opts.striped) {
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row').removeClass('row-alt');
					grid.find('.flowview-datagrid-btable').find('.flowview-datagrid-body-row:odd').addClass('row-alt');
				}
				// 重置行号
				let rownumber = false;
				for (let column of opts.columns) {
					if (column.rownumber) {
						rownumber = true;
						break;
					}
				}
				if (rownumber) {
					grid.find('.flowview-datagrid-view').children('[class*="flowview-datagrid-view"]').each(function() {
						$(this).find('.flowview-datagrid-view-body').find('.cell-rownumber').each(function(rowIndex) {
							$(this).find('.flowview-datagrid-cell-text').text(rowIndex + 1);
						});
					});
				}
				// 重新绑定函数
				_bindRowEvent(this, opts, grid);
				_bindCellEvent(this, opts, grid);
				_bindScrollEvent(this, opts, grid);
			});
		},
		refreshRow: function(jq, index) {
			return jq.each(function() {
				let row = $(this).flowview('getRow', index);
				$(this).flowview('updateRow', {index: index, row: row});
			});
		}
	};
	
	$.fn.flowview.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, ['width','height','url','method',
	        {
				striped: 'boolean', singleSelect: 'boolean', showPanel: 'boolean', showHeader: 'boolean',
				animate: 'boolean', selectOnCheck: 'boolean', pagination: 'boolean', showPageList: 'boolean'
			},
			{pageNumber: 'number', pageSize: 'number'},
			{pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined)}
		]));
	};
	
	$.fn.flowview.defaults = {
		width: 'auto',
		height: 'auto',
		checkboxWidth: 30,
		rownumberWidth: 30,
		url: '',
		method: 'post',
		queryParams: {},
		striped: true,
		singleSelect: false,
		showPanel: true,
		showHeader: true,
		data: null,
		panelOpts: null,
		tableOpts: null,
		columns: undefined,
		animate: false,
		selectOnCheck: true,
		pagination: false,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10,20,30,40,50],
		showPageList: false,
		onClickCell: function(index, field, value) {},
		onDblClickCell: function(index, field, value) {},
		onClickRow: function(index, row) {},
		onDblClickRow: function(index, row) {},
		onSelect: function(index ,row) {},
		onUnselect: function(index ,row) {},
		onSelectAll: function(rows) {},
		onUnselectAll: function(rows) {},
		onLoad: function(data) {},
		onSelectPage: function(pageNum, pageSize) {}
	};
})(jQuery);