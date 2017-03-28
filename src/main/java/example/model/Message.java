package example.model;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "MESSAGE")
public class Message extends AbstractEntity {

    @ManyToOne
    private User sender;

    @OneToMany
    private List<User> seenBy;

    @Lob
    private String text;

    private Timestamp timestamp;

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public List<User> getSeenBy() {
        return seenBy;
    }

    public void setSeenBy(List<User> seenBy) {
        this.seenBy = seenBy;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
