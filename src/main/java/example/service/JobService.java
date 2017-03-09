package example.service;

import example.model.JobDO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface JobService {
    void create(JobDO job) throws Exception;
    JobDO view(Long id) throws Exception;
    List<JobDO> getAll() throws Exception;
    void removeJob(Long id) throws Exception;
    List<JobDO> findByInvitedId(Long id) throws Exception;
    List<JobDO> findByAcceptedId(Long id) throws Exception;
    List<JobDO> findByDeclinedId(Long id) throws Exception;
    List<JobDO> findByEmployeeId(Long id) throws Exception;
    List<JobDO> findOverlappers(String startDate1, String endDate1) throws Exception;
    JobDO updateToAccepted(JobDO job, Long invitedId) throws Exception;
    JobDO updateToDeclined(JobDO job, Long invitedId) throws Exception;
}
