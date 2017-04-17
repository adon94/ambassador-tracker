package example.model;


import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "COMPANY")
public class Company extends AbstractEntity {

    private String name;
    private boolean client;//a company becomes a client if a job is created with using that company
    private String imageUrl = "https://skpsoft.com/baby/wp-content/uploads/2016/09/default-thumbnail.jpg";

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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
