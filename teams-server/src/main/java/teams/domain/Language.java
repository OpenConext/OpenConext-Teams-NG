package teams.domain;

public enum Language {

    Dutch("nl"), English("en");

    private final String languageCode;

    Language(String languageCode) {
        this.languageCode = languageCode;
    }

    public String getLanguageCode() {
        return languageCode;
    }
}
