package onem.shaoshen.chameleon.router.metadata;

import lombok.Data;

/**
 * 请求模型
 *
 * @author shaoshen
 */
@Data
public class RequestModel {

    private String schema;

    private String method;

    private String host;

    private Integer port;

    private String path;

}
