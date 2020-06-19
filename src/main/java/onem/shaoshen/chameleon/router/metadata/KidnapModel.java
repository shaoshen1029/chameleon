package onem.shaoshen.chameleon.router.metadata;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * 劫持模型
 *
 * @author shaoshen
 */
@Entity(name = "t_kidnap")
@Data
public class KidnapModel {

    @Id
    private String id;

    private String schema;

    private String method;

    private String host;

    private Integer port;

    private String path;

    private String regex;

}
