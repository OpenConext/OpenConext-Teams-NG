package teams.domain;

public enum EntityType {

    SAML20_SP, OIDC10_RP;

    public String collectionName() {
        return name().toLowerCase();
    }
}
