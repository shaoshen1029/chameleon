package onem.shaoshen.chameleon.router.global;

import onem.shaoshen.chameleon.router.constant.SystemConstant;
import org.springframework.context.ApplicationContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

/**
 * 全局信息ThreadLocal共享类
 *
 * @author shaoshen
 */
public class GlobalThreadLocal {

    /**
     * ThreadLocal共享实体
     */
    private static ThreadLocal<Map<String, Object>> threadlocal = new ThreadLocal<>();

    /**
     * 获取ThreadLocal内容
     *
     * @return java.util.Map<java.lang.String, java.lang.Object>
     * @author shaoshen
     */
    public static Map<String, Object> getValue() {
        Map<String, Object> param = threadlocal.get();
        if (param == null) {
            param = new HashMap<>();
        }
        return param;
    }

    /**
     * 设置ThreadLocal内容
     *
     * @param param 参数对象
     * @return void
     * @author shaoshen
     */
    public static void setValue(Map<String, Object> param) {
        threadlocal.set(param);
    }

    /**
     * 从ThreadLocal中获取ApplicationContext对象
     *
     * @return org.springframework.context.ApplicationContext
     * @author shaoshen
     */
    public static ApplicationContext getApplicationContext() {
        return (ApplicationContext) getValue().get(SystemConstant.SYS_THREADLOCAL_APPLICATIONCONTEXT);
    }

    /**
     * 从ThreadLocal中获取request对象
     *
     * @return javax.servlet.http.HttpServletRequest
     * @author shaoshen
     */
    public static HttpServletRequest getRequest() {
        return (HttpServletRequest) getValue().get(SystemConstant.SYS_THREADLOCAL_REQUEST);
    }

    /**
     * 从ThreadLocal中获取response对象
     *
     * @return javax.servlet.http.HttpServletResponse
     * @author shaoshen
     */
    public static HttpServletResponse getResponse() {
        return (HttpServletResponse) getValue().get(SystemConstant.SYS_THREADLOCAL_RESPONSE);
    }

    /**
     * 从ThreadLocal中获取Locale对象
     *
     * @return Locale
     * @author shaoshen
     */
    public static Locale getLocale() {
        return Optional.ofNullable(getValue().get(SystemConstant.SYS_LOCALE_LANGUAGE))
                .map(i -> (Locale) i)
                .orElse(Locale.getDefault());
    }

    /**
     * 移除ThreadLocal内容
     *
     * @return void
     * @author shaoshen
     */
    public static void remove() {
        threadlocal.remove();
    }
}
