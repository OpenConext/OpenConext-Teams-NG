import I18n from "i18n-js";

I18n.translations.en = {
    header: {
        superAdmin: {
            modus: "Super-Admin modus enabled"
        }
    },
    headerTitles: {
        index: "{{page}} | SURFConext teams",
        "team-details": "Team details",
        "public-teams": "Public teams",
        "my-teams": "Mine teams",
        "new-team": "New team",
        "edit-team": "Edit team",
        "invitation": "Invitation",
        "public": "Public team",
        "teams": "Join request",
        "join-request": "Join request",
        "missing-attributes": "Missing attributes",
    },
    fileUploadDialog: {
        title: "Upload file",
        buttons: {
            cancel: "Cancel",
            upload: "Upload"
        }
    },
    code: "EN",
    myteams: {
        tabs: {
            myTeams: "My teams",
            publicTeams: "Public teams"
        },
        columns: {
            title: "Team name",
            members: "Members",
            private: "",
            member: "",
            bin: ""
        },
        filters: {
            all: 'All',
            allteams: 'All teams',
            joinrequest: "Join requests",
            owner: "Owner of",
            admin: "Admin of",
            manager: "Manager of",
            member: "Member of"
        },
        empty: "",
        private: "private team",
        add_members: "Add members",
        new_team: "New Team",
        member: "You're a member",
        joinRequest: "Join request",
        confirmations: {
            delete: "Are you sure you want to delete this team?",
            deleteJoinRequest: "Are you sure you want to delete this join request?",
        },
        zeroStates: {
            noTeams: "You are not yet a member of any Team",
            noResults: "No teams were found for your search"
        },
        flash: {
            teamDeleted: "Team {{name}} is deleted",
            joinRequestDeleted: "Join request for {{name}} is deleted"
        }
    },
    publicTeams: {
        columns: {
            title: "Team name",
            description: "Description",
            join: ""
        },
        joinRequest: "Request to join",
        alreadyMember: "Already a member",
        superAdmin: "Super admin powers",
        moreResults: "There are more matches than can be shown. Please refine your search."
    },
    teamDetails: {
        members: "Members",
        hideInvitees: "Hide invitees",
        hideMembers: "This team does not disclose membership information",
        noInvitees: "No invitees",
        inviteSent: "invite sent",
        joinRequest: "join request",
        copied: "Copied",
        markdownTabs: {
            write: "Markdown text",
            preview: "Preview",
        },
        externalTeam: "Included team",
        markdownPlaceholder: "Team description supports Markdown",
        personalNotesPlaceholder: "Personal notes for your fellow administrators to see",
        expires: " (expires on {{expiryDate}})",
        noExpires: " (no expiry date)",
        alerts: {
            singleAdmin: "It’s recommended to add at least one other administrator besides yourself."
        },
        addMembers: {
            invitationExpiry: "Invitation is valid for 30 days",
            expiryDate: "Membership expiry date",
            expiryDateTooltip: "The membership expiry date is an optional date after which this membership will be ended.",
            headers: {
                addMembersHeader: "Add Members",
                additionalInformationHeader: "Additional information",
                invitationLanguageHeader: "Invitation language",
                roleHeader: "The intended role for the invitees"

            },
            buttons: {
                add: "Add members",
                sendInvite: "Send invite",
                addAdministrator: "Add administrator",
                cancel: "cancel",
                addEmails: "Add",
                languageRadio: {
                    nl: "Dutch",
                    en: "English"
                },
                languageCode: {
                    nl: "DUTCH",
                    en: "ENGLISH"
                }
            },
            placeholders: {
                emails: "Enter email addresses or copy / paste a csv or comma separated file",
                customMessage: "Add a personal note to your invitation",
            },
            errors: {
                invalidEmails: "The following email addresses were invalid: {{attribute}}",
                noInput: "At least one valid email address is required"
            }
        },
        includeTeam: "Include team",
        columns: {
            name: "Name",
            idp: "IdP",
            email: "Email",
            role: "Role",
            joined: "Joined",
            bin: ""
        },
        filters: {
            all: 'All',
            owner: "Owners",
            admin: "Admins",
            manager: "Managers",
            member: "Members",
            invitee: "Invitees",
            join_request: "Join requests"
        },
        confirmations: {
            removeMember: "Are you sure you want to remove this member?",
            removeExternalTeam: "Are you sure you want to unlink this included team?",
            removeInvitation: "Are you sure you want to remove this invitation?",
            resendInvitation: "Are you sure you want to resend this invitation?",
            removeJoinRequest: "Are you sure you want to remove this join request?",
            approveJoinRequest: "Are you sure you want to approve this join request?",
            rejectJoinRequest: "Are you sure you want to reject this join request?",
            downgrade: "Are you sure you want to downgrade your role? You can not revert this.",
            expiryDate: "You can change / reset the expiry date and confirm if you're sure."
        },
        flash: {
            removeMember: "Member has been removed",
            removeInvitation: "Invitation has been removed",
            sendInvitation: "Invitation(s) have been sent",
            resendInvitation: "Invitation has been resent",
            removeJoinRequest: "Join request has been removed",
            approveJoinRequest: "Join request has been approved",
            rejectJoinRequest: "Join request has been denied",
            memberChanged: "Role for {{name}} changed to {{newRole}}",
            expiryDateChanged: "Expiry date for {{name}} is updated",
        },
        idp: {
            unknown: "Unknown / invited user",
            guest: "User joined with guest account",
            idp: "User joined with institutional account",
        }
    },
    profile: {
        admin: "Admin",
        guest: "Guest",
        email: "Email",
        name: "Name",
        role: "Role",
        logout: "Logout",
        true: "{{productName}} guest",
        false: "{{productName}} admin"
    },
    roles: {
        guest: "Guest",
        member: "Member",
        manager: "Manager",
        admin: "Admin",
        owner: "Owner",
        title: "You're {{role}}"
    },
    details: {
        leave: "Leave team",
        delete: "Delete team",
        edit: "Edit team",
        confirmations: {
            leave: "Are you sure you want to leave this team?",
            delete: "Are you sure you want to delete this team?"
        }
    },
    newTeam: {
        name: "Name",
        description: "Team purpose",
        visibility: "Team privacy",
        backupEmail: "Backup admin",
        personalNote: "Personal note",
        invitationMessage: "Invitation message",
        public: "Public team",
        publicInfo: "List team in public team index. Others can request membership",
        private: "Private team",
        privateInfo: "Don't list antwhere. This team is member only",
        object: "Team",
        publicLinkDisabled: "Public link enabled",
        hideMembers: "Hide members from each other",
        publicLinkReset: "Reset public link",
        publicLinkResetConfirmation: "Are you sure you want to reset the public link? The current public link will be no longer valid.",
        placeholders: {
            name: "Enter name (can not be altered)",
            markDown: "Markdown supported",
            backupEmail: "Email(s) of the backup admin",
            invitationMessage: "Personal message for your backup admin",
        },
        tooltips: {
            description: "The purpose of the team. Will be shown to new members who accept an invitation.",
            personalNote: "This note is only visible for you and other administrators of this Team. You can use this field to specify what this Team is used for, for instance.",
            immutableName: "The name of a team can not be changed once the team is created",
            publicLinkDisabled: "If enabled, people who have the public link can join the Team as member without the need for approval by admins or managers.",
            hideMembers: "If enabled, team members can't see their fellow members. Consider this if the team is solely used for authorization"
        },
        flash: {
            created: "Team {{name}} is created",
            updated: "Team {{name}} is updated"
        },
        create: "Create team",
    },
    invitationForm: {
        header: "Resend invitation",
        email: "Email address of the invitee",
        created: "Originally sent at",
        expiryDate: "Membership expiry date",
        noExpires: "No expiry date",
        message: "Personal message",
        messagePlaceholder: "Personal message for the invitee",
        role: "Intended role",
        language: "Language"
    },
    joinRequestForm: {
        header: "Join request",
        email: "Email address of person who requests to join",
        created: "Sent at",
        message: "Message",
        name: "Name of person who requests to join",
    },
    joinRequest: {
        flash: "Join request has been sent",
        teamAdmins: "Administrators",
        invitationMessage: "Personal message",
        invitationMessagePlaceholder: "Your personal message for the administrators explaining why you want to join this team",
        existingJoinRequest: "Pending join request",
        existingJoinRequestDetails: "You have already requested to join this Team on {{date}}"
    },
    externalTeams: {
        header: "Include institutional teams",
        info: "Institutional teams are groups of people provided by your institution to {{productName}}. Only those you are a member of, are shown.",
        info2: "You can link institutional teams to any team you manage within {{productName}}. The result is that all members of that institutional team will also be a member of your team.",
        table: {
            name: "Name",
            linked: "Linked"
        }
    },
    forms: {
        cancel: "Cancel",
        delete: "Delete",
        submit: "Submit",
        save: "Save",
        search: "Search",
        update: "Update",
        resend: "Resend",
        approve: "Approve",
        reject: "Reject",
        edit: "Edit",
        back: "Back",
        skip: "Skip",
        required: "{{attribute}} is a required field",
        alreadyExists: "A {{object}} with {{attribute}} {{value}} already exists.",
        invalid: "Value {{value}} for {{attribute}} is invalid."
    },
    languages: {
        DUTCH: "Dutch",
        ENGLISH: "English"
    },
    breadcrumbs: {
        myTeams: "My teams",
        newTeam: "Create new team",
        editTeam: "Edit {{name}}",
        joinRequest: "Join request from {{name}}",
        userJoinRequest: "Join request",
        invitation: "Invitation for {{email}}"
    },
    confirmationDialog: {
        title: "Please confirm",
        confirm: "Confirm",
        cancel: "Cancel",
        questions: {
            delete: "Are you sure you want to delete {{object}} {{name}}?"
        }
    },
    footer: {
        faq: "<a href='https://support.surfconext.nl/teams-en' referrerpolicy='origin'>FAQ</a>",
        terms: "<a href='https://support.surfconext.nl/terms-en' referrerpolicy='origin'>Terms of use</a>",
        privacy: "<a href='https://support.surfconext.nl/privacy-en' referrerpolicy='origin'>Privacy policy</a>"
    },
    teamWelcomeDialog: {
        title: "Welcome to {{name}}",
        header: "Your role is {{role}}",
        proceed: "All good, show me the team",
        expired: "This invitation has expired.",
        denied: "Bummer...",
        titleDenied: "You can't join team {{name}}",
        alreadyMember: "You are already a member of this team."
    },
    emails: {
        singleInvalid: "Invalid email address: {{emails}}",
        multipleInvalid: "Invalid email addresses: {{emails}}"
    },
    missingAttributes: {
        title: "Missing attributes",
        missingAttribute: "You have successfully logged in, however, {{productName}} did not receive all the necessary attributes to function properly.",
        missingAttributeDescriptionHtml: "Please visit the <a href=\"{{helpUrl}}\">{{productName}} help pages</a> to see what you can do about this.",
        missingAttributesNotProvided: "Attribute(s) missing:",
        attributes: {
            name: "Name",
            email: "Email"
        }
    },

};

export default I18n.translations.en;
