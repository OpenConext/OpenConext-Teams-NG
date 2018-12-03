package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Entity(name = "invitation_message")
@NoArgsConstructor
public class InvitationMessage implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id")
    @JsonIgnore
    private Invitation invitation;

    @Lob
    private String message;

    @Column(nullable = false)
    private long timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id")
    @JsonIgnore
    private Person person;

    public InvitationMessage(Invitation invitation, Person person, String message) {
        this.invitation = invitation;
        this.person = person;
        this.message = StringUtils.hasText(message) ? message : null;
        this.timestamp = System.currentTimeMillis();
    }

    @JsonIgnore
    public boolean isContainsMessage() {
        return this.message != null;
    }

    @JsonIgnore
    public String getHtmlMessage() {
        return isContainsMessage() ? HtmlUtils.htmlEscape(message).replaceAll("\n", "<br/>") : "";
    }

}
