package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;

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

    private String email;
    private String invitationMessage;
    private Language language;
}
