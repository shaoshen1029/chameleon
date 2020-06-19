package onem.shaoshen.chameleon.router.service;

import onem.shaoshen.chameleon.router.machine.RouterMachine;
import onem.shaoshen.chameleon.router.metadata.KidnapModel;
import onem.shaoshen.chameleon.router.repository.KidnapRepository;
import onem.shaoshen.chameleon.router.util.RegexUtil;
import onem.shaoshen.chameleon.router.util.SequenceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Optional;

/**
 * 劫持Service
 *
 * @author shaoshen
 */
@Service
@Qualifier("kidnapServiceImpl")
public class KidnapServiceImpl implements KidnapService {

    @Autowired
    private KidnapRepository kidnapRepository;

    @Autowired
    private SequenceUtil sequenceUtil;

    @Override
    public List<KidnapModel> queryKidnaps() {
        return kidnapRepository.findAll();
    }

    @Override
    public void addKidnap(KidnapModel model) {
        List<KidnapModel> kidnaps = kidnapRepository.findByPathAndMethod(model.getPath(), model.getMethod());
        if (CollectionUtils.isEmpty(kidnaps)) {
            model.setId(String.valueOf(sequenceUtil.nextId()));
            model.setRegex(RegexUtil.buildRegexMapping(model.getPath()));
            kidnapRepository.save(model);
        } else {
            KidnapModel kidnap = kidnaps.get(0);
            kidnap.setSchema(model.getSchema());
            kidnap.setHost(model.getHost());
            kidnap.setPort(model.getPort());
            this.updKidnap(kidnap);
        }
        RouterMachine.INSTANCE.register(model.getRegex(), model);
    }

    @Override
    public void updKidnap(KidnapModel model) {
        kidnapRepository.save(model);
        RouterMachine.INSTANCE.register(model.getRegex(), model);
    }

    @Override
    public void delKidnap(List<String> list) {
        for (String id : list) {
            Optional<KidnapModel> model = kidnapRepository.findById(id);
            String regex = model.map(KidnapModel::getRegex).orElse("");
            kidnapRepository.deleteById(id);
            RouterMachine.INSTANCE.remove(regex);
        }
    }

}
