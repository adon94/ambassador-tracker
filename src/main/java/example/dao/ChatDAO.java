package example.dao;

import example.model.Chat;
import example.model.JobDO;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface ChatDAO extends JpaRepository<Chat, Long> {

    List<Chat> findByParticipantsId(Long participants_id);
    List<Chat> findByJob(JobDO job);
}
