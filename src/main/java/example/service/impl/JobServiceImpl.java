package example.service.impl;

import example.dao.CompanyDAO;
import example.dao.JobDAO;
import example.model.BrandAmbassadorDO;
import example.model.Company;
import example.model.JobDO;
import example.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobDAO jobDAO;

    @Autowired
    public JobServiceImpl(JobDAO jobDAO) {
        this.jobDAO = jobDAO;
    }

    private CompanyDAO companyDAO;

    @Autowired
    public void setCompanyDAO(CompanyDAO companyDAO) {
        this.companyDAO = companyDAO;
    }

    @Override
    @Transactional
    public void create(JobDO jobDO) throws Exception {
        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());
        jobDO.setCreatedAt(timestamp.toString());
        jobDO.setUpdatedAt(timestamp.toString());

        jobDO.getCompany().setClient(true);

        companyDAO.save(jobDO.getCompany());

        System.out.println(jobDO.getCompany().getName());

        jobDAO.save(jobDO);
    }

    @Override
    @Transactional
    public JobDO view(Long id) throws Exception {
        return jobDAO.findOne(id);
    }

    @Override
    @Transactional
    public List<JobDO> getAll() throws Exception {
        return (List<JobDO>) jobDAO.findAll();
    }

    @Override
    @Transactional
    public void removeJob(Long id) throws Exception {
        this.jobDAO.delete(id);
        //catch EmptyResultDataAccessException
    }

    @Override
    @Transactional
    public List<JobDO> findByInvitedId(Long id) throws Exception {
        return (List<JobDO>) this.jobDAO.findByInvitedId(id);
    }

    @Override
    @Transactional
    public List<JobDO> findByAcceptedId(Long id) throws Exception {
        return (List<JobDO>) this.jobDAO.findByAcceptedId(id);
    }

    @Override
    @Transactional
    public List<JobDO> findByDeclinedId(Long id) throws Exception {
        return (List<JobDO>) this.jobDAO.findByDeclinedId(id);
    }

    @Override
    @Transactional
    public List<JobDO> findByEmployeeId(Long id) throws Exception {
        return (List<JobDO>) this.jobDAO.findByEmployeeId(id);
    }

    @Override
    @Transactional
    public JobDO updateToAccepted(JobDO jobDO, Long invitedId) throws Exception {
        System.out.println("Invited BAs are: "+jobDO.getInvited());
        List<BrandAmbassadorDO> updatedInvited = jobDO.getInvited();

        List<BrandAmbassadorDO> updatedAccepted = jobDO.getAccepted();
        for(int i = 0; i < updatedInvited.size(); i++){
            if (updatedInvited.get(i).getId().equals(invitedId)){
                updatedAccepted.add(updatedInvited.get(i));
                updatedInvited.remove(updatedInvited.get(i));
            }
        }
        jobDO.setInvited(updatedInvited);
        jobDO.setAccepted(updatedAccepted);
        return jobDAO.save(jobDO);
    }

    @Override
    @Transactional
    public JobDO updateToDeclined(JobDO jobDO, Long invitedId) throws Exception {
        System.out.println("Invited BAs are: "+jobDO.getInvited());
        List<BrandAmbassadorDO> updatedInvited = jobDO.getInvited();

        List<BrandAmbassadorDO> updatedDeclined = jobDO.getAccepted();
        for(int i = 0; i < updatedInvited.size(); i++){
            if (updatedInvited.get(i).getId().equals(invitedId)){
                updatedDeclined.add(updatedInvited.get(i));
                updatedInvited.remove(updatedInvited.get(i));
            }
        }
        jobDO.setInvited(updatedInvited);
        jobDO.setDeclined(updatedDeclined);
        return jobDAO.save(jobDO);
    }
}
