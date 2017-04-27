package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.Pattern;

@AllArgsConstructor
@Getter
public class NewTeamProperties {

    @Pattern(regexp = "[\\w \\-']{1,255}")
    private String name;
    private String description;
    private String personalNote;
    private boolean viewable;

    private String email;
    private String invitationMessage;
    private Language language;
}
