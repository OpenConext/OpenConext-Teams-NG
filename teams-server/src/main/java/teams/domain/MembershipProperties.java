package teams.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.Assert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@AllArgsConstructor
@Getter
public class MembershipProperties {

    @NotNull
    private Long id;

    @NotNull
    private Role role;

}
