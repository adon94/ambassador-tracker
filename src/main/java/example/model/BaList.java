package example.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "BaList")
public class BaList extends AbstractEntity {

    private String title;

    @ManyToOne
    private User listManager;

    private String createdAt;
    private String updatedAt;

    @ManyToMany(cascade = CascadeType.MERGE)
    private List<User> ambassadors;

    public BaList() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public User getListManager() {
        return listManager;
    }

    public void setListManager(User listManager) {
        this.listManager = listManager;
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

    public List<User> getAmbassadors() {
        return ambassadors;
    }

    public void setAmbassadors(List<User> ambassadors) {
        this.ambassadors = ambassadors;
    }
}