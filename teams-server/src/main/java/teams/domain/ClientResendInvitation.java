package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class ClientResendInvitation {

    @NotNull
    private Long id;

    private String message;

}
