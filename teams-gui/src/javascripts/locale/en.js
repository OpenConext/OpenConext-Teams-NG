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
        links: {
            help_html: "<a href=\"https://github.com/OpenConext/OpenConext-teams-NG\" target=\"_blank\">Help</a>",
            logout: "Logout",
            exit: "Exit"
        },
        role: "Role"
    },

    navigation: {
        my_teams: "My Teams",
        external_teams: "Institution Teams"
    },

    teams: {
        title: "My teams",
        member_requests: "Join requests",
        invitations_received: "Invitations received",
        invitations_send: "Invitations send",
        name: "Team name",
        description: "Description",
        searchPlaceHolder: "SEARCH / JOIN ALL PUBLIC TEAMS...",
        role: "My role",
        membershipCount: "Members",
        actions: "",
        flash: "Team '{{name}}' was successfully {{action}}",
        flash_updated: "updated",
        flash_created: "created",
        flash_deleted: "deleted",
        confirmation: "Are your sure you want to remove team {{name}}?",
        edit: "Edit",
        delete: "Delete",
        add: "Add team",
        join: "JOIN",
        outstanding_join_request: "{{count}} outstanding join request(s)",
        outstanding_invitations: "{{count}} outstanding invite(s)",
        no_found: "You are not a member of a team",
    },

    team_detail: {
        back: "BACK TO MY TEAMS",
        urn: "Identifier",
        description: "Description",
        personalNote: "Personal note",
        viewable: "Public team",
        viewable_info: "People can see team information and request membership for this team, Non-public teams are only visible for members.",
        name: "Name",
        actions: "...",
        confirmation: "Are you sure you want to delete team {{name}}?",
        deleted: "Successfully deleted team {{name}}",
        leave: "Leave",
        team_members: "Team members",
        membership: {
            name: "name",
            email: "email",
            status: "status",
            role: "role",
            actions: ""
        },
        pending: "PENDING",
        resend_invitation: "Resend invitation",
        delete: "Delete",
        edit: "Edit",
        invite: "Invite",
        link_to_institution_team: "Add",
        search_members_placeholder: "Search members",
        no_found: "No members found",
        copy: "Copy to clipboard",
        copied: "Copied",
        one_admin_warning: "You are the only admin in the team. It is best practice for back-up purposes to have at least two administrators for each team."
    },

    sort: {
        label: "SORT BY",
        name: "Name",
        status: "Status",
        email: "Email",
        role: "Role",
        description: "Description",
        membershipCount: "Members"
    },

    new_team: {
        title: "New team",
        name: "Team name",
        name_info: "The name of the team cannot be changed once the team has been created.",
        format_error: "The allowed characters for a team name are words, spaces, minuses and the ' separator",
        already_exists_error: "There is already a team with this name",
        required: "The name is required",
        description: "Description",
        description_info: "The description of the team is visible for everyone if you make this a public team. Otherwise only members can view the description.",
        viewable_info: "List this team in the public teams index so people can see team information and request membership for this team.",
        personal_note: "Personal note",
        personal_note_info: "This is ony visible for yourself and other administrators of the team. It is recommended to express here what you want to do with the team, if you can.",
        admins: "admins",
        admins_info: "It is highly recommended to invite another administrator.",
        admins_email_placeholder: "Enter email address for another admin...",
        invalid_email: "Invalid email",
        invitation_message: "Message",
        invitation_message_info: "Your personal invitation message for the fellow admin of this team",
        invitation_language: "Invitation language",
        current_user: "{{name}} (It's you)",
        share_info: "Share this information with the applications used by this team.",
        approval_required: "You need to approve that the information may be shared",
        submit: "CREATE",
        cancel: "CANCEL",
        cancel_confirmation: "Are you sure you want to leave this page?"
    },

    profile: {
        email: "Email",
        role: "Role",
        true: "SURFconext Guest",
        false: "SURFconext Member"
    },

    auto_complete: {
        no_results: "No results"
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
