package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class ClientInvitation {

    @NotNull
    private String teamUrn;

    @NotNull
    private Role intendedRole;

    @NotNull
    private String email;

    private String message;



}
