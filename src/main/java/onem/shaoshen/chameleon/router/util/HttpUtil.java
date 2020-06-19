package onem.shaoshen.chameleon.router.util;

import onem.shaoshen.chameleon.router.machine.RouterMachine;
import onem.shaoshen.chameleon.router.metadata.KidnapModel;
import onem.shaoshen.chameleon.router.metadata.RequestModel;
import onem.shaoshen.chameleon.router.properties.RouterProperties;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * Http工具类
 *
 * @author shaoshen
 */
@Slf4j
public final class HttpUtil {

    /**
     * 构造函数
     *
     * @author shaoshen
     */
    private HttpUtil() {
        throw new RuntimeException("Construct util failed");
    }

    /**
     * 获取Http客户端
     *
     * @return org.apache.http.impl.client.CloseableHttpClient
     * @author shaoshen
     */
    public static CloseableHttpClient httpClient() {
        return HttpClientBuilder.create().build();
    }

    /**
     * Get Request Parameters
     *
     * @param request 请求
     * @return java.util.List<org.apache.http.NameValuePair>
     * @author shaoshen
     */
    public static List<NameValuePair> getRequestParameters(HttpServletRequest request) {
        List<NameValuePair> parameters = new ArrayList<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String key = parameterNames.nextElement();
            String value = request.getParameter(key);
            parameters.add(new BasicNameValuePair(key, value));
        }
        return parameters;
    }

    /**
     * Get Request Body
     *
     * @param request 请求
     * @return java.lang.String
     * @author shaoshen
     */
    public static StringEntity getRequestBody(HttpServletRequest request) {
        StringBuilder parameters = new StringBuilder();
        try (
                BufferedReader reader = request.getReader();
        ) {
            String str;
            while ((str = reader.readLine()) != null) {
                parameters.append(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new StringEntity(parameters.toString(), "UTF-8");
    }

    /**
     * 获取请求配置参数
     *
     * @param properties 路由参数
     * @return org.apache.http.client.config.RequestConfig
     * @author shaoshen
     */
    public static RequestConfig requestConfig(RouterProperties properties) {
        return RequestConfig.custom()
                .setConnectTimeout(properties.getConnectionTimeout())
                .setConnectionRequestTimeout(properties.getConnectionRequestTimeout())
                .setSocketTimeout(properties.getSocketTimeout())
                .setRedirectsEnabled(properties.getRedirects())
                .build();
    }

    /**
     * 构建URI
     *
     * @param model 请求模型
     * @return java.net.URI
     * @author shaoshen
     */
    public static URI buildUri(RequestModel model) {
        return buildUri(model, new ArrayList<>());
    }

    /**
     * 构建URI
     *
     * @param model      请求模型
     * @param parameters 请求参数
     * @return java.net.URI
     * @author shaoshen
     */
    public static URI buildUri(RequestModel model, List<NameValuePair> parameters) {
        try {
            KidnapModel kidnap = null;
            for (Map.Entry<String, KidnapModel> entry : RouterMachine.INSTANCE.machine().entrySet()) {
                if (!RegexUtil.match(model.getPath(), entry.getKey())) {
                    continue;
                }
                if (entry.getValue().getMethod().equalsIgnoreCase(model.getMethod())) {
                    kidnap = entry.getValue();
                    break;
                }
            }
            String scheme;
            String host;
            int port;
            String path;
            if (Objects.isNull(kidnap)) {
                scheme = model.getSchema();
                host = model.getHost();
                port = model.getPort();
                path = model.getPath();
            } else {
                scheme = kidnap.getSchema();
                host = kidnap.getHost();
                port = kidnap.getPort();
                path = kidnap.getPath();
            }
            return new URIBuilder().setScheme(scheme)
                    .setHost(host)
                    .setPort(port)
                    .setPath(path)
                    .setParameters(parameters)
                    .build();
        } catch (URISyntaxException e) {
            log.error("Build uri failed", e);
            throw new RuntimeException("Build uri failed", e);
        }
    }

}
