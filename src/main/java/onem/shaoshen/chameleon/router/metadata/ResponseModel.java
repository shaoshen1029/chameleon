package onem.shaoshen.chameleon.router.metadata;

import onem.shaoshen.chameleon.router.util.JsonUtil;
import lombok.Data;

import java.io.Serializable;

/**
 * 响应数据模型
 *
 * @author shaoshen
 */
@Data
public class ResponseModel implements Serializable {

    /**
     * UUID
     */
    private static final long serialVersionUID = -7932489062872577054L;

    /**
     * 构造函数
     *
     * @author shaoshen
     */
    public ResponseModel() {

    }

    /**
     * 构造函数
     *
     * @param code    响应码
     * @param message 响应信息
     * @param data    响应数据
     * @author shaoshen
     */
    public ResponseModel(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 响应码
     */
    private int code;

    /**
     * 响应信息
     */
    private String message;

    /**
     * 响应参数
     */
    private Object data;

    public static String renderResponseBody(int code, String message, Object param) {
        ResponseModel model = new ResponseModel(code, message, param);
        return JsonUtil.toJson(model);
    }
}
