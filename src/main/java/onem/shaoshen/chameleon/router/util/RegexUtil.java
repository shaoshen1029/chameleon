package onem.shaoshen.chameleon.router.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 正则工具类
 *
 * @author shaoshen
 */
public final class RegexUtil {

    /**
     * 构建正则映射
     *
     * @param mapping 映射路径
     * @return java.lang.String
     * @author shaoshen
     */
    public static String buildRegexMapping(String mapping) {
        String regex = mapping.replaceAll("(\\{\\S+})", "\\\\S+");
        return "^" + regex + "/*$";
    }

    /**
     * 匹配正则
     *
     * @param url   URL
     * @param regex 正则
     * @return boolean
     * @author shaoshen
     */
    public static boolean match(String url, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(url);
        return matcher.find();
    }

}
