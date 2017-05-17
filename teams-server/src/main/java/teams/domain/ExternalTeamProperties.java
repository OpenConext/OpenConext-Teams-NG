package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class ExternalTeamProperties {

    @NotNull
    private Long id;

    @NotNull
    private String externalTeamIdentifier;

}
