package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class ClientInvitation {

    @NotNull
    private Long teamId;

    @NotNull
    private Role intendedRole;

    @NotNull
    private String email;

    private String message;

    @NotNull
    private Language language;


}
