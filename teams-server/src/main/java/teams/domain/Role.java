package teams.domain;

public enum Role {

    MEMBER(0), MANAGER(1), ADMIN(2), OWNER(2);

    private int importance;

    Role(int importance) {
        this.importance = importance;
    }

    public boolean isMoreImportant(Role role) {
        return this.importance > role.importance;
    }

    public boolean isLessImportant(Role role) {
        return this.importance < role.importance;
    }
}
