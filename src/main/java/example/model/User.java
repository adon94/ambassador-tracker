package example.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "USER")
public class User extends AbstractEntity {

    @Column(name = "image_url", columnDefinition = "varchar(255) default 'http://yeslk.com/images/OIP-Mcca04340db0ea021035ee612b3eebc00o0.jpg'")
    private String imageUrl;
    @Column(name = "cover_url", columnDefinition = "varchar(255) default 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20%2859%29.jpg'")
    private String coverUrl;

    @Column(unique=true)
    private String email;

    private String firstName;
    private String lastName;
    private String password;
    private String phone;

    private boolean manager;

    //Brand ambassador only
    private String dob;
    private String address;
    private boolean male;
    private boolean fullLicence;
    private boolean carOwner;
    private Timestamp lastSeen;
    private String registrationCode;

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isManager() {
        return manager;
    }

    public void setManager(boolean manager) {
        this.manager = manager;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isMale() {
        return male;
    }

    public void setMale(boolean male) {
        this.male = male;
    }

    public boolean isFullLicence() {
        return fullLicence;
    }

    public void setFullLicence(boolean fullLicence) {
        this.fullLicence = fullLicence;
    }

    public boolean isCarOwner() {
        return carOwner;
    }

    public void setCarOwner(boolean carOwner) {
        this.carOwner = carOwner;
    }

    public Timestamp getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(Timestamp lastSeen) {
        this.lastSeen = lastSeen;
    }

    public String getRegistrationCode() {
        return registrationCode;
    }

    public void setRegistrationCode(String registrationCode) {
        this.registrationCode = registrationCode;
    }
}
