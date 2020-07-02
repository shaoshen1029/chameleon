package onem.shaoshen.chameleon.router.controller;

import onem.shaoshen.chameleon.router.global.GlobalThreadLocal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * 页面Controller
 *
 * @author shaoshen
 */
@Controller
public class PageController {

    @RequestMapping("/index")
    public String index(Model model) {
        model.addAttribute("basePath", getBasePath());
        return "index";
    }

    private String getBasePath() {
        HttpServletRequest request = GlobalThreadLocal.getRequest();
        String serverPort = "";
        if (request.getServerPort() != 0) {
            serverPort = ":" + request.getServerPort();
        }
        return request.getScheme() + "://" + request.getServerName() + serverPort + request.getContextPath();
    }
}
