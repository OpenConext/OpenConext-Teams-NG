package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkedTeamInfo {

    @JsonIgnore
    private String externalTeamIdentifier;
    private Long id;
    private String name;

}
