package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class ClientJoinRequest {

    @NotNull
    private Long teamId;

    private String message;


}
