import I18n from "i18n-js";

I18n.translations.nl = {
    header: {
        superAdmin: {
            modus: "Super-Admin modus ingeschakeld"
        }
    },

    fileUploadDialog: {
        title: "Upload bestand",
        buttons: {
            cancel: "Annuleren",
            upload: "Upload"
        }
    },
    code: "NL",
    myteams: {
        tabs: {
            myTeams: "Mijn teams",
            publicTeams: "Publieke teams"
        },
        columns: {
            title: "Teamnaam",
            members: "Leden",
            private: "",
            member: "",
            bin: ""
        },
        filters: {
            all: 'Alles',
            allteams: 'Alle teams',
            joinrequest: "Toetredingsverzoeken",
            owner: "Eigenaar van",
            admin: "Beheerder van",
            manager: "Manager van",
            member: "Lid van"
        },
        empty: "",
        private: "Niet-publiek team",
        add_members: "Leden toevoegen",
        new_team: "Nieuw Team",
        member: "Je bent lid",
        joinRequest: "Toetredingsverzoek",
        confirmations: {
            delete: "Weet je zeker dat je dit team wilt verwijderen?",
            deleteJoinRequest: "Weet je zeker dat je dit toetredingsverzoek wilt verwijderen?",
        },
        zeroStates: {
            noTeams: "Je bent nog geen lid van een team",
            noResults: "Geen teams gevonden op basis van je zoekopdracht"
        },
        flash: {
            teamDeleted: "Team {{name}} is verwijderd",
            joinRequestDeleted: "Toetredingsverzoek tot {{name}} is verwijderd"
        }
    },
    publicTeams: {
        columns: {
            title: "Teamnaam",
            description: "Omschrijving",
            join: ""
        },
        joinRequest: "Word lid",
        alreadyMember: "Je bent al lid",
        superAdmin: "Super-adminkrachten",
        moreResults: "Er zijn meer resultaten dan getoond kunnen worden. Maak je zoekopdracht specifieker."
    },
    teamDetails: {
        members: "Leden",
        hideInvitees: "Verberg genodigden",
        noInvitees: "Geen genodigden",
        inviteSent: "uitgenodigd",
        joinRequest: "toetredingsverzoek",
        copied: "Gekopieerd",
        markdownTabs: {
            write: "Markdown-tekst",
            preview: "Voorbeeldweergave",
        },
        externalTeam: "Gekoppeld team",
        markdownPlaceholder: "Je kunt Markdown gebruiken in de omschrijving",
        personalNotesPlaceholder: "Interne notities voor jou en je mede-beheerders",
        alerts: {
            singleAdmin: "We raden aan minstens één andere beheerder toe te voegen."
        },
        addMembers: {
            invitationExpiry: "Uitnodiging is 30 dagen geldig",
            headers: {
                addMembersHeader: "Leden toevoegen",
                additionalInformationHeader: "Extra informatie",
                invitationLanguageHeader: "Taal van het uitnodigingsbericht",
                roleHeader: "Rol die de uitgenodigden zullen krijgen"

            },
            buttons: {
                add: "Leden toevoegen",
                sendInvite: "Uitnodiging verzenden",
                addAdministrator: "Beheerder toevoegen",
                cancel: "annuleren",
                addEmails: "Toevoegen",
                languageRadio: {
                    nl: "Nederlands",
                    en: "Engels"
                },
                languageCode: {
                    nl: "DUTCH",
                    en: "ENGLISH"
                }
            },
            placeholders: {
                emails: "Voer e-mailadressen in of knip en plak een csv of komma-gescheiden bestand",
                customMessage: "Voeg een persoonlijk bericht toe aan de uitnodiging",
            },
            errors: {
                invalidEmails: "De volgende e-mailadressen zijn ongeldig: {{attribute}}",
                noInput: "Geef minstens één geldig mailadres op"
            }
        },
        includeTeam: "Team koppelen",
        columns: {
            name: "Naam",
            idp: "IdP",
            email: "E-mail",
            role: "Rol",
            joined: "Toegetreden",
            bin: ""
        },
        filters: {
            all: 'Alle',
            owner: "Eigenaars",
            admin: "Beheerders",
            manager: "Managers",
            member: "Leden",
            invitee: "Genodigden",
            join_request: "Toetredingsverzoeken"
        },
        confirmations: {
            removeMember: "Weet je zeker dat je dit lid wilt verwijderen?",
            removeExternalTeam: "Weet je zeker dat je dit team wilt ontkoppelen?",
            removeInvitation: "Weet je zeker dat je deze uitnodiging wilt verwijderen?",
            resendInvitation: "Weet je zeker dat je deze uitnodiging opnieuw wilt versturen?",
            removeJoinRequest: "Weet je zeker dat je dit toetredingsverzoek wilt verwijderen?",
            approveJoinRequest: "Weet je zeker dat je dit toetredingsverzoek wilt goedkeuren?",
            rejectJoinRequest: "Weet je zeker dat je dit toetredingsverzoek wilt afwijzen?",
            downgrade: "Weet je zeker dat je een lagere rol wilt aannemen? Je kunt dit niet zelf ongedaan maken.",

        },
        flash: {
            removeMember: "Lid is verwijderd",
            removeInvitation: "Uitnodiging is verwijderd",
            sendInvitation: "Uitnodiging(en) zijn verstuurd",
            resendInvitation: "Uitnodiging is opnieuw verstuurd",
            removeJoinRequest: "Toetredingsverzoek is verwijderd",
            approveJoinRequest: "Toetredingsverzoek is goedgekeurd",
            rejectJoinRequest: "Toetredingsverzoek is afgewezen",
            memberChanged: "Rol van {{name}} gewijzigd in {{newRole}}",
        },
        idp: {
            unknown: "Onbekende / uitgenodigde gebruiker",
            guest: "Gebruiker met gastaccount",
            idp: "Gebruiker met instellingsaccount",
        }
    },
    profile: {
        admin: "Beheerder",
        guest: "Gast",
        email: "E-mail",
        name: "Naam",
        role: "Rol",
        logout: "Uitloggen",
        true: "{{productName}}-gast",
        false: "{{productName}}-beheerder"
    },
    roles: {
        guest: "Gast",
        member: "Lid",
        manager: "Manager",
        admin: "Beheerder",
        owner: "Eigenaar",
        title: "Je bent {{role}}"
    },
    details: {
        leave: "Verlaat team",
        delete: "Verwijder team",
        edit: "Bewerk team",
        confirmations: {
            leave: "Weet je zeker dat je dit team wilt verlaten?",
            delete: "Weet je zeker dat je dit team wilt verwijderen?"
        }
    },
    newTeam: {
        name: "Naam",
        description: "Doel van het team",
        visibility: "Team-privacy",
        backupEmail: "Backup-beheerder",
        personalNote: "Persoonlijke notitie",
        invitationMessage: "Uitnodigingsbericht",
        public: "Openbaar",
        publicInfo: "Geef het team weer in de publiek beschikbare lijst. Mensen kunnen om lidmaatschap verzoeken",
        private: "Privé-team",
        privateInfo: "Geef het team nergens weer. Het is alleen zichtbaar voor leden",
        object: "Team",
        publicLinkDisabled: "Publieke link ingeschakeld",
        publicLinkReset: "Reset publieke link",
        publicLinkResetConfirmation: "Weet je zeker dat je de publieke link wil resetten? De huidige publieke link is dan niet meer geldig.",
        placeholders: {
            name: "Geef de naam in (kan later niet gewijzigd worden)",
            markDown: "Markdown wordt ondersteund",
            backupEmail: "E-mailadres(sen) van de backup-beheerder(s)",
            invitationMessage: "Persoonlijk bericht voor de backup-beheerders",
        },
        tooltips: {
            description: "Het doel van dit team. Wordt getoond aan nieuwe leden als ze een uitnodiging accepteren.",
            personalNote: "Deze notities zijn alleen zichtbaar voor jouzelf en andere beheerers van dit team. Je kunt hier bijvoorbeend nader specificeren waar het voor gebruikt wordt.",
            immutableName: "De naam van het team kan niet meer worden aangepast als het eenmaal is aangemaakt",
            publicLinkDisabled: "Indien ingeschakeld kan iedereen die over de publieke link beschikt lid worden van het team zonder verdere goedkeuring door de beheerders of managers.",
        },
        flash: {
            created: "Team {{name}} aangemaakt",
            updated: "Team {{name}} bijgewerkt"
        },
        create: "Team aanmaken",
    },
    invitationForm: {
        header: "Uitnodiging opnieuw versturen",
        email: "E-mailadres genodigde",
        created: "Aanvankelijk verstuurd op",
        message: "Persoonlijk bericht",
        messagePlaceholder: "Persoonlijk bericht aan de genodigde",
        role: "Rol die de genodigde zal krijgen",
        language: "Taal van de uitnodiging"
    },
    joinRequestForm: {
        header: "Toetredingsverzoek",
        email: "E-mailadres van de verzoeker",
        created: "Verstuurd op",
        message: "Bericht",
        name: "Naam van de verzoeker",
    },
    joinRequest: {
        flash: "Toetredingsverzoek is verstuurd",
        teamAdmins: "Beheerders",
        invitationMessage: "Persoonlijk bericht",
        invitationMessagePlaceholder: "Je persoonlijk bericht aan de beheerders waarom je wilt toetreden tot dit team",
        existingJoinRequest: "Uitstaand toetredingsverzoek",
        existingJoinRequestDetails: "Je hebt alreeds op {{date}} verzocht om te mogen toetreden tot dit team"
    },
    externalTeams: {
        header: "Koppelen van instellingsteams",
        info: "Instellingsteams zijn groepen die geleverd worden door jouw instelling aan {{productName}}. Hier worden alleen die groepen getoond waar je zelf ook lid van bent.",
        info2: "Je kunt een instellings-team koppelen aan elk team dat je beheert binnen {{productName}}. Alle leden van dat instellingsteam zijn dan automatisch ook lid van jouw team.",
        table: {
            name: "Naam",
            linked: "Gekoppeld"
        }
    },
    forms: {
        cancel: "Annuleren",
        delete: "Verwijderen",
        submit: "Insturen",
        save: "Opslaan",
        search: "Zoek",
        update: "Bijwerken",
        resend: "Opnieuw verzenden",
        approve: "Goedkeuren",
        reject: "Afwijzen",
        edit: "Bewerken",
        back: "Terug",
        skip: "Overslaan",
        required: "{{attribute}} is vereist",
        alreadyExists: "Een {{object}} met {{attribute}} {{value}} bestaat al.",
        invalid: "Waarde {{value}} van {{attribute}} is ongeldig."
    },
    languages: {
        DUTCH: "Nederlands",
        ENGLISH: "Engels"
    },
    breadcrumbs: {
        myTeams: "Mijn teams",
        newTeam: "Team aanmaken",
        editTeam: "Bewerk {{name}}",
        joinRequest: "Toetredingsverzoek van {{name}}",
        userJoinRequest: "Toetredingsverzoek",
        invitation: "Uitnodiging aan {{email}}"
    },
    confirmationDialog: {
        title: "Bevestig",
        confirm: "Bevestigen",
        cancel: "Annuleren",
        questions: {
            delete: "Weet je zeker dat je {{object}} {{name}} wilt verwijderen?"
        }
    },
    footer: {
        faq: "<a href='https://support.surfconext.nl/teams' target='_blank' referrerpolicy='origin'>FAQ</a>",
        terms: "<a href='https://support.surfconext.nl/terms-nl' target='_blank' referrerpolicy='origin'>Gebruiksvoorwaarden</a>",
        privacy: "<a href='https://support.surfconext.nl/privacy-nl' target='_blank' referrerpolicy='origin'>Privacybeleid</a>"
    },
    teamWelcomeDialog: {
        title: "Welkom bij {{name}}",
        header: "Je rol is {{role}}",
        proceed: "Uitstekend, toon me het team",
        expired: "Deze uitnodiging is inmiddels verlopen.",
        denied: "Helaas...",
        titleDenied: "Je kunt nu niet toetreden tot {{name}}",
        alreadyMember: "Je bent al lid van dit team."
    },
    emails: {
        singleInvalid: "Ongeldig e-mailadres: {{emails}}",
        multipleInvalid: "Ongeldige e-mailadressen: {{emails}}"
    }
};

export default I18n.translations.nl;
