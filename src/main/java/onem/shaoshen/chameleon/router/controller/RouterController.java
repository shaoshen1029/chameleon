package onem.shaoshen.chameleon.router.controller;

import com.google.common.base.Splitter;
import onem.shaoshen.chameleon.router.metadata.KidnapModel;
import onem.shaoshen.chameleon.router.metadata.ResponseModel;
import onem.shaoshen.chameleon.router.service.KidnapService;
import onem.shaoshen.chameleon.router.service.RouterService;
import onem.shaoshen.chameleon.router.util.JsonUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 路由Controller
 *
 * @author shaoshen
 */
@Slf4j
@RestController
public class RouterController {

    @Autowired
    @Qualifier("routerServiceImpl")
    private RouterService routerService;

    @Autowired
    @Qualifier("kidnapServiceImpl")
    private KidnapService kidnapService;

    /**
     * 路由平台转发接口
     *
     * @return java.lang.String
     * @author shaoshen
     */
    @RequestMapping(value = "/**", headers = "access_token")
    public String router() {
        return routerService.router();
    }

    /**
     * 路由平台非注册转发接口
     *
     * @return java.lang.String
     * @author shaoshen
     */
    @GetMapping("/authentication/register")
    public String registerRouter() {
        return routerService.router();
    }

    @GetMapping("/kidnap")
    public String queryKidnap() {
        return JsonUtil.toJson(kidnapService.queryKidnaps());
    }

    @PostMapping("/kidnap")
    public String addKidnap(@RequestBody KidnapModel model) {
        kidnapService.addKidnap(model);
        return ResponseModel.renderResponseBody(200, null, true);
    }

    @PutMapping("/kidnap")
    public String updKidnap(@RequestBody KidnapModel model) {
        kidnapService.updKidnap(model);
        return ResponseModel.renderResponseBody(200, null, true);
    }

    @DeleteMapping("/kidnap/{id}")
    public String delKidnap(@PathVariable("id") String id) {
        List<String> list = Splitter.on(",").trimResults().omitEmptyStrings().splitToList(id);
        kidnapService.delKidnap(list);
        return ResponseModel.renderResponseBody(200, null, true);
    }

}
