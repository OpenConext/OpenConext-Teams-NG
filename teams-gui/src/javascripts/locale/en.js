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
        month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },

    header: {
        title: "Teams",
        links: {
            logout: "Logout",
            exit: "Exit",
            help: "Help"
        },
        role: "Role"
    },

    navigation: {
        my_teams: "My Teams",
        institution_teams: "Institutional Teams"
    },

    error_dialog: {
        title: "Unexpected error",
        body: "This is embarrassing; an unexpected error has occurred. It has been logged and reported. Please try again. Still doesn't work? Please click 'Help'.",
        ok: "Close"
    },

    confirmation_dialog: {
        title: "Please confirm",
        confirm: "Confirm",
        cancel: "Cancel",
        leavePage: "Do you really want to leave this page?",
        leavePageSub: "Changes that you made will not be saved.",
        stay: "Stay",
        leave: "Leave"
    },

    teams: {
        title: "My Teams",
        name: "Team name",
        viewable: "",
        viewableTooltip: "This team is public,<br/>which means other users<br/>of SURFconext Teams can find it<br/>and request membership.<br/>Administrators can change this<br/>setting in the Teams settings page.",
        nonViewableTooltip: "This team is non-public,<br/>which means it can't be found by non-members.<br/>Administrators can change this<br/>setting in the Teams settings page.",
        description: "Description",
        searchPlaceHolder: "Search all public teams...",
        role: "My role",
        membershipCount: "Members",
        actions: "",
        actions_phone: "Actions",
        edit: "Edit",
        delete: "Delete",
        join: "JOIN",
        received_join_request: "1 received join request",
        received_join_requests: "{{count}} received join requests",
        pending_invitation: "1 pending invitation",
        pending_invitations: "{{count}} pending invitations",
        no_found: "You are not yet a member of any Team",
        filtered: "You have filtered out all your Teams",
        add: "ADD",
        join_request: "Join request: ",
        created: "Date: ",
        message: "Message: ",
        action_options: {
            join_request_resend: "Resend join request",
            join_request_remove: "Delete join request",
            invite_member: "Invite member",
            team_delete: "Delete Team",
            team_details: "Team details"
        },
        confirmations: {
            team_delete: "Are your sure you want to delete Team {{name}}?",
            join_request_delete: "Are you sure you want to delete your join request for Team {{name}}?",
        },
        flash: {
            team: "Team {{name}} was successfully {{action}}",
            updated: "updated",
            created: "created",
            deleted: "deleted",
            join_request_deleted: "Join request for Team {{name}} was deleted"
        }
    },

    teams_autocomplete: {
        name: "name",
        results_limited: "More entries matched than can be shown, please narrow your search term..."
    },

    team_detail: {
        back: "BACK TO MY TEAMS",
        urn: "Identifier",
        description: "Description",
        personalNote: "Personal note",
        viewable: "Public Team",
        viewable_info: "By making your Team public, other users can find the Team and request membership for it. The names and email addresses of the admins are also visible.",
        name: "Name",
        actions: "...",
        leave: "Leave",

        team_details: "TEAM INFO",
        team_members: "MEMBERS ({{count}})",
        team_groups: "LINKED INSTITUTIONAL TEAMS ({{count}})",
        membership: {
            name: "name",
            email: "email",
            status: "status",
            expiry_date: "expiry date",
            role: "role",
            actions: "",
            origin: {
                name: "Origin of membership",
                unknown: "Unknown",
                initial_admin: "Initial administrator",
                public_link: "Public link",
                invitation_accepted: "Invitation accepted",
                join_request_accepted: "Join Request accepted",
                unknown_label: "Unknown",
                initial_admin_label: "Created by",
                public_link_label: "Accepted by",
                invitation_accepted_label: "Invited by",
                join_request_accepted_label: "Approved by"
            }
        },
        email: "Email",
        intended_role: "Intended role",
        actions_phone: "Actions",
        status: "Status",
        expiry_date: "Expiry date",
        role: "Role",
        pending: "PENDING",
        resend_invitation: "Resend invitation",
        delete: "Delete",
        edit: "Edit",
        invite: "Invite",
        link_to_institution_team: "Add",
        search_members_placeholder: "Filter members",
        no_found: "No members found",
        no_found_owners: "No owners configured",
        public_link: "Public Link",
        public_link_disabled: "If enabled, people who have the public link can join the Team as member without the need for approval by admins or managers.",
        public_link_reset: "Reset public link",
        public_link_reset_confirmation: "Are you sure you want to reset the public link? The current public link will be no longer valid.",
        copy: "Copy to clipboard",
        copied: "Copied",
        one_admin_warning: "You are the only administrator in the Team. It is highly recommended to have at least two administrators for each Team.",
        add: "INVITE",
        linked: "Linked",
        owners: "OWNERS",
        action_options: {
            join_request_accept: "Accept join request",
            join_request_reject: "Reject join request",
            invite_resend: "Resend invitation",
            invite_delete: "Delete invitation",
            member_delete: "Delete member",
            member_leave: "Leave Team",
            member_send_email: "Send email"
        },
        confirmations: {
            delete_team: "Are you sure you want to delete Team {{name}}?",
            leave_team: "Are you sure you want to leave Team {{name}}?",
            delete_member: "Are you sure you want to delete the membership of {{name}}?",
            accept_join_request: "Are you sure you want to approve the join request from {{name}}?",
            reject_join_request: "Are you sure you want to reject the join request from {{name}}?",
            delete_invitation: "Are you sure you want to delete the invitation for {{name}}?",
            equalgrade_current_user: "Are you sure you don't want to be {{role}} anymore in Team {{name}}?",
            downgrade_current_user: "Are you sure you don't want to be {{role}} anymore in Team {{name}}? You can't undo this action yourself.",
        },
        flash: {
            deleted: "Successfully deleted Team {{name}}.",
            role_changed: "Role for {{name}} changed to {{role}}.",
            left: "Successfully left Team {{name}}.",
            deleted_member: "Successfully deleted the membership of {{name}}.",
            deleted_invitation: "Successfully deleted the invitation for {{name}}.",
            accepted_join_request: "Successfully accepted join request from {{name}}.",
            rejected_join_request: "Successfully rejected join request from {{name}}.",
            linked_institutional_team: "Successfully linked institutional Team {{team}} to {{name}}.",
            unlinked_institutional_team: "Successfully unlinked institutional Team {{team}} from {{name}}."
        }

    },
    join_request: {
        title: "Join request",
        team: {
            name: "Team name",
            description: "Description",
            admins: "Administrators",
        },
        cancel: "Cancel",
        submit: "Join request",
        resubmit: "Resent",
        flash: "Your request to join {{name}} has been sent to the administrators",
        previous: "Pending join request",
        previous_message: "You have already sent a join request for this Team on {{date}}",
        share_info: "Share this information with the applications used by this Team.",
        approval_required: "You must approve that the information may be shared",
        message: "Message",
        message_info: "Your personal invitation message for the fellow administrator of this team",
        message_placeholder: "Your personal message",
        not_found: "This {{name}} is not valid anymore as it has been removed.",
        teamName: "team",
        joinRequestName: "join request"
    },
    icon_legend: {
        admin: "Admin",
        owner: "Owner",
        manager: "Manager",
        member: "Member",
        invitation: "Invitation",
        join_request: "Join Request"
    },
    sort: {
        label: "SORT BY",
        name: "Name",
        status: "Status",
        email: "Email",
        role: "Role",
        description: "Description",
        expiryDate: "Expiry date",
        membershipCount: "Members",
        viewable: "Public",
        linked: "Linked"
    },
    filter: {
        ADMIN: "Admin",
        OWNER: "Owner",
        MANAGER: "Manager",
        MEMBER: "Members",
        JOIN_REQUEST: "Join requests",
        INVITATION: "Invitations",
        label: "SHOW",
        all: "ALL",
        selected: "FILTERED",

    },

    new_team: {
        title: "New Team",
        name: "Team name",
        name_info: "The name of the Team cannot be changed once the Team has been created.",
        format_error: "The allowed characters for a team name are alphanumerics, spaces, minuses and the ' separator. The maximum length is 255 characters.",
        already_exists_error: "A Team with this name already exists",
        required: "The name is required",
        description: "Description",
        description_info: "The description of the Team is visible to anyone if you make this Team public. Otherwise, only existing members can view the description.",
        viewable_info: "List this team in the public Teams index such that others can see Team information and request membership for this Team.",
        personal_note: "Personal note",
        personal_note_info: "This note is only visible for you and other administrators of this Team. You can use this field to specify what this Team is used for, for instance.",
        admins: "admins",
        admins_info: "It is highly recommended to invite another administrator.",
        admins_email_placeholder: "Enter an email address to invite other persons...",
        invalid_email: "Invalid email address",
        invitation_message: "Message",
        invitation_message_info: "Personal message for the invitees of this team",
        invitation_language: "Invitation language",
        current_user: "{{name}} (it's you)",
        share_info: "Share this information with the applications used by this team.",
        approval_required: "You must approve that the information may be shared",
        submit: "CREATE",
        cancel: "CANCEL",
        cancel_confirmation: "Are you sure you want to leave this page?"
    },
    invite: {
        title: "Invite member",
        email: "Add members by email address",
        emails_placeholder: "Enter one or more email addresses...",
        email_required: "Email is required - either add an email address or select a file containing comma separated email addresses",
        email_invalid: "Email format is invalid.",
        file_import: "Add members by file import",
        file_placeholder: "Select csv or txt file...",
        file_import_result: "Import {{nbr}} emails from {{fileName}}",
        file_extension_error: "Only .csv extension files are allowed",
        role: "Role within the team",
        invitation_language: "Invitation language",
        expiry_date: "Expiry date",
        expiry_date_placeholder: "Expiry date for membership",
        expiry_date_none: "None",
        message: "Message",
        message_info: "Your personal invitation message",
        submit: "Invite members",
        cancel: "Cancel",
        flash: "Invitation has been sent",
        flash_resent: "Reminder email has been sent",
        message_placeholder: "Personal message to be included in the invitation email",
        expiry_data_info: "The expiry date is the expiry date of the membership of this Team (if this invitation is accepted). By setting an expiry date, a member will be automatically removed from this Team after the expiry date expires. This is NOT the expiry date for the invitation."
    },
    invitation: {
        title: "Invitation received for Team '{{name}}'",
        invalid_title: "Invalid invitation",
        team: {
            name: "Team name",
            description: "Description",
            admins: "Administrators",
            role: "Your future role"
        },
        cancel: "Cancel",
        deny: "Decline",
        deny_confirmation: "Are you sure you want to decline this invitation?",
        accept: "Accept",
        denied: "declined",
        share_info: "Share this information with the applications used by this team.",
        approval_required: "You must approve that the information may be shared",
        message: "Message",
        message_info: "The personal invitation message you have received with the invitation",
        flash: {
            "accept": "You have successfully joined Team {{name}}.",
            "deny": "You have successfully denied membership for Team {{name}}."
        },
        invalid: {
            not_found: "Either the invitation has expired and has been removed or you were not invited.",
            accepted: "You already accepted this invitation.",
            declined: "You already declined this invitation.",
            expired: "This invitation is expired.",
            already_member: "You are already a member of this Team",
            join_request: "join request",
            join_request_1: " You can send a ",
            join_request_2: " if you want to become a member."
        }
    },
    public_link: {
        title: "Public link to join Team '{{name}}'",
        invalid_title: "Public link invalid",
        team: {
            name: "Team name",
            description: "Description",
            admins: "Administrators",
            role: "Your future role"
        },
        cancel: "Cancel",
        accept: "Accept",
        share_info: "Share this information with the applications used by this team.",
        approval_required: "You must approve that the information may be shared",
        flash: {
            "accept": "You have successfully joined Team {{name}}.",
            "deny": "You have successfully cancelled the public link membership for Team {{name}}."
        },
        invalid: {
            not_found: "This is an invalid public link.",
            already_member: "You are already a member of this Team",
            join_request: "join request",
            join_request_1: " You can send a ",
            join_request_2: " if you want to become a member."
        }
    },
    institution_teams: {
        name: "Team name / Identifier",
        help: "Explain",
        description: "Description",
        linked_teams: "Linked institutional Teams",
        searchPlaceHolder: "Search teams",
        filtered: "No institutional Teams found",
        institution_team: "Institutional Team",
        no_teams: "Your institution either does not provide any Teams or you are not a member of any institutional Team.",
        unknown: "'Name unknown'",
        otherInstitutionTeams: "Admin {{name}} linked his / hers following institutional Teams to this Team:"
    },
    linked_institution_example: {
        title: "Institutional Teams explained",
        institution_name: "Univ Harderwijk",
        institution_team_name: "Teachers",
        surf_name: "Admins"
    },
    profile: {
        email: "Email",
        name: "Name",
        role: "Role",
        true: "{{productName}} guest",
        false: "{{productName}} member"
    },

    auto_complete: {
        no_results: "No results"
    },

    not_found: {
        title: "The requested page could not be found.",
        description_html: "Please try again later or send an email to <a href=\"mailto:{{helpMail}}\">{{helpMail}}</a>."
    },

    server_error: {
        title: "{{productName}} is currently unavailable due to a technical problem.",
        description_html: "Please try again later or send an email to <a href=\"mailto:{{helpMail}}\">{{helpMail}}</a>.",
        missing_attribute: "You have successfully logged in, however, {{productName}} did not receive all the necessary attributes to function properly.",
        missing_attribute_description_html: "Please visit the <a href=\"{{helpUrl}}\">{{productName}} help pages</a> to see what you can do about this.",
        missing_attribute_not_provided: "Attribute(s) missing:"
    },

    logout: {
        title: "Logout completed successfully.",
        description_html: "You <strong>MUST</strong> close your browser to complete the logout process."
    },

    footer: {
        terms: "Terms of Service"
    }

};

export default I18n.translations.en;
