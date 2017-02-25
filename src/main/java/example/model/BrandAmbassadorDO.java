package example.model;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;
import java.sql.Blob;

@Entity
@Table(name = "BRAND_AMBASSADOR")
public class BrandAmbassadorDO extends AbstractUser {

    private String dob;
    private String address;

    @Lob
    private Blob profilePic;

    private boolean male;
    private boolean fullLicence;
    private boolean carOwner;
    private String height;
    private String torso;
    private String waist;
    private String shoe;

//    public BrandAmbassadorDO(Integer id, String firstName, String lastName,
//                             Date dob, String address, String phone, String email,
//                             String profilePic, boolean male, boolean fullLicence,
//                             boolean carOwner, double height, double torso, double waist, double shoe) {
//        this.id = id;
//        this.firstName = firstName;
//        this.lastName = lastName;
//        this.dob = dob;
//        this.address = address;
//        this.phone = phone;
//        this.email = email;
//        this.profilePic = profilePic;
//        this.male = male;
//        this.fullLicence = fullLicence;
//        this.carOwner = carOwner;
//        this.height = height;
//        this.torso = torso;
//        this.waist = waist;
//        this.shoe = shoe;
//    }

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

    public Blob getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(Blob profilePic) {
        this.profilePic = profilePic;
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

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getTorso() {
        return torso;
    }

    public void setTorso(String torso) {
        this.torso = torso;
    }

    public String getWaist() {
        return waist;
    }

    public void setWaist(String waist) {
        this.waist = waist;
    }

    public String getShoe() {
        return shoe;
    }

    public void setShoe(String shoe) {
        this.shoe = shoe;
    }
}
