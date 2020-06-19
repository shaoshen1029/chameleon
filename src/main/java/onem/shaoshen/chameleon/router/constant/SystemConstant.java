package onem.shaoshen.chameleon.router.constant;

/**
 * 系统常量
 *
 * @author shaoshen
 */
public class SystemConstant {

    /**
     * 系统访问令牌句柄
     */
    public static final String SYS_ACCESS_TOKEN = "access_token";
    /**
     * 系统国际化语言句柄
     */
    public static final String SYS_LOCALE_LANGUAGE = "locale_language";
    /**
     * 系统幂等性票据句柄
     */
    public static final String SYS_IDEMPOTENCY_TOKEN = "idempotency_token";
    /**
     * 系统分布式Session前缀句柄
     */
    public static final String SYS_CACHE_SESSION_PREFIX = "session:";
    /**
     * 系统分布式幂等性票据前缀句柄
     */
    public static final String SYS_CACHE_IDEMPOTENCY_PREFIX = "idempotency:";
    /**
     * 系统全局配置参数句柄
     */
    public static final String SYS_GLOBAL_CONFIGURATION_PROPERTIES = "global:system_configuration_properties";
    /**
     * 系统全局资源信息句柄
     */
    public static final String SYS_GLOBAL_RESOURCES = "global:resources";
    /**
     * 插槽状态信息句柄
     */
    public static final String SLOT_STATE_KEY = "slot:";
    /**
     * ThreadLocal ApplicationContext句柄
     */
    public static final String SYS_THREADLOCAL_APPLICATIONCONTEXT = "sys_threadlocal_applicationcontext";
    /**
     * ThreadLocal Request句柄
     */
    public static final String SYS_THREADLOCAL_REQUEST = "sys_threadlocal_request";
    /**
     * ThreadLocal Response句柄
     */
    public static final String SYS_THREADLOCAL_RESPONSE = "sys_threadlocal_response";
    /**
     * ThreadLocal 分页信息句柄
     */
    public static final String SYS_THREADLOCAL_PAGE_INFO = "sys_threadlocal_page_info";
    /**
     * 账号锁定策略句柄
     */
    public static final String SYS_STRATEGY_ACCOUNT_LOCK = "sys_strategy_account_lock";
}
