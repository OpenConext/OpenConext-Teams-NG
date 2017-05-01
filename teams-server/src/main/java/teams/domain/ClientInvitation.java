package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
