package example.model;


import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "COMPANY")
public class Company extends AbstractEntity {

    private String name;
    private boolean client;//a company becomes a client if a job is created with using that company

    public Company() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isClient() {
        return client;
    }

    public void setClient(boolean client) {
        this.client = client;
    }
}
