package example.service.impl;

import example.dao.*;
import example.model.*;
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

    private ChatDAO chatDAO;

    @Autowired
    public void setChatDAO(ChatDAO chatDAO) {
        this.chatDAO = chatDAO;
    }

    private NotificationDAO notificationDAO;

    @Autowired
    public void setNotificationDAO(NotificationDAO notificationDAO) {
        this.notificationDAO = notificationDAO;
    }

    private BaListDAO baListDAO;

    @Autowired
    public void setBaListDAO(BaListDAO baListDAO) {
        this.baListDAO = baListDAO;
    }

    @Override
    @Transactional
    public JobDO create(JobDO jobDO) throws Exception {
        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());
        jobDO.setCreatedAt(timestamp);
        jobDO.setUpdatedAt(timestamp);

        if (jobDO.getCompany().getImageUrl() == null && jobDO.getCompany().getId() > 0) {
            Company existing = companyDAO.findOne(jobDO.getCompany().getId());
            jobDO.getCompany().setImageUrl(existing.getImageUrl());
        } else if (jobDO.getCompany().getImageUrl() == null){
            jobDO.getCompany().setImageUrl(defaultImgUrl);
        }
        User sender = jobDO.getJobManager();
        List<Notification> notifications = new ArrayList<>();

        for (User user : jobDO.getInvited()) {
            Notification notification = new Notification();
            notification.setTimestamp(timestamp);
            notification.setSeen(false);
            notification.setType("general");
            notification.setSender(sender);
            notification.setJob(jobDO);
            notification.setMessage("invited you to work at an event:");
            notification.setUser(user);
            notifications.add(notification);
        }

        notificationDAO.save(notifications);

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

        User user = new User();
        for(int i = 0; i < updatedInvited.size(); i++){
            if (updatedInvited.get(i).getId().equals(invitedId)){
                user = updatedInvited.get(i);

                List<Chat> chats = chatDAO.findByJob(jobDO);
                if (!chats.isEmpty()) {
                    Chat chat = chats.get(0);
                    List<User> participants = chat.getParticipants();
                    participants.add(user);
                    chat.setParticipants(participants);
                    chatDAO.save(chat);
                }

                List<BaList> lists = baListDAO.findByCompany(jobDO.getCompany());

                if (!lists.isEmpty()) {
                    BaList list = lists.get(0);
                    boolean exists = false;
                    for (User u: list.getAmbassadors()) {
                        if (u.getId().equals(user.getId())) {
                            exists = true;
                        }
                    }
                    if (!exists) {
                        List<User> baList = list.getAmbassadors();
                        baList.add(user);
                        list.setAmbassadors(baList);
                        baListDAO.save(list);
                    }
                } else {
                    BaList list = new BaList();
                    list.setCompany(jobDO.getCompany());
                    list.setTitle(jobDO.getCompany().getName());
                    List<User> uList = new ArrayList<>();
                    uList.add(user);
                    list.setAmbassadors(uList);
                    baListDAO.save(list);
                }

                updatedAccepted.add(user);
                updatedInvited.remove(user);
            }
        }

        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());

        if (user != null) {
            Notification notification = new Notification();
            notification.setMessage("accepted your event invitation for");
            notification.setSender(user);
            notification.setTimestamp(timestamp);
            notification.setJob(jobDO);
            notification.setUser(jobDO.getJobManager());
            notification.setType("general");
            notification.setSeen(false);
            notificationDAO.save(notification);
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
        User user = new User();
        for(int i = 0; i < updatedInvited.size(); i++){
            if (updatedInvited.get(i).getId().equals(invitedId)){
                user = updatedInvited.get(i);
                updatedDeclined.add(user);
                updatedInvited.remove(user);
            }
        }

        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());

        if (user != null) {
            Notification notification = new Notification();
            notification.setMessage("declined your event invitation for");
            notification.setSender(user);
            notification.setTimestamp(timestamp);
            notification.setJob(jobDO);
            notification.setUser(jobDO.getJobManager());
            notification.setType("general");
            notification.setSeen(false);
            notificationDAO.save(notification);
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
