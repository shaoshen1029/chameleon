/**
 * 整数数字正则验证
 */
function sq_number_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var exp = /^[0-9]*$/;
	var reg = val.match(exp);
	if (reg == null) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '输入的整数不合法';
	}
	return obj;
}

function _sq_ipv6_validate(str) {
	return /::/.test(str) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i
			.test(str) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
	;
}

/**
 * ipv6正则表达式验证
 */
function sq_ipv6_validate(ipstr) {
	var obj = {
		result : true,
		msg : ''
	};
	var f = _sq_ipv6_validate(ipstr);
	if (f == false) {
		obj.result = false;
		obj.msg = '输入的IPv6地址不合法';
	}
	return obj;
}

/**
 * ipv4的正则表达式验证 
 */
function sq_ipv4_validate(ipstr) {
	var obj = {
		result : true,
		msg : ''
	};
	var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	var reg = ipstr.match(exp);
	if (reg == null) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '输入的IPv4地址不合法';
	}
	return obj;
}

/**
 * ip验证
 */
function sq_ip_validate(ipstr) {
	var obj = {
		result : true,
		msg : ''
	};
	var v1 = sq_ipv4_validate(ipstr);
	var v2 = sq_ipv6_validate(ipstr);
	if (v1.result == false && v2.result == false) {
		obj.result = false;
		obj.msg = '输入的IP地址不合法';
	}
	return obj;
}

/**
 * 验证字符串长度的方法
 */
function sq_strLength_validate(str, len) {
	var obj = {
		result : true,
		msg : ''
	};
	if (str != null && str.length > 0) {
		if (str.length > len) {
			obj.result = false;
			obj.msg = '字符长度超出范围，长度不能大于' + len;
		}
	} else {
		obj.result = false;
		obj.msg = '字符长度验证异常，字符串为空。';
	}
	return obj;
}

/**
 * 密码验证正则表达式 
 */
function sq_password_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	if (val != null && val != "" && val.length > 0) {
		var ls = 0;

		if (val.match(/([a-z])+/)) {
			ls++;
		}

		if (val.match(/([0-9])+/)) {
			ls++;
		}

		if (val.match(/([A-Z])+/)) {
			ls++;
		}

		if (val.match(/[^a-zA-Z0-9]+/)) {
			ls++;
		}

		if (ls < 4) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '密码必须包含大小写字母、数字、特殊字符。';
	}
	return obj;
}

/**
 * 输入框1的正则表达式 标题校验
 */
function sq_input1_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9-_])*$');
	if (val != null && val != "" && val.length > 0) {
		var reghead = /^[-_]/;
		var reglast = /[-_]$/;
		var t1 = reghead.test(val);
		var t2 = reglast.test(val);

		// 验证-和_是否在两头出现
		if (!t1 && !t2) {
			if (!regx.test(val)) {
				obj.result = false;
			}
		} else {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“_”、“-”符号，且“_”和“-”只能位于中间位置。';
	}
	return obj;
}
/**
 * 输入框2的正则表达式
 */
function sq_input2_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9-_])*$');

	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“_”、“-”符号';
	}
	return obj;
}
/**
 * 输入框3的正则表达式 备注校验
 */
function sq_input3_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9-_()])*$');
	if (val != null && val != "" && val.length > 0) {
		var reghead = /^[-_]/;
		var reglast = /[-_]$/;
		var t1 = reghead.test(val);
		var t2 = reglast.test(val);

		// 验证-和_是否在两头出现
		if (!t1 && !t2) {
			if (!regx.test(val)) {
				obj.result = false;
			}
		} else {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“_”、“-”、“(”、“)”符号，且“_”和“-”只能位于中间位置。';
	}
	return obj;
}
/**
 * 输入框4的正则表达式 标题校验
 */
function sq_input4_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9-_\\/])*$');
	if (val != null && val != "" && val.length > 0) {
		var reghead = /^[-_\/]/;
		var reglast = /[-_\/]$/;
		var t1 = reghead.test(val);
		var t2 = reglast.test(val);

		// 验证-、_和/是否在两头出现
		if (!t1 && !t2) {
			if (!regx.test(val)) {
				obj.result = false;
			}
		} else {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“_”、“-”、“/”符号，且“_”、“-”和“/”只能位于中间位置。';
	}
	return obj;
}
/**
 * 账号输入框1的正则表达式
 */
function sq_accountInput1_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9-_.])*$/;
	if (val != null && val != "" && val.length > 0) {
		var reghead = /^[-_.]/;
		var reglast = /[-_.]$/;
		var t1 = reghead.test(val);
		var t2 = reglast.test(val);
		// 验证-和_是否在两头出现
		if (!t1 && !t2) {
			if (!regx.test(val)) {
				obj.result = false;
			}
		} else {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、数字和“_”、“-”、“.”符号，且“_”、“-”、“.”只能位于中间位置。';
	}
	return obj;
}

/**
 * 账号输入框2的正则表达式
 */
function sq_accountInput2_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9-_.])*$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、数字和“_”、“-”、“.”符号。';
	}
	return obj;
}

/**
 * 账号输入框3的正则表达式
 */
function sq_accountInput3_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9-_@.])*$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、数字和“_”、“-”、“@”、“.”符号。';
	}
	return obj;
}

/**
 * 名字输入框1的正则表达式
 */
function sq_nameInput1_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9-_.])*$');
	if (val != null && val != "" && val.length > 0) {
		var reghead = /^[-_.]/;
		var reglast = /[-_.]$/;
		var t1 = reghead.test(val);
		var t2 = reglast.test(val);
		// 验证-和_是否在两头出现
		if (!t1 && !t2) {
			if (!regx.test(val)) {
				obj.result = false;
			}
		} else {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“_”、“-”、“.”符号，且“_”、“-”、“.”只能位于中间位置。';
	}
	return obj;
}

/**
 * 名字输入框2的正则表达式
 */
function sq_nameInput2_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9-_.])*$');
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“_”、“-”、“.”符号。';
	}
	return obj;
}

/**
 * 名字输入框3的正则表达式
 */
function sq_nameInput3_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9-.])*$');
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“-”、“.”符号。';
	}
	return obj;
}

/**
 * 名字输入框4的正则表达式
 */
function sq_nameInput4_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9-.])*$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、数字、“-”、“.”符号。';
	}
	return obj;
}

/**
 * 时间输入框1 格式hh:mm:ss
 */
function sq_timeInput1_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '时间格式不正确，正确的格式是hh:mm:ss。';
	}

	return obj;
}

/**
 * 时间输入框2 格式hh:mm
 */
function sq_timeInput2_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([0-1]\d|2[0-3]):[0-5]\d$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '时间格式不正确，正确的格式是hh:mm。';
	}
	return obj;
}
/**
 * mac地址输入框表达式
 */
function sq_macInput_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = 'Mac地址格式不正确。例如：00:00:00:00:00:00。';
	}
	return obj;
}

/**
 * email输入框的验证函数(查询中)
 */
function sq_emailInputSearch_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^[a-zA-Z-0-9-_.]*@?[a-zA-Z-0-9-_.]*$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	var errorMsg = '邮件格式不正确，该处用于查询因此最多有一个@符号，且@符号出现的位置可以是任意一个位置，也可以没有@符号。';
	if (!obj.result) {
		obj.msg = errorMsg;
	}

	return obj;
}

/**
 * email输入框的验证函数(非查询)
 */
function sq_emailInput_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '邮件格式不正确';
	}
	return obj;
}

/**
 * email输入框的验证函数(可以输入多个email的正则表达式函数，分隔符为半角分号)
 */
function sq_emailMoreInput_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if (val != null && val != "" && val.length > 0) {
		if (val.indexOf(";") == -1) {
			if (!regx.test(val)) {
				obj.result = false;
			}
		} else {
			var emails = val.split(";");
			var len = emails.length;
			for ( var i = 0; i < len; i++) {
				if (i != len - 1) {
					if (emails[i] == null || emails[i] == "") {
						obj.result = false;
						break;
					} else {
						if (!regx.test(emails[i])) {
							obj.result = false;
							break;
						}
					}
				} else {
					if (!regx.test(emails[i])) {
						obj.result = false;
						break;
					}
				}
			}
		}
	}
	if (!result) {
		obj.msg = '邮件格式不正确';
	}
	return obj;
}
/**
 * 验证码输入框验证函数
 */
function sq_captcha_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^[0-9a-zA-Z]*$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '验证码格式不正确，只能输入数字和英文。';
	}
	return obj;
}
/**
 * 端口的验证表达式方法
 */
function sq_portInput_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([0-9]|[1-9][0-9]{0,4})$/;
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		} else {
			var v = parseInt(val);
			if (v < 1 || v > 65535) {
				obj.result = false;
			}
		}
	}
	if (!obj.result) {
		obj.msg = '端口格式不正确，只能输入1~65535之间的整数。';
	}
	return obj;
}
/**
 * 手机输入框验证函数
 */
function sq_mobile_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	// 获取国际化正则表达式资源。正则表达式中含有{}时,只能通过获取字符串方式取值。并将字符串中\\转移字符替换为空
	var regx = new RegExp('(^0{0,1}(13|15|18)[0-9]{9}$)');
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '手机号码格式不正确，只能输入数字并且最大长度为20。';
	}
	return obj;
}
/**
 * 固定电话输入框验证函数
 */
function sq_telphone_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	// 获取国际化正则表达式资源。正则表达式中含有{}时,只能通过获取字符串方式取值。并将字符串中\\转移字符替换为空
	var regx = new RegExp('^[0-9()-]{1,20}$');
	if (val != null && val != "" && val.length > 0) {
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	if (!obj.result) {
		obj.msg = '固定电话格式不正确，正确格式如下:<br><li>如果没有区号，电话号码为3到8位。例如23928485</li><li>如果有区号用半角\\"-\\"隔开。例如：024-23928485</li><li>如果有分机号，024-23928484-01</li>';
	}
	return obj;
}

/**
 * 服务器输入框验证函数
 */
function sq_ip_or_dns_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	if (val != null && val != "" && val.length > 0) {
		var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
				+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
				+ "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
				+ "|" // 允许IP和DOMAIN（域名）
				+ "([0-9a-z_!~*'()-]+.)+" // 域名- www.
				+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
				+ "[a-z]{2,6})" // first level domain- .com or .museum
				+ "(:[0-9]{1,4})?" // 端口- :80
				+ "((/?)|" // a slash isn't required if there is no file name
				+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";

		var regx = new RegExp(strRegex);
		if (!regx.test(val)) {
			obj.result = false;
		}
	}
	var errorMsg = '服务器格式不正确，应该为域名或IP地址。';
	if (!obj.result) {
		obj.msg = errorMsg;
	}
	return obj;
}

/**
 * url的正则表达式函数
 */
function sq_url_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	if (val != null && val != "" && val.length > 0) {
		var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
				+ "+(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
				+ "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
				+ "|" // 允许IP和DOMAIN（域名）
				+ "([0-9a-zA-Z_!~*'()-]+.)+" // 域名- www.
				+ "([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-z]." // 二级域名
				+ "[a-zA-Z]{2,6})" // first level domain- .com or .museum
				+ "(:[0-9]{1,5})?" // 端口- :80
				+ "((/+)|" // a slash isn't required if there is no file name
				+ "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/*)$";

		var regx = new RegExp(strRegex);
		if (!regx.test(val)) {
			obj.result = false;
		} else {
			var valArr = val.split("://");
			var tmpVal = valArr[1];
			var mhp = tmpVal.indexOf(":");
			if (mhp != -1) {
				var xxp = tmpVal.indexOf("/");
				var port = parseInt(tmpVal.substring(mhp + 1, xxp));
				if (port < 1 || port > 65535) {
					obj.result = false;
				}
			}
		}
	}
	if (!obj.result) {
		obj.msg = 'url格式不正确，如：http://www.baidu.com/';
	}
	return obj;
}

/**
 * 分隔符正则表达式函数
 * 
 * @param val
 * @description 只允许输入字母、“|”符号，且“|”只能位于中间位置
 */
function sq_split1_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z]+\|)+([a-zA-Z]+)$/;
	if (!regx.test(val)) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、“|”符号，且“|”只能位于中间位置。';
	}
	return obj;
}

/**
 * 分隔符正则表达式函数
 * 
 * @param val
 * @description 只允许输入字母、数字、“|”符号，且“|”只能位于中间位置
 */
function sq_split2_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9]+\|)+([a-zA-Z0-9]+)$/;
	if (!regx.test(val)) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、数字、“|”符号，且“|”只能位于中间位置。';
	}
	return obj;
}

/**
 * 分隔符正则表达式函数
 * 
 * @param val
 * @description 只允许输入汉字、字母、数字、“|”符号，且“|”只能位于中间位置
 */
function sq_split3_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9]+\\|)+([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9]+)$');
	if (!regx.test(val)) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“|”符号，且“|”只能位于中间位置。';
	}
	return obj;
}

/**
 * 分隔符正则表达式函数
 * 
 * @param val
 * @description 只允许输入字母、“,”符号，且“,”只能位于中间位置
 */
function sq_split4_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z]+,)+([a-zA-Z]+)$/;
	if (!regx.test(val)) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、“,”符号，且“,”只能位于中间位置。';
	}
	return obj;
}

/**
 * 分隔符正则表达式函数
 * 
 * @param val
 * @description 只允许输入字母、数字、“,”符号，且“,”只能位于中间位置
 */
function sq_split5_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = /^([a-zA-Z0-9]+,)+([a-zA-Z0-9]+)$/;
	if (!regx.test(val)) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '只允许输入字母、数字、“,”符号，且“,”只能位于中间位置。';
	}
	return obj;
}

/**
 * 分隔符正则表达式函数
 * 
 * @param val
 * @description 只允许输入汉字、字母、数字、“,”符号，且“,”只能位于中间位置
 */
function sq_split6_validate(val) {
	var obj = {
		result : true,
		msg : ''
	};
	var regx = new RegExp('^([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9]+,)+([\u4e00-\u9fa5]|[\ufe30-\uffa0]|[a-zA-Z0-9]+)$');
	if (!regx.test(val)) {
		obj.result = false;
	}
	if (!obj.result) {
		obj.msg = '只允许输入汉字、字母、数字、“,”符号，且“,”只能位于中间位置。';
	}
	return obj;
}