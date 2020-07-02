/**
 * 节点轴组件
 */
(function($) {
	/**
	 * 初始化组件
	 */
	function init(target) {
		$(target).addClass('nodeline-f').hide();
		let nodeline = $('<div class="nodeline-panel">' +
						 	'<div class="nodeline"></div>' +
						 '</div>').insertAfter(target);
		let name = $(target).attr("name");
		if (name) {
			nodeline.find("div.nodeline-panel").attr("name", name);
		}
		return nodeline;
	}
	/**
	 * 创建组件UI
	 * 
	 * @param target
	 * 			DOM对象
	 */
	function createNodeline(target) {
		let options = $.data(target, 'nodeline');
		let opts = options.options;
		let nodeline = options.nodeline;
		let nodelines = opts.nodelines ? opts.nodelines : [];
		if (nodelines.length == 0) {
			$(target).find('nodeline').each(function() {
				let _opts = $.extend({}, $.parser.parseOptions(this, ['label','time','content']));
				nodelines.push(_opts);
			});
			$.data(target, 'nodeline').options = $.extend({}, opts, {nodelines: nodelines});
		}
		$(target).empty();
		nodeline.css({width: opts.width, height: opts.height});
		
		let t = nodeline.find('.nodeline');
		t.removeClass('nodeline-normal nodeline-left nodeline-both').addClass('nodeline-' + opts.align);
		for (let i=0; i<nodelines.length; i++) {
			let el = createContent(nodelines[i]).appendTo(t);
			if (opts.align == 'both' && i%2 != 0) {
				let width = (nodeline.width() - 20) / 2 - 10;
				el.width(width);
			}
		}
	}
	/**
	 * 创建节点轴内容
	 */
	function createContent(opts) {
		let content = $('<dl>' + 
							'<dt>' +
								'<b></b>' +
								'<p></p>' + 
							'</dt>' +
							'<dd tabindex="-1"></dd>' + 
						'</dl>');
		if (opts.color && opts.color != 'default') {
			content.addClass('nodeline-node-' + opts.color);
		}
		content.find('b').text(opts.label);
		content.find('p').text(opts.time).attr('title', opts.time);
		content.find('dd').text(opts.content);
		
		content.find('b').bind('mouseover', function() {
			if(!$(this).parent().parent().find('dd').hasClass('nodeline-focused')) {
				$(this).parent().parent().find('dd').addClass('nodeline-focused');
			}
		}).bind('mouseout', function() {
			$(this).parent().parent().find('dd').removeClass('nodeline-focused');
		});
		
		content.find('dd').bind('mouseover', function() {
			if(!$(this).hasClass('nodeline-focused')) {
				$(this).addClass('nodeline-focused');
			}
		}).bind('mouseout', function() {
			$(this).removeClass('nodeline-focused');
		});
		return content;
	}
	
	$.fn.nodeline = function(options, param) {
		if (typeof options == 'string') {
			let method = $.fn.nodeline.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			let state = $.data(this, 'nodeline');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'nodeline', {
					options: $.extend({}, $.fn.nodeline.defaults, $.fn.nodeline.parseOptions(this), options),
					nodeline: init(this)
				});
			}
			
			createNodeline(this);
		});
	};
	
	$.fn.nodeline.methods = {
		options: function(jq) {
			return $.data(jq[0], 'nodeline').options;
		},
		resize: function(jq, param) {
			return jq.each(function() {
				let options = $.data(jq[0], 'nodeline');
				let opts = options.options;
				let nodeline = options.nodeline;
				if (param.width) {
					nodeline.width(param.width);
					opts.width = param.width;
					if (opts.align == 'both') {
						var width = (nodeline.width() - 20) / 2 - 10;
						nodeline.find('dl:odd').width(width);
					}
				}
				if (param.height) {
					nodeline.height(param.height);
					opts.height = param.height;
				}
			});
		},
		addNodeline: function(jq, param) {
			return jq.each(function() {
				let options = $.data(jq[0], 'nodeline');
				let opts = options.options;
				let nodeline = options.nodeline;
				let t = nodeline.find('.nodeline');
				let el = createContent(param).appendTo(t);
				if (opts.align == 'both') {
					let width = (nodeline.width() - 20) / 2 - 10;
					el.width(width);
				}
			});
		}
	};
	
	$.fn.nodeline.parseOptions = function(target) {
		let t = $(target);
		return $.extend({}, $.parser.parseOptions(target, ['id','width','height','align']));
	};
	
	$.fn.nodeline.defaults = {
		id: null,
		width: 'auto',
		height: 'auto',
		align: 'normal' // normal,left,both
	};
})(jQuery);