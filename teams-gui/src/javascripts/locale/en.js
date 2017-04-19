// Interpolation works as follows:
//
// Make a key with the translation and enclose the variable with {{}}
// ie "Hello {{name}}" Do not add any spaces around the variable name.
// Provide the values as: I18n.t("key", {name: "John Doe"})
import I18n from "i18n-js";

I18n.translations.en = {
    code: "EN",
    name: "English",
    select_locale: "Select English",

    boolean: {
        yes: "Yes",
        no: "No"
    },

    date: {
        month_names: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },

    header: {
        title: "Teams",
        welcome: "Welcome ",
        links: {
            help_html: "<a href=\"https://github.com/OpenConext/OpenConext-teams-NG\" target=\"_blank\">Help</a>",
            logout: "Logout",
            exit: "Exit"
        },
        role: "Role"
    },

    navigation: {
        my_teams: "My Teams",
        public_teams: "Public Teams",
        external_teams: "Institution Teams"
    },

    teams: {
        name: "Name",
        description: "Description",
        searchPlaceHolder: "Search / join teams...",
        role: "Role",
        membershipCount: "Members",
        actions: "",
        flash: "Team '{{teamName}}' was successfully {{action}}",
        flash_updated: "updated",
        flash_created: "created",
        flash_deleted: "deleted",
        confirmation: "Are your sure you want to remove team {{teamName}}?",
        edit: "Edit",
        delete: "Delete"
    },

    team_detail: {
        back: "BACK TO MY TEAMS",
        urn: "Identifier",
        description: "Description",
        personalNote: "Personal note",
        viewable: "Public team",
        viewable_info: "People can see team information and request membership for this team",
        name: "Name",
        actions: "...",
        confirmation: "Are you sure you want to delete team {{name}}?",
        deleted: "Successfully deleted team {{name}}",
        no_found: "No teams found",
        leave: "Leave",
        team_members: "Team Members",
        membership: {
            name: "name",
            email: "email",
            status: "status",
            role: "role"
        },
        pending: "PENDING",
        resend_invitation: "Resend invitation",
        delete: "Delete",
        edit: "Edit",
        invite: "Invite",
        link_to_institution_team: "Link to institution team",
        search_members_placeholder: "Search members",
        no_found: "No members found"
    },

    sort: {
        label: "SORT BY"
    },

    profile: {
        true: "SURFconext Guest",
        false: "SURFconext Member"
    },

    not_found: {
        title: "The requested page could not be found.",
        description_html: "Please try again later or contact <a href=\"mailto:support@surfconext.nl\">support@surfconext.nl</a>."
    },

    server_error: {
        title: "The Teams application is currently unavailable.",
        description_html: "Please try again later or contact <a href=\"mailto:support@surfconext.nl\">support@surfconext.nl</a>."
    },

    logout: {
        title: "Logout completed successfully.",
        description_html: "You <strong>MUST</strong> close your browser to complete the logout process."
    },

    footer: {
        surfnet_html: "<a href=\"https://www.surfnet.nl/en\" target=\"_blank\">SURFnet</a>",
        terms_html: "<a href=\"https://wiki.surfnet.nl/display/conextsupport/Terms+of+Service+%28EN%29\" target=\"_blank\">Terms of Service</a>",
        contact_html: "<a href=\"mailto:support@surfconext.nl\">support@surfconext.nl</a>"
    }

};
