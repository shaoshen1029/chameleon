package onem.shaoshen.chameleon.router.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 路由参数
 *
 * @author shaoshen
 */
@Data
@Component
@ConfigurationProperties(prefix = "router")
public class RouterProperties {

    private String scheme;

    private String host;

    private Integer port;

    private Integer connectionTimeout;

    private Integer connectionRequestTimeout;

    private Integer socketTimeout;

    private Boolean redirects;

}
