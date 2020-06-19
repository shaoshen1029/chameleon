package onem.shaoshen.chameleon.router.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * JSON工具类
 *
 * @author shaoshen
 */
public final class JsonUtil {

    /**
     * 私有构造函数
     *
     * @author shaoshen
     */
    private JsonUtil() {
    }

    /**
     * 序列化
     *
     * @param obj 序列化对象
     * @return java.lang.String
     * @author shaoshen
     */
    public static String toJson(Object obj) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Serialization object failed", e);
        }
    }

    /**
     * 反序列化
     *
     * @param json  反序列化Json
     * @param clazz 反序列化对象类型
     * @return T
     * @author shaoshen
     */
    public static <T> T toObject(String json, Class<T> clazz) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, clazz);
        } catch (IOException e) {
            throw new RuntimeException("Deserialization object failed", e);
        }
    }

    /**
     * 反序列化
     *
     * @param json      反序列化Json
     * @param reference 反序列化对象类型
     * @return T
     * @author shaoshen
     */
    public static <T> T toObject(String json, TypeReference<T> reference) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, reference);
        } catch (IOException e) {
            throw new RuntimeException("Deserialization object failed", e);
        }
    }

    /**
     * 对象转换
     *
     * @param object 待序列化对象
     * @param clazz  反序列化对象类型
     * @return T
     * @author shaoshen
     */
    public static <T> T toObject(Object object, Class<T> clazz) {
        return JsonUtil.toObject(JsonUtil.toJson(object), clazz);
    }

    /**
     * 格式化Json
     *
     * @param json json对象
     * @return java.lang.String
     * @author shaoshen
     */
    public static String formatJson(String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Object obj = mapper.readValue(json, Object.class);
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
        } catch (IOException e) {
            throw new RuntimeException("Format json failed", e);
        }
    }

}
