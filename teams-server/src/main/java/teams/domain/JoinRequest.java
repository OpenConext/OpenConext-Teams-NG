package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.time.Instant;


@Entity(name = "requests")
@Getter
@NoArgsConstructor
public class JoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @NotNull
    @JsonIgnore
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id")
    private Person person;

    @Column
    private Instant created;

    @Lob
    private String message;

    public JoinRequest(Person person, Team team, String message) {
        this.person = person;
        this.team = team;
        this.message = StringUtils.hasText(message) ? message : null;
    }

    @JsonIgnore
    public boolean isContainsMessage() {
        return StringUtils.hasText(this.message);
    }

    @JsonIgnore
    public String getHtmlMessage() {
        return isContainsMessage() ? HtmlUtils.htmlEscape(message).replaceAll("\n", "<br/>") : "";
    }

    public String getTeamName() {
        return team.getName();
    }

    public String getTeamUrn() {
        return team.getUrn();
    }
}
