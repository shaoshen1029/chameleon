package onem.shaoshen.chameleon.router.interceptor;

import onem.shaoshen.chameleon.router.constant.SystemConstant;
import onem.shaoshen.chameleon.router.global.GlobalThreadLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 通用拦截器
 *
 * @author shaoshen
 */
public class CommonInterceptor implements HandlerInterceptor {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!isRequestMethodOptions(request)) {
            Map<String, Object> param = GlobalThreadLocal.getValue();
            param.put(SystemConstant.SYS_THREADLOCAL_APPLICATIONCONTEXT, webApplicationContext);
            param.put(SystemConstant.SYS_THREADLOCAL_REQUEST, request);
            param.put(SystemConstant.SYS_THREADLOCAL_RESPONSE, response);
            GlobalThreadLocal.setValue(param);
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

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
    }
}
