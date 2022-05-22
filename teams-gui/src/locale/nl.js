import I18n from "i18n-js";

I18n.translations.nl = {
    header: {
        superAdmin: {
            modus: "Super-Admin modus enabled"
        }
    },

    fileUploadDialog: {
        title: "Upload file",
        buttons: {
            cancel: "Cancel",
            upload: "Upload"
        }
    },
    code: "NL",
    myteams: {
        tabs: {
            myTeams: "My teams",
            publicTeams: "Public teams"
        },
        columns: {
            title: "Title",
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
        private: "Private team",
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
            joinRequestDeleted: "Join request {{name}} is deleted"
        }
    },
    publicTeams: {
        columns: {
            title: "Title",
            description: "Description",
            join: ""
        },
        joinRequest: "Request to join",
        alreadyMember: "Already a member",
        superAdmin: "Super admin powers",
        moreResults: "There are more matches then show. Please refine your search."
    },
    teamDetails: {
        members: "Members",
        hideInvitees: "Hide invitees",
        noInvitees: "No invitees",
        inviteSent: "invite sent",
        joinRequest: "join request",
        alerts: {
            singleAdmin: "It’s recommended to add at least one other administrator besides yourself."
        },
        addMembers: {
            invitationExpiry: "Invitation expires after 30 days",
            headers: {
                addMembersHeader: "Add Members",
                additionalInformationHeader: "Additional information",
                invitationLanguageHeader: "Invitation language",
                roleHeader: "The intended role for the invitees"

            },
            buttons: {
                add: "Add members",
                sendInvite: "Send invite",
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
                emails: "Enter emails or copy / paste a csv or comma separated file",
                customMessage: "Add a personal note to your invitation"
            },
            errors: {
                invalidEmails: "The following emails were invalid: {{attribute}}",
                noInput: "At least one valid email is required"
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
            removeInvitation: "Are you sure you want to remove this invitation?",
            resendInvitation: "Are you sure you want to resend this invitation?",
            removeJoinRequest: "Are you sure you want to remove this join request?",
            approveJoinRequest: "Are you sure you want to approve this join request?",
            rejectJoinRequest: "Are you sure you want to reject this join request?",
            downgrade: "Are you sure you want to downgrade your role? You can not revert this.",
        },
        flash: {
            removeMember: "Member is removed",
            removeInvitation: "Invitation is removed",
            sendInvitation: "Invitation(s) are send",
            resendInvitation: "Invitation is resend",
            removeJoinRequest: "Join request has been removed",
            approveJoinRequest: "Join request has been approved",
            rejectJoinRequest: "Join request has been denied",
            memberChanged: "Membership changed for {{name}} to {{newRole}}",
        },
        idp: {
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
        placeholders: {
            name: "Enter name (can not be altered)",
            markDown: "Markdown supported",
            backupEmail: "Email(s) of the backup admin",
            invitationMessage: "Personal message for your backup admin",
        },
        tooltips: {
            description: "The purpose of the team. Will be show to new members who accept an invitation.",
            personalNote: "This note is only visible for you and other administrators of this Team. You can use this field to specify what this Team is used for, for instance.",
        },
        flash: {
            created: "Team {{name}} is created",
            updated: "Team {{name}} is updated"
        },
        create: "Create team",
    },
    invitationForm: {
        header: "Resend invitation",
        email: "Email invitee",
        created: "Send at",
        message: "Personal message",
        messagePlaceholder: "Personal message for the invitee",
        role: "Intended role",
        language: "Language"
    },
    joinRequestForm: {
        header: "Join request",
        email: "Email invitee",
        created: "Send at",
        message: "Message",
        name: "Name",
    },
    joinRequest: {
        flash: "Join request is send",
        teamAdmins: "Administrators",
        invitationMessage: "Personal message",
        invitationMessagePlaceholder: "Your personal invitation message for the administrator(s) of this team",
        existingJoinRequest: "Pending join request",
        existingJoinRequestDetails: "You have already sent a join request for this Team on {{date}}",
        confirmation: "Share this information with the applications used by this team."
    },
    externalTeams: {
        header: "Include institutional teams(s)",
        info: "Institutional teams are groups of people provide by your institution to {{productName}} Teams. Only those you are a member of, are shown.",
        info2: "You can link institutional Teams to any team you manage within {{productName}} Teams. The result is that all members of that institutional team are also member of your team.",
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
        update: "Update",
        resend: "Resend",
        approve: "Approve",
        reject: "Reject",
        edit: "Edit",
        back: "Back",
        required: "{{attribute}} is a required attribute",
        alreadyExists: "A {{object}} with {{attribute}} {{value}} already exists.",
        invalid: "{{value}} for {{attribute}} is invalid."
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
        faq: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>FAQ</a>",
        terms: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>Terms of use</a>",
        privacy: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>Privacy policy</a>",
        powered: "Proudly powered by",
        surf: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>SURF</a>",
    },
    teamWelcomeDialog: {
        title: "Welcome to {{name}}",
        header: "Your role is {{role}}",
        proceed: "All good, show me the team",
        expired: "This invitation has expired.",
        denied: "Bummer...",
        titleDenied: "You can't join team {{name}}",
        alreadyMember: "You are already a member of this team."
    }
};

export default I18n.translations.nl;
