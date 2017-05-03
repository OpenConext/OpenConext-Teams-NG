package teams.domain;

import lombok.Getter;

@Getter
public class AdminMember {

    private String name;
    private String email;

    public AdminMember(Person person) {
        this.name = person.getName();
        this.email = person.getEmail();
    }
}
