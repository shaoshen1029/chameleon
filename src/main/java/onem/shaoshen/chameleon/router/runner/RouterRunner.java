package onem.shaoshen.chameleon.router.runner;

import onem.shaoshen.chameleon.router.machine.RouterMachine;
import onem.shaoshen.chameleon.router.metadata.KidnapModel;
import onem.shaoshen.chameleon.router.service.KidnapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 路由启动器
 *
 * @author shaoshen
 */
@Component
@Order(1)
public class RouterRunner implements ApplicationRunner {

    @Autowired
    @Qualifier("kidnapServiceImpl")
    private KidnapService kidnapService;

    @Override
    public void run(ApplicationArguments args) {
        List<KidnapModel> models = kidnapService.queryKidnaps();
        for (KidnapModel model : models) {
            RouterMachine.INSTANCE.register(model.getRegex(), model);
        }
    }

}
