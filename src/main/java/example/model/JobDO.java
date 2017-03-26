package example.model;

import javax.persistence.*;
import java.util.List;

@Entity
@NamedNativeQuery(
        name = "JobDO.findOverlap",
        query = "SELECT id FROM job WHERE DATEDIFF(start_date, ?1) = 0 AND start_date < ?2 AND ?1 < end_date"
)
@Table(name = "job")
public class JobDO extends AbstractEntity {

    @ManyToOne
    private User jobManager;

    private int requiredBoys;
    private int requiredGirls;
    private boolean open;

    @ManyToOne(cascade=CascadeType.MERGE)//come back to this... maybe
    private Company company;
    private String location;
    private double wage;
    private String startDate;
    private String endDate;
    private String createdAt;
    private String updatedAt;

    @ManyToMany(cascade = CascadeType.MERGE)
    private List<User> invited;
    @ManyToMany(cascade = CascadeType.MERGE)
    private List<User> accepted;
    @ManyToMany(cascade = CascadeType.MERGE)
    private List<User> declined;


//    public JobDO(int id, int jobManager, int requiredBoys, int requiredGirls, boolean open,
//                 String company, String coverPic, String location, double wage,
//                 String startDate, String endDate) {
//        this.id = id;
//        this.jobManager = jobManager;
//        this.requiredBoys = requiredBoys;
//        this.requiredGirls = requiredGirls;
//        this.open = open;
//        this.company = company;
//        this.coverPic = coverPic;
//        this.location = location;
//        this.wage = wage;
//        this.startDate = startDate;
//        this.endDate = endDate;
//    }

    public User getJobManager() {
        return jobManager;
    }

    public void setJobManager(User jobManager) {
        this.jobManager = jobManager;
    }

    public int getRequiredBoys() {
        return requiredBoys;
    }

    public void setRequiredBoys(int requiredBoys) {
        this.requiredBoys = requiredBoys;
    }

    public int getRequiredGirls() {
        return requiredGirls;
    }

    public void setRequiredGirls(int requiredGirls) {
        this.requiredGirls = requiredGirls;
    }

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        company.setClient(true);
        this.company = company;
    }

//    public String getCoverPic() {
//        return coverPic;
//    }
//
//    public void setCoverPic(String coverPic) {
//        this.coverPic = coverPic;
//    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getWage() {
        return wage;
    }

    public void setWage(double wage) {
        this.wage = wage;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<User> getInvited() {
        return invited;
    }

    public void setInvited(List<User> invited) {
        this.invited = invited;
    }

    public List<User> getAccepted() {
        return accepted;
    }

    public void setAccepted(List<User> accepted) {
        this.accepted = accepted;
    }

    public List<User> getDeclined() {
        return declined;
    }

    public void setDeclined(List<User> declined) {
        this.declined = declined;
    }
}
