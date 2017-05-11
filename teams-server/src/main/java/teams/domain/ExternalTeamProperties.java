package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@AllArgsConstructor
public class ExternalTeamProperties {

    @NotNull
    private Long id;

    @NotNull
    private String externalTeamIdentifier;

}
