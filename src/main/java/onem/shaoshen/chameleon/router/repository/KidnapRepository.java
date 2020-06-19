package onem.shaoshen.chameleon.router.repository;

import onem.shaoshen.chameleon.router.metadata.KidnapModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 劫持Repository
 *
 * @author shaoshen
 */
@Repository
public interface KidnapRepository extends JpaRepository<KidnapModel, String> {

    List<KidnapModel> findByPathAndMethod(String path, String method);
}
