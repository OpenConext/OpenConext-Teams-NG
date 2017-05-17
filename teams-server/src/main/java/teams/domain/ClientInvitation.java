package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

@Getter
@AllArgsConstructor
public class ClientInvitation {

    @NotNull
    private Long teamId;

    @NotNull
    private Role intendedRole;

    private List<String> emails;

    private Instant expiryDate;

    private String message;

    private String csvEmails;

    @NotNull
    private Language language;


}
