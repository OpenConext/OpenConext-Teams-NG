package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
public class TeamProperties {

    private Long id;
    private String description;
    private String personalNote;
    private boolean viewable;

}
