package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExternalTeamProperties {

    @NotNull
    private Long id;

    @NotNull
    private String externalTeamIdentifier;

}
