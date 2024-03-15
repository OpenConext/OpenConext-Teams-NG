package teams.voot;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.springframework.util.Assert;

import java.util.Objects;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Group {

    private final String id;
    private final String displayName;
    private final String description;
    private final String membership;
    private final String sourceID;

    public Group(String id, String displayName, String description, String membership) {
        this(id, displayName, description, membership, null);
    }

    public Group(String id, String displayName, String description, String membership, String sourceID) {
        Assert.notNull(id, "Id can not be null");
        this.id = id;
        this.displayName = displayName;
        this.description = description;
        this.membership = membership;
        this.sourceID = sourceID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Group group = (Group) o;
        return Objects.equals(id, group.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
