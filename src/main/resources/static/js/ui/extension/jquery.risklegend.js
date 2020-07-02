/**
 * 风险图例组件
 */
(function($) {
	/**
	 * 初始化
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function init(target) {
		let t = $(target);
		let state = $.data(target, 'risklegend');
		let opts = state.options;
		t.removeClass('risk-vl risk-l risk-m risk-h risk-vh').addClass('risklegend').empty();
		
		createLegend(target);
		createRiskLegend(target);
		
		if (opts.width != 'auto') {
			t.width(opts.width);
		}
		if (opts.height != 'auto') {
			t.height(opts.height);
		}
	}
	/**
	 * 创建组件
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createRiskLegend(target) {
		let state = $.data(target, 'risklegend');
		let opts = state.options;
		let legend = null;
		let t = $(target);
		switch(opts.riskLevel) {
		case 0:
			t.addClass('risk-vl');
			legend = $(`<span class="soc-icon-font soc-icon-sun" style="font-size:${opts.size}em;"></span>`);
			break;
		case 1:
			t.addClass('risk-l');
			legend = $(`<span class="soc-icon-font soc-icon-sun" style="font-size:${opts.size}em;"></span>
			  			<span class="soc-icon-font soc-icon-cloud" style="font-size:${opts.size}em;"></span>`);
			break;
		case 2:
			t.addClass('risk-m');
			legend = $(`<span class="soc-icon-font soc-icon-cloudy" style="font-size:${opts.size * 0.75}em;"></span>
  						<span class="soc-icon-font soc-icon-cloud" style="font-size:${opts.size}em;"></span>`);
			break;
		case 3:
			t.addClass('risk-h');
			legend = $(`<span class="soc-icon-font soc-icon-cloudy" style="font-size:${opts.size * 0.75}em;"></span>
						<span class="soc-icon-font soc-icon-cloud" style="font-size:${opts.size}em;"></span>
						<span class="soc-icon-font soc-icon-rain rain-big" style="font-size:${opts.size}em;"></span>
						<span class="soc-icon-font soc-icon-rain rain-small" style="font-size:${opts.size}em;"></span>`);
			break;
		case 4:
			t.addClass('risk-vh');
			legend = $(`<span class="soc-icon-font soc-icon-cloudy" style="font-size:${opts.size * 0.75}em;"></span>
						<span class="soc-icon-font soc-icon-cloud" style="font-size:${opts.size}em;"></span>
						<span class="soc-icon-font soc-icon-rain rain-big" style="font-size:${opts.size}em;"></span>
						<span class="soc-icon-font soc-icon-rain rain-small" style="font-size:${opts.size}em;"></span>
						<span class="soc-icon-font soc-icon-flash" style="font-size:${opts.size * 0.5}em;"></span>`);
			break;
		}
		
		legend.appendTo(t);
		let main = $(`<div class="risklegend-main-area" 
						   style="width:${opts.size}em;height:${opts.size}em;margin:-${opts.size * 0.5}em 0 0 -${opts.size * 0.5}em">
					  </div>`).appendTo(t);
		// 绑定事件
		main.unbind('.risklegend').bind('click.risklegend', function() {
			let param = {
				value: opts.riskValue,
				level: opts.riskLevel,
				label: opts.riskLabel[opts.riskLevel]
			};
			opts.onClick.call(target, param);
		});
		// 提示信息
		if (opts.showTooltip) {
			let content = null;
			if (opts.formatter) {
				let param = {
					value: opts.riskValue,
					level: opts.riskLevel,
					label: opts.riskLabel[opts.riskLevel],
					color: opts.riskColor[opts.riskLevel]
				};
				content = opts.formatter.call(target, param);
			} else {
				let riskLevel = opts.riskLabel[opts.riskLevel];
				let riskColor = opts.riskColor[opts.riskLevel];
				content = `<table class="risklegend-tooltip-table">
								<tr>
									<td class="title">${opts.riskValueText}</td>
									<td class="colon">:</td>
									<td class="content" style="color:${riskColor}">${opts.riskValue}</td>
								</tr>
								<tr>
									<td class="title">${opts.riskLevelText}</td>
									<td class="colon">:</td>
									<td class="content" style="color:${riskColor}">${riskLevel}</td>
								</tr>
							</table>`;
			}
			main.tooltip({position: 'top', content: content});
		}
		return legend;
	}
	/**
	 * 创建图例
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createLegend(target) {
		let state = $.data(target, 'risklegend');
		let opts = state.options;
		let t = $(target);
		
		let legend = $(`<div class="risk-legend">
							<div class="soc-icon-font soc-icon-barometer-vl" riskLevel="0"></div>
							<div class="soc-icon-font soc-icon-barometer-l" riskLevel="1"></div>
							<div class="soc-icon-font soc-icon-barometer-m" riskLevel="2"></div>
							<div class="soc-icon-font soc-icon-barometer-h" riskLevel="3"></div>
							<div class="soc-icon-font soc-icon-barometer-vh" riskLevel="4"></div>
						</div>`);
		legend.addClass('layout-' + opts.legendAlign).appendTo(t);
		
		if (opts.showLegend) {
			t.removeClass('is-hide');
			if (opts.legendAlign == 'left' || opts.legendAlign == 'right') {
				legend.css('margin-top', -(legend.outerHeight() / 2) + 'px');
			}
			legend.find('.soc-icon-font').each(function() {
				$(this).tooltip({
					position: opts.legendAlign,
					content: opts.riskLevelText + ':' + opts.riskLabel[$(this).attr('riskLevel')]
				});
			});
			if (opts.legendColor) {
				legend.children('[riskLevel="' + opts.riskLevel + '"]').css('color', opts.riskColor[opts.riskLevel]);
			}
		} else {
			t.addClass('is-hide');
		}
	}
	
	$.fn.risklegend = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.risklegend.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'risklegend');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'risklegend', {
					options: $.extend({}, $.fn.risklegend.defaults, $.fn.risklegend.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn.risklegend.methods = {
		options: function(jq) {
			return $.data(jq[0], 'risklegend').options;
		},
		resize: function(jq, param) {
			return jq.each(function() {
				let {width, height, size} = param;
				if (width) {
					$(this).width(width);
				}
				if (height) {
					$(this).height(height);
				}
				if (size) {
					let opts = $.data(this, 'risklegend').options;
					switch(opts.riskLevel) {
					case 0:
						$(this).find('.soc-icon-sun').css('font-size', size + 'em');
						break;
					case 1:
						$(this).find('.soc-icon-sun').css('font-size', size + 'em');
						$(this).find('.soc-icon-cloud').css('font-size', size + 'em');
						break;
					case 2:
						$(this).find('.soc-icon-cloudy').css('font-size', size * 0.75 + 'em');
						$(this).find('.soc-icon-cloud').css('font-size', size + 'em');
						break;
					case 3:
						$(this).find('.soc-icon-cloudy').css('font-size', size * 0.75 + 'em');
						$(this).find('.soc-icon-cloud').css('font-size', size + 'em');
						$(this).find('.rain-big').css('font-size', size + 'em');
						$(this).find('.rain-small').css('font-size', size + 'em');
						break;
					case 4:
						$(this).find('.soc-icon-cloudy').css('font-size', size * 0.75 + 'em');
						$(this).find('.soc-icon-cloud').css('font-size', size + 'em');
						$(this).find('.rain-big').css('font-size', size + 'em');
						$(this).find('.rain-small').css('font-size', size + 'em');
						$(this).find('.soc-icon-flash').css('font-size', size * 0.5 + 'em');
						break;
					}
				}
			});
		},
		getRisk: function(jq) {
			let opts = $.data(jq[0], 'risklegend').options;
			let param = {
				riskValue: opts.riskValue,
				riskLevel: opts.riskLevel,
				riskLabel: opts.riskLabel[opts.riskLevel]
			};
			return param;
		},
		setRisk: function(jq, param) {
			return jq.each(function() {
				let opts = $.data(jq[0], 'risklegend').options;
				let oldValue = opts.riskValue;
				let {riskValue = opts.riskValue, riskLevel = opts.riskLevel} = param;
				
				if (oldValue != riskValue) {
					$(this).removeClass('risk-vl risk-l risk-m risk-h risk-vh').empty();
					$.data(jq[0], 'risklegend', {options: $.extend(opts, {riskValue: riskValue, riskLevel: riskLevel})});
					createLegend(this);
					createRiskLegend(this);
					
					opts.onChange.call(this, oldValue, riskValue);
				}
			});
		},
		showLegend: function(jq, type) {
			return jq.each(function() {
				if (type) {
					$(this).removeClass('is-hide');
				} else {
					$(this).addClass('is-hide');
				}
			});
		}
	};
	
	$.fn.risklegend.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['width','height','riskValueText','riskLevelText','legendAlign',
			 {showTooltip:'boolean',showLegend:'boolean',legendColor:'boolean'},
			 {riskValue:'number',riskLevel:'number',size:'number'}]
		), {
			riskLabel: (t.attr('riskLabel') ? eval(t.attr('riskLabel')) : undefined),
			riskColor: (t.attr('riskColor') ? eval(t.attr('riskColor')) : undefined),
			formatter: (t.attr('formatter') ? eval(t.attr('formatter')) : undefined)
		});
	};
	
	$.fn.risklegend.defaults = {
		width: 'auto',
		height: 'auto',
		riskValue: 0,// 0-100
		riskLevel: 0,// 0-4(很低、低、中、高、很高)
		riskLabel: ['VeryLow', 'Low', 'Middle', 'High', 'VeryHigh'],
		riskColor: ['#90c61e', '#0c80d7', '#fbbd08', '#f2711c', '#db2828'],
		size: 6,
		showTooltip: true,
		formatter: undefined,
		riskValueText: 'RiskValue',
		riskLevelText: 'RiskLevel',
		showLegend: true,
		legendColor: true,
		legendAlign: 'bottom',// top,bottom,left,righ
		onClick: function(param){},
		onChange:function(oldValue, newValue){}
	};
})(jQuery);