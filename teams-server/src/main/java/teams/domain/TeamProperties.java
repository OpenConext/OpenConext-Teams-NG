package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeamProperties {

    private Long id;
    private String description;
    private String personalNote;
    private boolean viewable;
    private boolean publicLinkDisabled;

}
