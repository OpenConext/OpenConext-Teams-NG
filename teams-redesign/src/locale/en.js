import I18n from "i18n-js";

I18n.translations.en = {
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
        }
    },
    publicTeams: {
        columns: {
            title: "Title",
            description: "Description",
            join: ""
        },
        joinRequest: "Request to join",
        alreadyMember: "Already a member"
    },
    teamDetails: {
        members: "Members",
        hideInvitees: "Hide invitees",
        noInvitees: "No invitees",
        inviteSent: "invite sent",
        joinRequest: "join request",
        alerts: {singleAdmin: "It’s recommended to add at least one other administrator besides yourself."},
        addMembers: {
            uploadFile: "You can also upload a csv or txt file.",
            invitationExpiry: "Invitation expires after 30 days",
            headers: {
                addMembersHeader: "Add Members",
                addRolesHeader: "Add roles",
                additionalInformationHeader: "Additional information",
                invitationLanguageHeader: "Invitation language"
            },
            buttons: {
                add: "Add members",
                sendInvite: "Send invite",
                cancel: "cancel",
                addEmails: "Add",
                languageRadio: {
                    dutch: "Dutch",
                    english: "English"
                }
            },
            placeholders: {
                emails: "Emails, comma seperated",
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
        },
        flash: {
            removeMember: "Member is removed",
            removeInvitation: "Invitation is removed",
            resendInvitation: "Invitation is resend",
            removeJoinRequest: "Join request has been removed",
            approveJoinRequest: "Join request has been approved",
            rejectJoinRequest: "Join request has been denied",
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
        invitationMessage: "Note",
        public: "Public team",
        publicInfo: "List team in public team index. Others can request membership",
        private: "Private team",
        privateInfo: "Don't list antwhere. This team is member only",
        object: "Team",
        placeholders: {
            name: "Enter name (can not be altered)",
            markDown: "Markdown supported",
            backupEmail: "Email(s) of the backup admin",
            invitationMessage: "Message for your backup admin"
        },
        tooltips: {
            description: "The purpose of the team. Will be show to new members who accept an invitation."
        },
        flash: {
            created: "Team {{name}} is created"
        },
        create: "Create team"
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
    }
};

export default I18n.translations.en;
