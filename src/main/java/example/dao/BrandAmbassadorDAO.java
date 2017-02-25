package example.dao;

import example.model.BrandAmbassadorDO;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface BrandAmbassadorDAO extends CrudRepository<BrandAmbassadorDO, Long> {

//        void create(BrandAmbassadorDO employeeDO) throws Exception;
//        BrandAmbassadorDO view(int id) throws Exception;
//        List<BrandAmbassadorDO> getAll() throws Exception;
//        void removeBrandAmbassador(int id) throws Exception;
        List<BrandAmbassadorDO> findByEmail(String email);
}
