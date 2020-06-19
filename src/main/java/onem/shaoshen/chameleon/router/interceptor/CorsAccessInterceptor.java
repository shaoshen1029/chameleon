package onem.shaoshen.chameleon.router.interceptor;

import com.google.common.base.Joiner;
import com.google.common.base.Strings;
import onem.shaoshen.chameleon.router.constant.SystemConstant;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 跨域访问拦截器
 *
 * @author shaoshen
 */
public class CorsAccessInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        response.setHeader("Access-Control-Allow-Origin", getOrigin(request));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", getAllowHeaders());
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
        response.setHeader("Access-Control-Expose-Headers", getExposeHeaders());
        response.setHeader("Vary", "Origin,Access-Control-Request-Method,Access-Control-Request-Headers");
        response.setHeader("Content-Type", "text/html;charset=UTF-8");
        if (isRequestMethodOptions(request)) {
            String milliOneDay = "86400";
            response.setHeader("Access-Control-Max-Age", milliOneDay);
        }
        return true;
    }

    /**
     * 是否为OPTIONS类型请求
     *
     * @param request 请求
     * @return boolean
     * @author shaoshen
     */
    private static boolean isRequestMethodOptions(HttpServletRequest request) {
        return request.getMethod().equalsIgnoreCase(RequestMethod.OPTIONS.name());
    }

    private String getOrigin(HttpServletRequest request) {
        return Strings.isNullOrEmpty(request.getHeader("Origin")) ? "" : request.getHeader("Origin");
    }

    private String getAllowHeaders() {
        String accessTokenKey = SystemConstant.SYS_ACCESS_TOKEN;
        String localeLanguage = SystemConstant.SYS_LOCALE_LANGUAGE;
        String idempotencyTokenKey = SystemConstant.SYS_IDEMPOTENCY_TOKEN;
        return Joiner.on(",").join(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                accessTokenKey,
                localeLanguage,
                idempotencyTokenKey);
    }

    private String getExposeHeaders() {
        return Joiner.on(",").join(
                "X-forwarded-port",
                "X-forwarded-host",
                "Content-Disposition",
                "File-Name",
                "Code");
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {

    }
}
