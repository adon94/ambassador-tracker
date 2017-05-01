package example.model;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@NamedNativeQuery(
        name = "JobDO.findOverlap",
        query = "SELECT id FROM job WHERE DATEDIFF(start_date, ?1) = 0 AND start_date < ?2 AND ?1 < end_date"
)
@Table(name = "JOB")
public class JobDO extends AbstractEntity {

    @ManyToOne
    private User jobManager;

    private int maxPeople;
    private boolean open;
    private boolean full;

    @ManyToOne(cascade=CascadeType.MERGE)//come back to this... maybe
    private Company company;
    private String location;
    private double wage;
    private String startDate;
    private String endDate;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private boolean publicEvent;
    @Lob
    private String description;

    @ManyToMany(cascade = CascadeType.MERGE)
    private List<User> invited;
    @ManyToMany(cascade = CascadeType.MERGE)
    private List<User> accepted;
    @ManyToMany(cascade = CascadeType.MERGE)
    private List<User> declined;

    public User getJobManager() {
        return jobManager;
    }

    public void setJobManager(User jobManager) {
        this.jobManager = jobManager;
    }

    public int getMaxPeople() {
        return maxPeople;
    }

    public void setMaxPeople(int maxPeople) {
        this.maxPeople = maxPeople;
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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isPublicEvent() {
        return publicEvent;
    }

    public void setPublicEvent(boolean publicEvent) {
        this.publicEvent = publicEvent;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public boolean isFull() {
        return full;
    }

    public void setFull(boolean full) {
        this.full = full;
    }
}
