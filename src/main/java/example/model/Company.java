package example.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "COMPANY")
public class Company extends AbstractEntity {

    private String name;
    private boolean client;//a company becomes a client if a job is created with using that company
    @Column(name = "image_url", columnDefinition = "varchar(255) default 'http://whats-theword.com/wp-content/themes/gonzo/images/no-image-featured-image.png'")
    private String imageUrl;

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
