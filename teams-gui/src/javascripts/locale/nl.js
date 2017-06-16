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
            help_html: "<a href=\"https://openconext.org/teams\" target=\"_blank\">Help</a>",
            logout: "Logout",
            exit: "Exit"
        },
        role: "Rol"
    },

    navigation: {
        my_teams: "Mijn Teams",
        institution_teams: "Instellingsteams"
    },
    error_dialog: {
        title: "Onverwachte fout",
        body: "Dit is gênant. Er is een onverwachte fout opgetreden. De fout is gerapporteerd.",
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
        title: "Mijn teams",
        name: "Teamnaam",
        description: "Omschrijving",
        searchPlaceHolder: "ZOEK IN ALLE PUBLIEKE TEAMS...",
        role: "Mijn rol",
        membershipCount: "Leden",
        actions: "",
        actions_phone: "Acties",
        edit: "Aanpassen",
        delete: "Verwijder",
        join: "WORD LID",
        received_join_request: "1 ontvangen toetredingsverzoek",
        received_join_requests: "{{count}} received toetredingsverzoeken",
        pending_invitation: "1 open uitnodiging",
        pending_invitations: "{{count}} open uitnodigingen",
        no_found: "Je bent geen lid van een team",
        filtered: "Je hebt al je teams uitgefilterd",
        add: "NIEUW",
        join_request: "Toetredingsverzoek: ",
        created: "Datum: ",
        message: "Bericht: ",
        action_options: {
            join_request_resend: "Nogmaals toetredingsverzoek versturen",
            join_request_remove: "Verwijder toetredingsverzoek",
            invite_member: "Lid uitnodigen",
            team_delete: "Verwijder team",
            team_details: "Team details"
        },
        confirmations: {
            team_delete: "Weet je zeker dat je team {{name}} wilt verwijderen?",
            join_request_delete: "Weet je zeker dat je je toetredingsverzoek voor team {{name}} wilt verwijderen?",
        },
        flash: {
            team: "Team {{name}} is succesvol {{action}}",
            updated: "bijgewerkt",
            created: "aangemaakt",
            deleted: "verwijderd",
            join_request_deleted: "Toetredingsverzoek voor team {{name}} is verwijderd"
        }
    },

    team_detail: {
        back: "TERUG NAAR MIJN TEAMS",
        urn: "Identificatiecode",
        description: "Omschrijving",
        personalNote: "Persoonlijk bericht",
        viewable: "Publiek team",
        viewable_info: "Iedereen kan dit team bekijken en toetredingsverzoeken indienen. Niet-publieke teams zijn alleen maar zichtbaar voor leden.",
        name: "Naam",
        actions: "...",
        leave: "Verlaat",
        team_members: "LEDEN ({{count}})",
        team_groups: "GEKOPPELDE GROEPEN ({{count}})",
        membership: {
            name: "naam",
            email: "e-mail",
            status: "status",
            role: "rol",
            actions: "",
        },
        email: "E-mail",
        intended_role: "Toekomstige rol",
        actions_phone: "Acties",
        status: "Status",
        role: "Rol",
        pending: "OPEN",
        resend_invitation: "Uitnodiging opnieuw versturen",
        delete: "Verwijderen",
        edit: "Bewerken",
        invite: "Uitnodigen",
        link_to_institution_team: "Nieuw",
        search_members_placeholder: "Zoek leden",
        no_found: "Geen leden gevonden",
        public_link: "Publieke link",
        public_link_disabled: "Indien geactiveerd kunnen mensen die de publieke link hebben ontvangen lid worden van dit team zonder verdere goedkeuring van de administrateurs.",
        copy: "Kopieer naar clipboard",
        copied: "Gekopieerd",
        one_admin_warning: "Je bent de enige admin in dit team. Het is vanwege back-up-redenen beter om twee administrateurs in elk team te hebben.",
        add: "UITNODIGEN",
        linked: "Verbonden",
        action_options: {
            join_request_accept: "Accepteer toetredingsverzoek",
            join_request_reject: "Weiger toetredingsverzoek",
            invite_resend: "Opnieuw uitnodiging versturen",
            invite_delete: "Verwijder uitnodiging",
            member_delete: "Verwijder lid",
            member_leave: "Verlaat team",
            member_send_email: "Verstuur e-mail"
        },
        confirmations: {
            delete_team: "Weet je zeker dat je team {{name}} wilt verwijderen?",
            leave_team: "Weet je zeker dat je team {{name}} wilt verlaten?",
            delete_member: "Weet je zeker dat je het lidmaatschap van {{name}} wilt verwijderen?",
            accept_join_request: "Weet je zeker dat je het toetredingsverzoek van {{name}} wilt accepteren?",
            reject_join_request: "Weet je zeker dat je het toetredingsverzoek van {{name}} wilt afkeuren?",
            delete_invitation: "Weet je zeker dat je de uitnodiging voor {{name}} wilt verwijderen?",
            downgrade_current_user: "Weet je zeker dat je geen administrateur meer wilt zijn in team {{name}}? Je kan deze beslissing niet meer ongedaan maken.",
        },
        flash: {
            deleted: "Team {{name}} is succesvol verwijderd.",
            role_changed: "Rol voor {{name}} veranderd in {{role}}.",
            left: "Succesvol team {{name}} verlaten.",
            deleted_member: "Succesvol het lidmaatschap van {{name}} verwijderd.",
            deleted_invitation: "Succesvol de uitnodiging voor {{name}} verwijderd.",
            accepted_join_request: "Succesvol het toetredingsverzoek voor {{name}} verwijderd.",
            rejected_join_request: "Succesvol het toetredingsverzoek voor {{name}} geweigerd.",
            linked_institutional_team: "Succesvol instellingsteam {{team}} verbonden aan {{name}}.",
            unlinked_institutional_team: "Succesvol instellingsteam {{team}} ontkoppeld van {{name}}."
        }

    },
    join_request: {
        title: "Toetredingsverzoek",
        team: {
            name: "Teamnaam",
            description: "Omschrijving",
            admins: "Administrateur",
        },
        cancel: "Annuleer",
        submit: "Toetredingsverzoek",
        resubmit: "Opnieuw versturen",
        flash: "Je verzoek om lid te worden van {{name}} is verstuurd naar de administrateurs",
        previous: "Open toetredingsverzoek",
        previous_message: "Je hebt een toetredingsverzoek voor dit team verstuurd op {{date}}",
        share_info: "Deel deze informatie met de applicaties gebruikt door dit team.",
        approval_required: "Je moet toestemming verlenen om deze informatie te delen.",
        message: "Bericht",
        message_info: "Je persoonlijke bericht voor je mede-administrateur van dit team",
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
        membershipCount: "Leden",
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
        title: "Nieuw team",
        name: "Teamnaam",
        name_info: "De naam van een team kan niet meer veranderd worden als het eenmaal is aangemaakt.",
        format_error: "De toegestane karakters voor een team zijn letters en cijfers, spaties, minussen en het ' teken. De maximale lengte is 255 karakters",
        already_exists_error: "Er bestaat al team met deze naam",
        required: "De naam is verplicht",
        description: "Omschrijving",
        description_info: "De omschrijving van een team is zichtbaar voor iedereen als je het team publiek maakt. Anders kunnen alleen leden de omschrijving zien.",
        viewable_info: "Maak dit team publiek zodat iedereen dit team kan zien en een verzoek om lid te worden kan versturen naar de administrateurs.",
        personal_note: "Persoonlijke notitie",
        personal_note_info: "Dit is alleen zichtbaar voor jezelf en collega-administrateurs van het team. Hier kun je beschrijven wat het doel van dit team is.",
        admins: "Administrateurs",
        admins_info: "We adviseren je om een mede-administrateur uit te nodigen.",
        admins_email_placeholder: "E-mailadres van een collega-administrateur...",
        invalid_email: "Ongeldig e-mailadres",
        invitation_message: "Bericht",
        invitation_message_info: "Persoonlijk bericht voor je collega-administrateur",
        invitation_language: "Taal van de uitnodiging",
        current_user: "{{name}} (jij dus)",
        share_info: "Deel deze informatie met de applicaties gebruikt door dit team.",
        approval_required: "Je moet toestemming verlenen om deze informatie te delen.",
        submit: "BEWAREN",
        cancel: "ANNULEREN",
        cancel_confirmation: "Weet je zeker dat je deze pagina wilt verlaten?"
    },
    invite: {
        title: "Uitnodiging versturen",
        email: "Voeg e-mailadressen van leden toe",
        emails_placeholder: "Voeg 1 of meer e-mailadressen toe...",
        email_required: "E-mail is verplicht - voeg een e-mailadres toe of selecteer een CSV-bestand met e-mailadressen",
        email_invalid: "E-mailformaat is ongeldig.",
        file_import: "Voeg e-mails toe uit een CSV-bestand",
        file_placeholder: "Selecteer een CSV-bestand...",
        file_import_result: "{{nbr}} e-mailadressen toegevoegd uit {{fileName}}",
        file_extension_error: "Alleen CSV-bestanden zijn toegestaan",
        role: "Rol in het team",
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
        expiry_data_info: "De vervaldatum is de vervaldatum voor het lidmaatschap als deze uitnodiging wordt geaccepteerd. Als je een vervaldatum opgeeft dan is het eventuele lidmaatschap tijdelijk tot het verloopt. Het is NIET de vervaldatum van deze uitnodiging."
    },
    invitation: {
        title: "Uitnodiging ontvangen voor team '{{name}}'",
        invalid_title: "Ongeldige uitnodiging",
        team: {
            name: "Teamnaam",
            description: "Omschrijving",
            admins: "Administrateurs",
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
            "accept": "Je bent lid geworden van team {{name}}.",
            "deny": "Je hebt de uitnodiging voor team {{name}} afgewezen."
        },
        invalid: {
            not_found: "De uitnodiging is niet meer geldig en is verwijderd of je bent niet uitgenodigd.",
            accepted: "Je hebt deze uitnodiging al geaccepteerd.",
            declined: "Je hebt deze uitnodiging al afgewezen.",
            expired: "Deze uitnodiging is niet meer geldig.",
            already_member: "Je bent al lid van dit team",
            join_request: "toetredingsverzoek",
            join_request_1: " Je kan een ",
            join_request_2: " versturen als je lid wilt worden van dit team."
        }
    },
    public_link: {
        title: "Publieke link voor lidmaatschap van team '{{name}}'",
        invalid_title: "Publieke link ongeldig",
        team: {
            name: "Teamnaam",
            description: "Omschrijving",
            admins: "Administrateurs",
            role: "De toekomstige rol"
        },
        cancel: "Annuleer",
        accept: "Accepteer",
        share_info: "Deel deze informatie met de applicaties gebruikt door dit team.",
        approval_required: "Je moet toestemming verlenen om deze informatie te delen.",
        flash: {
            "accept": "Je bent lid geworden van team {{name}}.",
            "deny": "Je hebt de uitnodiging voor team {{name}} afgewezen."
        },
        invalid: {
            not_found: "Deze publieke link is niet ongeldige link voor lidmaatschap van een team.",
            already_member: "Je bent al lid van dit team",
            join_request: "toetredingsverzoek",
            join_request_1: " Je kan een ",
            join_request_2: " versturen als je lid wilt worden van dit team."
        }
    },

    institution_teams: {
        name: "Teamnaam / identificatiecode",
        help: "Uitleg",
        description: "Omschrijving",
        linked_teams: "Verbonden teams",
        searchPlaceHolder: "ZOEK TEAMS",
        filtered: "Geen intstellingsteams gevonden",
        institution_team: "Instellingsteam",
        no_teams: "Je instelling levert geen teams of je ben geen lid van een team binnen je instelling",

    },
    linked_institution_example: {
        title: "Instellingteams uitgelegd",
        institution_name: "UvH",
        institution_team_name: "Leraren",
        surf_name: "Admins"
    },

    profile: {
        email: "E-mailadres",
        role: "Rol",
        true: "{{productName}} gast",
        false: "{{productName}} lid"
    },

    auto_complete: {
        no_results: "Geen resultaten"
    },

    not_found: {
        title: "Deze pagina kan niet worden gevonden.",
        description_html: "Probeer het later opnieuw of neem contact op met <a href=\"mailto:support@surfconext.nl\">support@surfconext.nl</a>."
    },

    server_error: {
        title: "De Teams-applicatie is momenteel niet beschikbaar.",
        description_html: "Probeer het later opnieuw of neem contact op met <a href=\"mailto:support@surfconext.nl\">support@surfconext.nl</a>."
    },

    logout: {
        title: "Logout succesvol.",
        description_html: "Je <strong>moet</strong> je browser sluiten om het logoutproces te voltooien."
    },

    footer: {
        surfnet_html: "<a href=\"https://wiki.surfnet.nl/display/conextsupport/SURFconext+Teams\" target=\"_blank\">{{productName}}</a>",
        terms_html: "<a href=\"https://wiki.surfnet.nl/display/conextsupport/Terms+of+Service+%28NL%29\" target=\"_blank\">Terms of Service</a>",
        contact_html: "<a href=\"mailto:support@surfconext.nl\">support@surfconext.nl</a>"
    }

};

export default I18n.translations.nl;
