/**
 * 消息窗口：自动关闭窗口
 */
(function($) {
	/**
	 * 创建窗口
	 */
	function create(options) {
		let bodyEl = $("<div class=\"messager-body\"></div>").appendTo("body");
		let opts = $.extend({}, options, {noheader: options.title ? false : true, minHeight: 115});
		return bodyEl.dialog(opts);
	}
	/**
	 * 关闭窗口
	 */
	function close(dlg) {
		dlg.dialog('destroy');
	}
	$.extend($.messager, {
		auto: function(options) {
			const defaultsOptions = {
				'title': '提示',
				'msg': '', 
				'icon': 'info',
				'closable': false,
				'autoClose': 1500,
				'onClose': function() {}
			};
			let opts = $.extend({}, defaultsOptions, options);
			let cls = opts.icon ? "messager-icon messager-" + opts.icon : "";
			opts = $.extend({},
				$.messager.defaults,
				{content:"<div class=\"" + cls + "\"></div>" + "<div>" + opts.msg + "</div>" + "<div style=\"clear:both;\"/>"},
				opts
			);
			let dlg = create(opts);
			if (opts.autoClose && typeof opts.autoClose == 'number') {
				setTimeout(function() {
					close(dlg);
					opts.onClose.call($(this));
				}, opts.autoClose);
			}
		}
	});
})(jQuery);