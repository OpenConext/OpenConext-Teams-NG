package teams.domain;


import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
public class MembershipProperties {

    @NotNull
    private Long id;

    @NotNull
    private Role role;

}
