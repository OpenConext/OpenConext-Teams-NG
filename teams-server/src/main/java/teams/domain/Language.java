package teams.domain;

public enum Language {

    DUTCH("nl"), ENGLISH("en"), PORTUGESE("pt");

    private final String languageCode;

    Language(String languageCode) {
        this.languageCode = languageCode;
    }

    public String getLanguageCode() {
        return languageCode;
    }
}
