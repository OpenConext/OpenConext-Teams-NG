package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NewTeamProperties {

    @Pattern(regexp = "[\\w \\-']{1,255}")
    private String name;
    private String description;
    private String personalNote;
    private boolean viewable;

    private Map<String, String> emails;
    private String roleOfCurrentUser;
    private String invitationMessage;
    private Language language;
}
