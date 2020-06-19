package onem.shaoshen.chameleon.router.machine;

import onem.shaoshen.chameleon.router.metadata.KidnapModel;

import java.util.HashMap;
import java.util.Map;

/**
 * 路由机
 *
 * @author shaoshen
 */
public enum RouterMachine {

    INSTANCE;

    private Map<String, KidnapModel> machine;

    RouterMachine() {
        this.machine = new HashMap<>();
    }

    public void register(String key, KidnapModel value) {
        this.machine.put(key, value);
    }

    public void remove(String key) {
        this.machine.remove(key);
    }

    public Map<String, KidnapModel> machine() {
        return this.machine;
    }
}
