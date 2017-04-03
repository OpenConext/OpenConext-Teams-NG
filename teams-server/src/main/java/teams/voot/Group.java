package teams.voot;

import lombok.EqualsAndHashCode;
import lombok.ToString;

@EqualsAndHashCode(of = {"id"})
public class Group {

  public final String id;
  public final String displayName;
  public final String description;
  public final String membership;

  public Group(String id, String displayName, String description, String membership) {
    this.id = id;
    this.displayName = displayName;
    this.description = description;
    this.membership = membership;
  }

}
