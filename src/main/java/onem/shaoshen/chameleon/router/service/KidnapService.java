package onem.shaoshen.chameleon.router.service;

import onem.shaoshen.chameleon.router.metadata.KidnapModel;

import java.util.List;

/**
 * 劫持Service接口
 *
 * @author shaoshen
 */
public interface KidnapService {

    List<KidnapModel> queryKidnaps();

    void addKidnap(KidnapModel model);

    void updKidnap(KidnapModel model);

    void delKidnap(List<String> list);

}
