package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
public class ClientJoinRequest {

    @NotNull
    private String teamUrn;
    private String message;


}
