package teams.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.Instant;

import static org.springframework.util.StringUtils.hasText;

@Entity(name = "persons")
@Getter
@NoArgsConstructor
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String urn;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private Instant created;

    @Column
    private boolean guest;

    public Person(String urn, String name, String email, boolean isGuest) {
        this.urn = urn;
        this.name = name;
        this.email = email;
        this.guest = isGuest;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setGuest(boolean guest) {
        this.guest = guest;
    }

    @JsonIgnore
    public boolean isValid() {
        return hasText(urn) && hasText(name) && hasText(email);
    }

}
