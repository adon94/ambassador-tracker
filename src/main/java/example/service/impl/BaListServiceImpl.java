package example.service.impl;

import example.dao.BaListDAO;
import example.model.BaList;
import example.service.BaListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class BaListServiceImpl implements BaListService {

    private BaListDAO baListDAO;

    @Autowired
    public void setBaListDAO(BaListDAO baListDAO) {
        this.baListDAO = baListDAO;
    }

    @Override
    public void create(BaList list) throws Exception {
        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());

//        if(!exists) {
            list.setCreatedAt(timestamp.toString());
//        }

        list.setUpdatedAt(timestamp.toString());
        baListDAO.save(list);
    }

    @Override
    public BaList view(Long id) throws Exception {
        return baListDAO.findOne(id);
    }

    @Override
    public List<BaList> getAll() throws Exception {
        return (List<BaList>) baListDAO.findAll();
    }

    @Override
    public void removeJob(Long id) throws Exception {
        baListDAO.delete(id);
    }

    @Override
    public List<BaList> findByEmployeeId(Long id) throws Exception {
        return baListDAO.findByEmployeeId(id);
    }
}
