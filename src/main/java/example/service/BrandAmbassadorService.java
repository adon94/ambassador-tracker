package example.service;

import example.model.BrandAmbassadorDO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BrandAmbassadorService {

    void create(BrandAmbassadorDO employeeDO) throws Exception;
    ResponseEntity<BrandAmbassadorDO> login(BrandAmbassadorDO user) throws Exception;
    BrandAmbassadorDO view(Long id) throws Exception;
    List<BrandAmbassadorDO> getAll() throws Exception;
    void removeBrandAmbassador(Long id) throws Exception;

}
