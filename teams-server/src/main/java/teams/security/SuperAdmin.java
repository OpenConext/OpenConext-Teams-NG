package teams.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "super-admins-team")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdmin {

    private List<String> urns;

}
