package onem.shaoshen.chameleon.router.service;

import onem.shaoshen.chameleon.router.global.GlobalThreadLocal;
import onem.shaoshen.chameleon.router.metadata.RequestModel;
import onem.shaoshen.chameleon.router.metadata.ResponseModel;
import onem.shaoshen.chameleon.router.properties.RouterProperties;
import onem.shaoshen.chameleon.router.util.HttpUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.*;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.util.Enumeration;
import java.util.List;

/**
 * 路由Service实现类
 *
 * @author shaoshen
 */
@Slf4j
@Service
@Qualifier("routerServiceImpl")
public class RouterServiceImpl implements RouterService {

    @Autowired
    private RouterProperties routerProperties;

    @Override
    public String router() {
        HttpRequestBase http = buildHttp();
        try (
                CloseableHttpClient httpClient = HttpUtil.httpClient();
                CloseableHttpResponse response = httpClient.execute(http)
        ) {
            HttpEntity responseEntity = response.getEntity();
            if (responseEntity != null) {
                String result = EntityUtils.toString(responseEntity);
                log.info("Response body: {}", result);
                return result;
            }
        } catch (IOException e) {
            log.error("Router failed", e);
        }
        return ResponseModel.renderResponseBody(500, "Router failed", null);
    }

    private HttpRequestBase buildHttp() {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        String method = request.getMethod();
        if ("GET".equalsIgnoreCase(method)) {
            return buildHttpGet();
        } else if ("POST".equalsIgnoreCase(method)) {
            return buildHttpPost();
        } else if ("PUT".equalsIgnoreCase(method)) {
            return buildHttpPut();
        } else if ("DELETE".equalsIgnoreCase(method)) {
            return buildHttpDelete();
        } else {
            return buildHttpOptions();
        }
    }

    private HttpOptions buildHttpOptions() {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        RequestModel model = getRequestModel(request);
        URI uri = HttpUtil.buildUri(model);
        HttpOptions httpOptions = new HttpOptions(uri);
        setHeader(httpOptions);
        httpOptions.setConfig(HttpUtil.requestConfig(this.routerProperties));
        return httpOptions;
    }

    private HttpGet buildHttpGet() {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        List<NameValuePair> parameters = HttpUtil.getRequestParameters(request);
        RequestModel model = getRequestModel(request);
        URI uri = HttpUtil.buildUri(model, parameters);
        HttpGet httpGet = new HttpGet(uri);
        setHeader(httpGet);
        httpGet.setConfig(HttpUtil.requestConfig(this.routerProperties));
        return httpGet;
    }

    private HttpPost buildHttpPost() {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        RequestModel model = getRequestModel(request);
        URI uri = HttpUtil.buildUri(model);
        HttpPost httpPost = new HttpPost(uri);
        setHeader(httpPost);
        httpPost.setConfig(HttpUtil.requestConfig(this.routerProperties));
        httpPost.setEntity(HttpUtil.getRequestBody(request));
        return httpPost;
    }

    private HttpPut buildHttpPut() {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        RequestModel model = getRequestModel(request);
        URI uri = HttpUtil.buildUri(model);
        HttpPut httpPut = new HttpPut(uri);
        setHeader(httpPut);
        httpPut.setConfig(HttpUtil.requestConfig(this.routerProperties));
        httpPut.setEntity(HttpUtil.getRequestBody(request));
        return httpPut;
    }

    private HttpDelete buildHttpDelete() {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        RequestModel model = getRequestModel(request);
        URI uri = HttpUtil.buildUri(model);
        HttpDelete httpDelete = new HttpDelete(uri);
        setHeader(httpDelete);
        httpDelete.setConfig(HttpUtil.requestConfig(this.routerProperties));
        return httpDelete;
    }

    private RequestModel getRequestModel(HttpServletRequest request) {
        RequestModel model = new RequestModel();
        model.setSchema(this.routerProperties.getScheme());
        model.setMethod(request.getMethod());
        model.setHost(this.routerProperties.getHost());
        model.setPort(this.routerProperties.getPort());
        model.setPath(request.getRequestURI());
        return model;
    }

    /**
     * 设置请求头部
     *
     * @param httpRequest 请求
     * @return void
     * @author shaoshen
     */
    private void setHeader(HttpRequestBase httpRequest) {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = headerNames.nextElement();
            String value = request.getHeader(key);
            if ("Content-Length".equalsIgnoreCase(key)) {
                continue;
            }
            httpRequest.setHeader(new BasicHeader(key, value));
        }
    }

}
