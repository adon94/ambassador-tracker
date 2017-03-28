package example.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "CHAT")
public class Chat extends AbstractEntity {

    @OneToMany(cascade = CascadeType.MERGE)
    private List<Message> messages;

    @ManyToMany
    private List<User> participants;

    @OneToOne
    private JobDO job;

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public List<User> getParticipants() {
        return participants;
    }

    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }

    public JobDO getJob() {
        return job;
    }

    public void setJob(JobDO job) {
        this.job = job;
    }
}
