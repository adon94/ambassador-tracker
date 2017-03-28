package example.service.impl;

import example.dao.CompanyDAO;
import example.dao.JobDAO;
import example.model.BrandAmbassadorDO;
import example.model.Company;
import example.model.JobDO;
import example.model.User;
import example.service.JobService;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionBuilder;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobDAO jobDAO;
    private final static String defaultImgUrl = "http://whats-theword.com/wp-content/themes/gonzo/images/no-image-featured-image.png";

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
    public JobDO create(JobDO jobDO) throws Exception {
        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());
        jobDO.setCreatedAt(timestamp.toString());
        jobDO.setUpdatedAt(timestamp.toString());

        if (jobDO.getCompany().getImageUrl() == null && jobDO.getCompany().getId() > 0) {
            Company existing = companyDAO.findOne(jobDO.getCompany().getId());
            jobDO.getCompany().setImageUrl(existing.getImageUrl());
        } else if (jobDO.getCompany().getImageUrl() == null){
            jobDO.getCompany().setImageUrl(defaultImgUrl);
        }

        jobDO.getCompany().setClient(true);

        companyDAO.save(jobDO.getCompany());

        System.out.println(jobDO.getCompany().getName());

        return jobDAO.save(jobDO);
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
        jobDAO.delete(id);
        //catch EmptyResultDataAccessException
    }

    @Override
    @Transactional
    public List<JobDO> findByInvitedId(Long id) throws Exception {
        return (List<JobDO>) jobDAO.findByInvitedId(id);
    }

    @Override
    @Transactional
    public List<JobDO> findByAcceptedId(Long id) throws Exception {
        return (List<JobDO>) jobDAO.findByAcceptedId(id);
    }

    @Override
    @Transactional
    public List<JobDO> findByDeclinedId(Long id) throws Exception {
        return (List<JobDO>) jobDAO.findByDeclinedId(id);
    }

    @Override
    @Transactional
    public List<JobDO> findByEmployeeId(Long id) throws Exception {
        return (List<JobDO>) jobDAO.findByJobManagerId(id);
    }

    @Override
    @Transactional
    public JobDO updateToAccepted(JobDO jobDO, Long invitedId) throws Exception {
        System.out.println("Invited BAs are: "+jobDO.getInvited());
        List<User> updatedInvited = jobDO.getInvited();

        List<User> updatedAccepted = jobDO.getAccepted();
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
        List<User> updatedInvited = jobDO.getInvited();

        List<User> updatedDeclined = jobDO.getDeclined();
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

    @Override
    @Transactional
    public List<JobDO> findOverlappers(String startDate1, String endDate1) throws Exception {

        List list = jobDAO.findOverlap(startDate1, endDate1);

        return findMultiple(list);
    }


    private List<JobDO> findMultiple(List ids) {
        List<Long> idList = new ArrayList<>();
        System.out.print(ids);
        for (Object id : ids){
            String s = String.valueOf(id);
            idList.add(Long.parseLong(s));
        }

        return (List<JobDO>) jobDAO.findAll(idList);
    }
}
