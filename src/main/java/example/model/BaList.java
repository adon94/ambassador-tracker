package example.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "BaList")
public class BaList extends AbstractEntity {

    private String title;

    @ManyToOne
    private EmployeeDO employee;

    private String createdAt;
    private String updatedAt;

    @ManyToMany(cascade = CascadeType.MERGE)
    private List<BrandAmbassadorDO> ambassadors;

    public BaList() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public EmployeeDO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDO employee) {
        this.employee = employee;
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

    public List<BrandAmbassadorDO> getAmbassadors() {
        return ambassadors;
    }

    public void setAmbassadors(List<BrandAmbassadorDO> ambassadors) {
        this.ambassadors = ambassadors;
    }
}