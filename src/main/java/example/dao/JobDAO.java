package example.dao;

import example.model.JobDO;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface JobDAO extends CrudRepository<JobDO, Long> {
//    void create(JobDO employeeDO) throws Exception;
//    JobDO view(int id) throws Exception;
//    List<JobDO> getAll() throws Exception;
//    void removeJob(int id) throws Exception;
    List<JobDO> findByInvitedId(Long invited_id);
    List<JobDO> findByAcceptedId(Long accepted_id);
    List<JobDO> findByDeclinedId(Long declined_id);
    List<JobDO> findByEmployeeId(Long employee_id);
    List<JobDO> findOverlap(String startDate1, String endDate1);
}
