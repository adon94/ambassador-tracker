package example.service;

import example.model.BaList;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BaListService {
    void create(BaList list) throws Exception;
    BaList view(Long id) throws Exception;
    List<BaList> getAll() throws Exception;
    void removeJob(Long id) throws Exception;
    List<BaList> findByEmployeeId(Long id) throws Exception;
}
