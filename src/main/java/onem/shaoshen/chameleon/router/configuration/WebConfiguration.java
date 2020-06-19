package onem.shaoshen.chameleon.router.configuration;

import onem.shaoshen.chameleon.router.interceptor.CommonInterceptor;
import onem.shaoshen.chameleon.router.interceptor.CorsAccessInterceptor;
import onem.shaoshen.chameleon.router.util.SequenceUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * WEB配置类
 *
 * @author shaoshen
 */
@Configuration
public class WebConfiguration extends WebMvcConfigurationSupport {

    /**
     * 字符串转换器
     *
     * @return org.springframework.http.converter.HttpMessageConverter<java.lang.String>
     * @author shaoshen
     */
    @Bean
    public HttpMessageConverter<String> responseBodyConverter() {
        return new StringHttpMessageConverter(StandardCharsets.UTF_8);
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(responseBodyConverter());
        super.addDefaultHttpMessageConverters(converters);
    }

    @Bean
    CommonInterceptor commonInterceptor() {
        return new CommonInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new CorsAccessInterceptor()).addPathPatterns("/**");
        registry.addInterceptor(commonInterceptor()).addPathPatterns("/**");
    }

    @Bean
    public SequenceUtil sequenceUtil() {
        return new SequenceUtil(0, 0);
    }

}
