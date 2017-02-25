package example.service.impl;

import example.dao.BrandAmbassadorDAO;
import example.model.BrandAmbassadorDO;
import example.model.JobDO;
import example.service.BrandAmbassadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.ws.rs.core.Response;
import java.util.List;

@Service
public class BrandAmbassadorServiceImpl implements BrandAmbassadorService {

    private final BrandAmbassadorDAO brandAmbassadorDAO;

    @Autowired
    public BrandAmbassadorServiceImpl(BrandAmbassadorDAO brandAmbassadorDAO) {
        this.brandAmbassadorDAO = brandAmbassadorDAO;
    }

    @Override
    @Transactional
    public void create(BrandAmbassadorDO brandAmbassadorDO) throws Exception {
        brandAmbassadorDAO.save(brandAmbassadorDO);
    }

    @Override
    @Transactional
    public ResponseEntity<BrandAmbassadorDO> login(BrandAmbassadorDO user) throws Exception {
        List<BrandAmbassadorDO> bas = brandAmbassadorDAO.findByEmail(user.getEmail());
        BrandAmbassadorDO ba;
        if(!bas.isEmpty()) {
            ba = bas.get(0);
            if(ba.getPassword().equals(user.getPassword())){
                return new ResponseEntity<BrandAmbassadorDO>(ba, HttpStatus.OK);
            } else {
                return new ResponseEntity<BrandAmbassadorDO>(user, HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<BrandAmbassadorDO>(user, HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public BrandAmbassadorDO view(Long id) throws Exception {
        return brandAmbassadorDAO.findOne(id);
    }

    @Override
    @Transactional
    public List<BrandAmbassadorDO> getAll() throws Exception {
        return (List<BrandAmbassadorDO>) brandAmbassadorDAO.findAll();
    }

    @Override
    @Transactional
    public void removeBrandAmbassador(Long id) throws Exception {
        this.brandAmbassadorDAO.delete(id);
    }
}
