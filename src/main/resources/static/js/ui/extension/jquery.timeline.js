/**
 * 时间轴组件
 */
(function($) {
	/**
	 * 创建组件UI
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function createTimeline(target) {
		let options = $.data(target, 'timeline');
		let opts = options.options;
		let t = $(target).removeClass('no-button').addClass('timeline').empty();
		
		if (opts.width != 'auto') {
			t.width(opts.width);
		}
		if (opts.height != 'auto') {
			t.height(opts.height);
		}
		let leftBt = createButton('left');// 左移按钮
		let rightBt = createButton('right');// 右移按钮
		let wrapper = createTimelineWrapper(target);// 时间轴主体
		t.append(leftBt).append(wrapper).append(rightBt);
		
		if (!opts.showButton) {
			t.addClass('no-button');
			wrapper.find('.axis').width(wrapper.width());
		}
		if (!opts.showScale) {
			wrapper.find('.axis').addClass('no-scales');
		}
		if (!opts.showTitle) {
			wrapper.find('.axis').addClass('no-titles');
		} else {
			if (opts.showBorderScale) {
				let first = wrapper.find('.titles').children(':first-child');
				let last = wrapper.find('.titles').children(':last-child');
				let first_title_width = Math.ceil(first.width());
				let last_title_width = Math.ceil(last.width());
				first.css('margin-left', Number.parseFloat(first_title_width / 2));
				last.css('margin-right', -(Number.parseFloat(last_title_width / 2)));
			}
		}
		if (!opts.showLabel) {
			wrapper.find('.axis').addClass('no-labels');
		}
		// 创建节点
		createTimelineNode(target);
		// 绑定事件
		bindEvent(target);
	}
	/**
	 * 创建按钮
	 * 
	 * @param type
	 * 		按钮类型
	 * @return bt
	 * 		按钮对象
	 */
	function createButton(type) {
		let bt = $(`<div class="timeline-bt ${type}">
						<span class="soc-icon-font soc-icon-scroller-${type}-all"></span>
					</div>`);
		return bt;
	}
	/**
	 * 创建时间轴主体
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function createTimelineWrapper(target) {
		let opts = $.data(target, 'timeline').options;
		let wrapper = $(`<div class="timeline-wrapper">
							<div class="line"></div>
							<div class="axis align-${opts.align}" style="width: ${opts.lineLength}px;transform: translateX(0px);" distance="0">
								<div class="scales"></div>
								<div class="titles"></div>
								<div class="nodes"></div>
								<div class="labels"></div>
							</div>
						 </div>`);
		
		let scales = computeScales(target);
		for (let scale of scales) {
			if (scale.offset == 100) {
				$(`<div class="scale" style="right: 0%;"></div>`).appendTo(wrapper.find('.scales'));
				$(`<div class="title" style="right: 0%;">${scale.title}</div>`).appendTo(wrapper.find('.titles'));
			} else {
				$(`<div class="scale" style="left: ${scale.offset}%;"></div>`).appendTo(wrapper.find('.scales'));
				$(`<div class="title" style="left: ${scale.offset}%;">${scale.title}</div>`).appendTo(wrapper.find('.titles'));
			}
		}
		return wrapper;
	}
	/**
	 * 创建时间轴节点
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function createTimelineNode(target) {
		let opts = $.data(target, 'timeline').options;
		let t = $(target);
		if (opts.data) {
			let nodes = [];
			for (let d of opts.data) {
				let {formatStart, formatEnd} = opts;
				let formatValue = Number(new Date($SocUtil.strToDate(d[opts.valueField]).format(opts.formatter)));
				if (formatValue >= formatStart && formatValue <= formatEnd) {
					let node = {
						offset: Number.parseFloat((formatValue - formatStart) / (formatEnd - formatStart) * 100),
						label: d[opts.labelField],
						data: d
					};
					nodes.push(node);
				}
			}
			for (let node of nodes) {
				let nodeEl = $(`<div class="node" style="left: ${node.offset}%;"></div>`);
				$.data(nodeEl[0], 'nodeData', node.data);
				nodeEl.appendTo(t.find('.nodes'));
				$(`<div class="label" style="left: ${node.offset}%;">${node.label}</div>`).appendTo(t.find('.labels'));
				
				// 提示信息
				let content = '';
				let position = 'top';
				if (opts.tipFormatter) {
					content = opts.tipFormatter.call(nodeEl[0], node.data);
				} else {
					content = node.data[opts.labelField] + ' : ' + node.data[opts.valueField];
				}
				nodeEl.tooltip({
					position: opts.tipAlign,
					content: content
				});
			}
		}
	}
	/**
	 * 计算刻度
	 * 
	 * @param target
	 * 		DOM对象
	 * @return 刻度集合
	 */
	function computeScales(target) {
		let opts = $.data(target, 'timeline').options;
		let scales = [];
		let start = opts.start || new Date().DateSubtraction('d', 1).format("yyyy-MM-dd hh:mm:ss");
		let end = opts.end || new Date().format("yyyy-MM-dd hh:mm:ss");
		let formatStart, formatEnd, diff, offset;
		
		formatStart = Number(new Date($SocUtil.strToDate(start).format(opts.formatter)));
		formatEnd = Number(new Date($SocUtil.strToDate(end).format(opts.formatter)));
		
		if (opts.axis && opts.axis.length > 0) {
			for (let s of opts.axis) {
				let formatValue = Number(new Date($SocUtil.strToDate(s.scale).format(opts.formatter)));
				let scale = {
					offset: Number.parseFloat((formatValue - formatStart) / (formatEnd - formatStart) * 100),
					title: s.title
				};
				scales.push(scale);
			}
		} else {
			diff = Number.parseInt((formatEnd - formatStart) / (opts.split));
			offset = Number.parseFloat(100 / (opts.split));
			for (let i=0; i<opts.split - 1; i++) {
				let scale = {
					offset: offset * (i + 1),
					title: new Date(formatStart + diff * (i + 1)).format(opts.formatter)
				};
				scales.push(scale);
			}
			if (opts.showBorderScale) {
				// 追加头尾刻度
				scales.splice(0, 0, {offset: 0, title: new Date(formatStart).format(opts.formatter)});
				scales.push({offset: 100, title: new Date(formatEnd).format(opts.formatter)});
			}
		}
			
		$.data(target, 'timeline', {options: $.extend(opts, {
			start: start,
			end: end,
			formatStart: formatStart,
			formatEnd: formatEnd
		})});
		return scales;
	}
	/**
	 * 绑定事件
	 * 
	 * @param target
	 * 		DOM对象
	 */
	function bindEvent(target) {
		let opts = $.data(target, 'timeline').options;
		let t = $(target);
		// 左移按钮
		t.find('.soc-icon-scroller-left-all').unbind('.timeline').bind('click.timeline', function() {
			let axis = t.find('.timeline-wrapper .axis');
			_scroll(target, 1);
		});
		// 右移按钮
		t.find('.soc-icon-scroller-right-all').unbind('.timeline').bind('click.timeline', function() {
			let axis = t.find('.timeline-wrapper .axis');
			_scroll(target, -1);
		});
		// 节点函数
		t.find('.nodes .node').unbind('.timeline').bind('click.timeline', function() {
			opts.onClick.call(this, $.data(this, 'nodeData'));
		});
	}
	/**
	 * 时间轴滚动函数
	 * 
	 * @param target
	 * 		DOM对象
	 * @param type
	 * 		滚动方向参数 1-向左滚动; -1-向右滚动
	 */
	function _scroll(target, type) {
		let opts = $.data(target, 'timeline').options;
		let t = $(target);
		let axis = t.find('.timeline-wrapper .axis');
		let axisLength = axis.width(), wrapperLength = t.find('.timeline-wrapper').width();
		let scroll = opts.scroll, distance = Number.parseInt(axis.attr('distance'));
		
		distance += scroll * type;
		if (type == 1) {
			distance = distance > 0 ? 0 : distance;
		} else if (type == -1) {
			distance = Math.abs(distance) > axisLength - wrapperLength ? (axisLength - wrapperLength) * type : distance;
		}
		axis.css('transform', 'translateX(' + distance + 'px)').attr('distance', distance);
	}
	/**
	 * 创建单节点对象
	 * 
	 * @param opts
	 * 		组件参数
	 * @param data
	 * 		节点值
	 * @return 单节点对象
	 */
	function _createSimpleNode(opts, data) {
		let doms = {node: null, label: null};
		let {formatStart, formatEnd} = opts;
		let formatValue = Number(new Date($SocUtil.strToDate(data[opts.valueField]).format(opts.formatter)));
		if (formatValue >= formatStart && formatValue <= formatEnd) {
			let node = {
				offset: Number.parseFloat((formatValue - formatStart) / (formatEnd - formatStart) * 100),
				label: data[opts.labelField],
				data: data
			};
			
			let nodeEl = $(`<div class="node" style="left: ${node.offset}%;"></div>`);
			let labelEl = $(`<div class="label" style="left: ${node.offset}%;">${node.label}</div>`);
			$.data(nodeEl[0], 'nodeData', node.data);
			// 提示信息
			let content = '';
			let position = 'top';
			if (opts.tipFormatter) {
				content = opts.tipFormatter.call(nodeEl[0], node.data);
			} else {
				content = node.data[opts.labelField] + ' : ' + node.data[opts.valueField];
			}
			nodeEl.tooltip({
				position: opts.tipAlign,
				content: content
			});
			doms.node = nodeEl;
			doms.label = labelEl;
		}
		return doms;
	}
	
	$.fn.timeline = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.timeline.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'timeline');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'timeline', {
					options: $.extend({}, $.fn.timeline.defaults, $.fn.timeline.parseOptions(this), options)
				});
			}
			createTimeline(this);
		});
	};
	
	$.fn.timeline.methods = {
		options: function(jq) {
			return $.data(jq[0], 'timeline').options;
		},
		resize: function(jq, param) {
			return jq.each(function() {
				let opts = $.data(this, 'timeline').options;
				let {width, height} = param;
				if (width) {
					$(this).width(width);
				}
				if (height) {
					$(this).height(height);
				}
				$.data(this, 'timeline', {options: $.extend(opts, {width: width, height: height})});
			});
		},
		insertNode: function(jq, data) {
			return jq.each(function() {
				let opts = $.data(this, 'timeline').options;
				let nodes = $(this).find('.timeline-wrapper .axis .nodes');
				let labels = $(this).find('.timeline-wrapper .axis .labels');
				let axis = $(this).find('.timeline-wrapper .axis');
				let doms = _createSimpleNode(opts, data);
				
				let offset = Number.parseFloat(doms.node.css('left').replace(/%/, '')) / 100 * axis.width();
				nodes.children().each(function(index) {
					let selfOffset = Number.parseFloat($(this).css('left').replace(/px/, ''));
					if (selfOffset > offset) {
						// 添加节点
						nodes.children().eq(index).before(doms.node);
						labels.children().eq(index).before(doms.label);
						// 绑定点击事件
						doms.node.bind('click.timeline', function() {
							opts.onClick.call(this, $.data(this, 'nodeData'));
						});
					}
				});
			});
		},
		deleteNode: function(jq, index) {
			return jq.each(function() {
				let nodes = $(this).find('.timeline-wrapper .axis .nodes');
				let labels = $(this).find('.timeline-wrapper .axis .labels');
				nodes.children().eq(index).remove();
				labels.children().eq(index).remove();
			});
		},
		getNode: function(jq, index) {
			let data = null;
			let nodes = jq.find('.timeline-wrapper .axis .nodes');
			let node = nodes.children().eq(index);
			if (node[0]) {
				data = $.data(node[0], 'nodeData');
			}
			return data;
		},
		setData: function(jq, data) {
			return jq.each(function() {
				let opts = $.data(this, 'timeline').options;
				let {formatStart, formatEnd} = opts;
				let nodes = jq.find('.timeline-wrapper .axis .nodes');
				let labels = $(this).find('.timeline-wrapper .axis .labels');
				nodes.children().remove();
				labels.children().remove();
				for (let d of data) {
					let formatValue = Number(new Date($SocUtil.strToDate(d[opts.valueField]).format(opts.formatter)));
					if (formatValue >= formatStart && formatValue <= formatEnd) {
						let node = {
							offset: Number.parseFloat((formatValue - formatStart) / (formatEnd - formatStart) * 100),
							label: d[opts.labelField],
							data: d
						};
						
						let nodeEl = $(`<div class="node" style="left: ${node.offset}%;"></div>`);
						let labelEl = $(`<div class="label" style="left: ${node.offset}%;">${node.label}</div>`);
						$.data(nodeEl[0], 'nodeData', node.data);
						// 绑定点击事件
						nodeEl.bind('click.timeline', function() {
							opts.onClick.call(this, $.data(this, 'nodeData'));
						});
						// 提示信息
						let content = '';
						let position = 'top';
						if (opts.tipFormatter) {
							content = opts.tipFormatter.call(nodeEl[0], node.data);
						} else {
							content = node.data[opts.labelField] + ' : ' + node.data[opts.valueField];
						}
						nodeEl.tooltip({
							position: opts.tipAlign,
							content: content
						});
						nodes.append(nodeEl);
						labels.append(labelEl);
					}
				}
			});
		},
		getData: function(jq) {
			let data = [];
			let nodes = jq.find('.timeline-wrapper .axis .nodes');
			nodes.children().each(function() {
				data.push($.data(this, 'nodeData'));
			});
			return data;
		},
		scroll: function(jq, scroll) {
			return jq.each(function() {
				let axis = $(this).find('.timeline-wrapper .axis');
				let axisLength = axis.width(), wrapperLength = $(this).find('.timeline-wrapper').width();
				let distance = Number.parseInt(axis.attr('distance'));
				
				distance += scroll;
				distance = distance > 0 ? 0 : distance;
				distance = Math.abs(distance) > axisLength - wrapperLength ? -(axisLength - wrapperLength) : distance;
				axis.css('transform', 'translateX(' + distance + 'px)').attr('distance', distance);
			});
		}
	};
	
	$.fn.timeline.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['width','height','align','start','end','formatter','valueField','labelField',
			 {showBorderScale:'boolean',showButton:'boolean',showScale:'boolean',showScale:'boolean',showLabel:'boolean'},
			 {lineLength:'number',scroll:'number'}]
		), {
			axis: (t.attr('axis') ? eval(t.attr('axis')) : undefined),
			tipFormatter: (t.attr('tipFormatter') ? eval(t.attr('tipFormatter')) : undefined),
			data: (t.attr('data') ? eval(t.attr('data')) : [])
		});
	};
	
	$.fn.timeline.defaults = {
		width: 'auto',
		height: 'auto',
		lineLength: 1800,
		scroll: 300,
		align: 'top',// top,bottom
		split: 5,
		showBorderScale: false,
		axis: [],
		start: null,
		end: null,
		formatter: 'yyyy-MM-dd hh:mm:ss',
		data: null,
		valueField: 'value',
		labelField: 'label',
		tipFormatter: undefined,
		tipAlign:'top',//top,bottom,left,right
		showButton: true,
		showScale: false,
		showTitle: false,
		showLabel: true,
		onClick: function(data) {}
	};
})(jQuery);