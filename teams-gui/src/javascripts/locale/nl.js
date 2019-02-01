// Interpolation works as follows:
//
// Make a key with the translation and enclose the variable with {{}}
// ie "Hello {{name}}" Do not add any spaces around the variable name.
// Provide the values as: I18n.t("key", {name: "John Doe"})
import I18n from "i18n-js";

I18n.translations.nl = {
    code: "NL",
    name: "Nederlands",
    select_locale: "Selecteer Nederlands",

    boolean: {
        yes: "Ja",
        no: "Nee"
    },

    date: {
        month_names: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
    },

    header: {
        title: "Teams",
        links: {
            logout: "Uitloggen",
            exit: "Exit",
            help: "Help"
        },
        role: "Rol"
    },

    navigation: {
        my_teams: "Mijn Teams",
        institution_teams: "Instellingsteams"
    },
    error_dialog: {
        title: "Onverwachte fout",
        body: "Dit is gênant; er is een onverwachte fout opgetreden. De fout is gerapporteerd. Probeer het nogmaals. Blijft de fout aan? Klik op 'Help'.",
        ok: "Sluiten"
    },

    confirmation_dialog: {
        title: "Bevestig a.u.b.",
        confirm: "Bevestig",
        cancel: "Annuleer",
        leavePage: "Wil je deze pagina verlaten?",
        leavePageSub: "Wijzigingen worden niet opgeslagen.",
        stay: "Blijf",
        leave: "Weg"
    },

    teams: {
        title: "Mijn Teams",
        name: "Teamnaam",
        viewable: "Publiek",
        viewableTooltip: "Andere gebruikers van SURFconext Teams<br/>kunnen publieke teams vinden<br/>en een lidmaatschap aanvragen.<br/>Niet-publieke teams zijn verborgen voor niet-leden.<br/>Admins kunnen deze instelling wijzigen<br/>op de detail pagina van het Team.",
        description: "Omschrijving",
        searchPlaceHolder: "Zoek in alle publieke Teams...",
        role: "Mijn rol",
        membershipCount: "Leden",
        actions: "",
        actions_phone: "Acties",
        edit: "Aanpassen",
        delete: "Verwijder",
        join: "WORD LID",
        received_join_request: "1 ontvangen toetredingsverzoek",
        received_join_requests: "{{count}} received toetredingsverzoeken",
        pending_invitation: "1 openstaande uitnodiging",
        pending_invitations: "{{count}} openstaande uitnodigingen",
        no_found: "Je bent nog geen lid van een Team",
        filtered: "Je hebt al je Teams uitgefilterd",
        add: "NIEUW",
        join_request: "Toetredingsverzoek: ",
        created: "Datum: ",
        message: "Bericht: ",
        action_options: {
            join_request_resend: "Verstuur toetredingsverzoek nogmaals",
            join_request_remove: "Verwijder toetredingsverzoek",
            invite_member: "Lid uitnodigen",
            team_delete: "Verwijder Team",
            team_details: "Team details"
        },
        confirmations: {
            team_delete: "Weet je zeker dat je Team {{name}} wilt verwijderen?",
            join_request_delete: "Weet je zeker dat je het toetredingsverzoek voor Team {{name}} wilt verwijderen?",
        },
        flash: {
            team: "Team {{name}} is succesvol {{action}}",
            updated: "bijgewerkt",
            created: "aangemaakt",
            deleted: "verwijderd",
            join_request_deleted: "Toetredingsverzoek voor Team {{name}} is verwijderd"
        }
    },

    teams_autocomplete: {
        name: "naam",
        results_limited: "Meer teams dan kunnen worden getoond matchen, verfijn je zoekterm voor accuratere resultaten..."
    },

    team_detail: {
        back: "TERUG NAAR MIJN TEAMS",
        urn: "Identificatiecode",
        description: "Omschrijving",
        personalNote: "Persoonlijke notitie",
        viewable: "Publiek Team",
        viewable_info: "Door je Team publiek te maken kunnen andere gebruikers het Team vinden en vervolgens een toetredingsverzoek insturen. Ook de namen en e-mailadressen van de beheerders zijn zichtbaar.",
        name: "Naam",
        actions: "...",
        leave: "Verlaat",
        team_members: "LEDEN ({{count}})",
        team_groups: "GEKOPPELDE INSTELLINGSTEAMS ({{count}})",
        membership: {
            name: "naam",
            email: "e-mail",
            status: "status",
            expiry_date: "vervaldatum",
            role: "rol",
            actions: "",
        },
        email: "E-mail",
        intended_role: "Toekomstige rol",
        actions_phone: "Acties",
        status: "Status",
        expiry_date: "Vervaldatum",
        role: "Rol",
        pending: "OPEN",
        resend_invitation: "Uitnodiging opnieuw versturen",
        delete: "Verwijder Team",
        edit: "Bewerken",
        invite: "Uitnodigen",
        link_to_institution_team: "Nieuw",
        search_members_placeholder: "Filter leden",
        no_found: "Geen leden gevonden",
        public_link: "Publieke link",
        public_link_disabled: "Indien geactiveerd kunnen mensen die de publieke link hebben ontvangen lid worden van dit team zonder verdere goedkeuring van de beheerders.",
        copy: "Kopieer naar clipboard",
        copied: "Gekopieerd",
        one_admin_warning: "Je bent de enige beheerder (admin) in dit team. Het is vanwege back-up-redenen beter om twee beheerders in elk team te hebben.",
        add: "UITNODIGEN",
        linked: "Gekoppeld",
        action_options: {
            join_request_accept: "Accepteer toetredingsverzoek",
            join_request_reject: "Weiger toetredingsverzoek",
            invite_resend: "Verstuur uitnodiging opnieuw",
            invite_delete: "Verwijder uitnodiging",
            member_delete: "Verwijder lid",
            member_leave: "Verlaat Team",
            member_send_email: "Verstuur e-mail"
        },
        confirmations: {
            delete_team: "Weet je zeker dat je Team {{name}} wilt verwijderen?",
            leave_team: "Weet je zeker dat je Team {{name}} wilt verlaten?",
            delete_member: "Weet je zeker dat je het lidmaatschap van {{name}} wilt verwijderen?",
            accept_join_request: "Weet je zeker dat je het toetredingsverzoek van {{name}} wilt accepteren?",
            reject_join_request: "Weet je zeker dat je het toetredingsverzoek van {{name}} wilt afkeuren?",
            delete_invitation: "Weet je zeker dat je de uitnodiging voor {{name}} wilt verwijderen?",
            downgrade_current_user: "Weet je zeker dat je geen beheerder meer wilt zijn in team {{name}}? Je kan deze beslissing niet meer ongedaan maken.",
        },
        flash: {
            deleted: "Team {{name}} is succesvol verwijderd.",
            role_changed: "Rol voor {{name}} veranderd in {{role}}.",
            left: "Team {{name}} succesvol verlaten.",
            deleted_member: "Lidmaatschap van {{name}} succesvol verwijderd.",
            deleted_invitation: "De uitnodiging voor {{name}} succesvol verwijderd.",
            accepted_join_request: "Het toetredingsverzoek voor {{name}} succesvol verwijderd.",
            rejected_join_request: "Het toetredingsverzoek voor {{name}} succesvol geweigerd.",
            linked_institutional_team: "Instellingsteam {{team}} succesvol verbonden aan {{name}}.",
            unlinked_institutional_team: "Instellingsteam {{team}} succesvol ontkoppeld van {{name}}."
        }

    },
    join_request: {
        title: "Toetredingsverzoek",
        team: {
            name: "Teamnaam",
            description: "Omschrijving",
            admins: "Admin",
        },
        cancel: "Annuleer",
        submit: "Toetredingsverzoek",
        resubmit: "Opnieuw versturen",
        flash: "Je verzoek om lid te worden van {{name}} is verstuurd naar de beheerders",
        previous: "Openstaand toetredingsverzoek",
        previous_message: "Je hebt een toetredingsverzoek voor dit Team verstuurd op {{date}}",
        share_info: "Deel deze informatie met de applicaties gebruikt door dit Team.",
        approval_required: "Je moet toestemming verlenen om deze informatie te delen.",
        message: "Bericht",
        message_info: "Je persoonlijke bericht voor je mede-beheerder(s) van dit Team",
        message_placeholder: "Je persoonlijke bericht",
    },
    icon_legend: {
        admin: "Admin",
        manager: "Manager",
        member: "Lid",
        invitation: "Uitnodiging",
        join_request: "Toetredingsverzoek"
    },
    sort: {
        label: "SORTEER OP",
        name: "Naam",
        status: "Status",
        email: "E-mail",
        role: "Rol",
        description: "Omschrijving",
        expiryDate: "Vervaldatum",
        membershipCount: "Leden",
        viewable: "Publiek",
        linked: "Gekoppeld"
    },
    filter: {
        ADMIN: "Admins",
        MANAGER: "Managers",
        MEMBER: "Leden",
        JOIN_REQUEST: "Toetredingsverzoeken",
        INVITATION: "UITNODIGINGEN",
        label: "TOON",
        all: "ALLE",
        selected: "GEFILTERD",

    },

    new_team: {
        title: "Nieuw Team",
        name: "Teamnaam",
        name_info: "De naam van een Team kan niet meer worden gewijzigd als het Team eenmaal is aangemaakt.",
        format_error: "De toegestane karakters voor een team zijn letters en cijfers, spaties, minussen en het ' teken. De maximale lengte is 255 karakters",
        already_exists_error: "Er bestaat al Team met deze naam",
        required: "De naam is verplicht",
        description: "Omschrijving",
        description_info: "De omschrijving van een Team is zichtbaar voor iedereen als je het Team publiek maakt. Anders kunnen alleen leden van het Team de omschrijving zien.",
        viewable_info: "Maak dit Team publiek zodat iedereen dit Team kan zien en een verzoek om lid te worden kan versturen naar de beheerders.",
        personal_note: "Persoonlijke notitie",
        personal_note_info: "Deze notitie is alleen zichtbaar voor jezelf en mede-beheerders van het Team. Hier kun je bijvoorbeeld beschrijven waar het Team voor wordt gebruikt.",
        admins: "Admins",
        admins_info: "We adviseren je om een mede-beheerder uit te nodigen.",
        admins_email_placeholder: "E-mailadres van een collega-beheerder...",
        invalid_email: "Ongeldig e-mailadres",
        invitation_message: "Bericht",
        invitation_message_info: "Persoonlijk bericht voor je collega-beheerder",
        invitation_language: "Taal van de uitnodiging",
        current_user: "{{name}} (jij dus)",
        share_info: "Deel deze informatie met de applicaties gebruikt door dit team.",
        approval_required: "Je moet toestemming verlenen om deze informatie te delen.",
        submit: "TEAM MAKEN",
        cancel: "ANNULEREN",
        cancel_confirmation: "Weet je zeker dat je deze pagina wilt verlaten?"
    },
    invite: {
        title: "Uitnodiging versturen",
        email: "Voeg e-mailadressen van leden toe",
        emails_placeholder: "Voeg 1 of meer e-mailadressen toe...",
        email_required: "E-mail is verplicht - voeg een e-mailadres toe of selecteer een CSV-bestand met e-mailadressen",
        email_invalid: "E-mailformaat is ongeldig.",
        file_import: "Voeg e-mailadressen toe uit een CSV-bestand",
        file_placeholder: "Selecteer een CSV-bestand...",
        file_import_result: "{{nbr}} e-mailadressen toegevoegd uit {{fileName}}",
        file_extension_error: "Alleen CSV-bestanden zijn toegestaan",
        role: "Rol in het Team",
        invitation_language: "Taal van de uitnodiging",
        expiry_date: "Vervaldatum",
        expiry_date_placeholder: "Vervaldatum voor lidmaatschap",
        expiry_date_none: "Geen",
        message: "Bericht",
        message_info: "Je persoonlijke bericht",
        submit: "Leden uitnodigen",
        cancel: "Annuleer",
        flash: "Uitnodiging is verstuurd",
        flash_resent: "Herinneringsmail is verstuurd",
        message_placeholder: "Persoonlijk bericht voor de uitnodiging",
        expiry_data_info: "De vervaldatum is de vervaldatum voor het lidmaatschap (als deze uitnodiging wordt geaccepteerd). Als je een vervaldatum opgeeft dan wordt dit lid automatisch uit het Team verwijderd op de vervaldatum. Het is NIET de vervaldatum van deze uitnodiging."
    },
    invitation: {
        title: "Uitnodiging ontvangen voor Team '{{name}}'",
        invalid_title: "Ongeldige uitnodiging",
        team: {
            name: "Teamnaam",
            description: "Omschrijving",
            admins: "Admins",
            role: "De toekomstige rol"
        },
        cancel: "Annuleer",
        deny: "Weiger",
        deny_confirmation: "Weet je zeker dat je deze uitnodiging wilt weigeren?",
        accept: "Accepteer",
        denied: "geweigerd",
        share_info: "Deel deze informatie met de applicaties gebruikt door dit team.",
        approval_required: "Je moet toestemming verlenen om deze informatie te delen.",
        message: "Bericht",
        message_info: "Het persoonlijke bericht in deze uitnodiging",
        flash: {
            "accept": "Je bent lid geworden van Team {{name}}.",
            "deny": "Je hebt de uitnodiging voor Team {{name}} afgewezen."
        },
        invalid: {
            not_found: "De uitnodiging is niet meer geldig en is verwijderd, of je bent niet uitgenodigd.",
            accepted: "Je hebt deze uitnodiging al geaccepteerd.",
            declined: "Je hebt deze uitnodiging al afgewezen.",
            expired: "Deze uitnodiging is niet meer geldig.",
            already_member: "Je bent al lid van dit Team",
            join_request: "toetredingsverzoek",
            join_request_1: " Je kan een ",
            join_request_2: " versturen als je lid wilt worden van dit Team."
        }
    },
    public_link: {
        title: "Publieke link voor lidmaatschap van Team '{{name}}'",
        invalid_title: "Publieke link ongeldig",
        team: {
            name: "Teamnaam",
            description: "Omschrijving",
            admins: "Admins",
            role: "De toekomstige rol"
        },
        cancel: "Annuleer",
        accept: "Accepteer",
        share_info: "Deel deze informatie met de applicaties gebruikt door dit Team.",
        approval_required: "Je moet toestemming verlenen om deze informatie te delen.",
        flash: {
            "accept": "Je bent lid geworden van Team {{name}}.",
            "deny": "Je hebt de uitnodiging voor Team {{name}} afgewezen."
        },
        invalid: {
            not_found: "Deze publieke link is een ongeldige link.",
            already_member: "Je bent al lid van dit team",
            join_request: "toetredingsverzoek",
            join_request_1: " Je kan een ",
            join_request_2: " versturen als je lid wilt worden van dit Team."
        }
    },

    institution_teams: {
        name: "Teamnaam / Identificatiecode",
        help: "Uitleg",
        description: "Omschrijving",
        linked_teams: "Verbonden teams",
        searchPlaceHolder: "Zoek teams",
        filtered: "Geen instellingsteams gevonden",
        institution_team: "Instellingsteam",
        no_teams: "Je instelling levert geen teams of je ben geen lid van een Team binnen je instelling",

    },
    linked_institution_example: {
        title: "Instellingsteams uitgelegd",
        institution_name: "Univ Harderwijk",
        institution_team_name: "Leraren",
        surf_name: "Admins"
    },

    profile: {
        email: "E-mailadres",
        name: "Naam",
        role: "Rol",
        true: "{{productName}} gast",
        false: "{{productName}} lid"
    },

    auto_complete: {
        no_results: "Geen resultaten"
    },

    not_found: {
        title: "Deze pagina kan niet worden gevonden.",
        description_html: "Probeer het later opnieuw of neem contact op met <a href=\"mailto:{{helpMail}}\">{{helpMail}}</a>."
    },

    server_error: {
        title: "{{productName}} is momenteel niet beschikbaar wegens een technisch probleem.",
        description_html: "Probeer het later opnieuw of neem contact op met <a href=\"mailto:{{helpMail}}\">{{helpMail}}</a>.",
        missing_attribute: "Je bent succesvol ingelogd, maar helaas heeft {{productName}} tijdens het inloggen niet alle benodigde attributen ontvangen om correct te functioneren.",
        missing_attribute_description_html: "Ga naar de <a href=\"{{helpUrl}}\">{{productName}} helppagina's</a> om te bekijken hoe je dit probleem kunt oplossen.",
        missing_attribute_not_provided: "Ontbrekend attribuut:"
    },

    logout: {
        title: "Uitloggen succesvol.",
        description_html: "Je <strong>moet</strong> je browser volledig afsluiten om het uitlogproces te voltooien."
    },

    footer: {
        terms: "Algemene voorwaarden"
    }

};

export default I18n.translations.nl;
