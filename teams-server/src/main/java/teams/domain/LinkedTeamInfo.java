package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LinkedTeamInfo {

    @JsonIgnore
    private String externalTeamIdentifier;
    private Long id;
    private String name;

}
