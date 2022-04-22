import I18n from "i18n-js";

I18n.translations.nl = {
    code: "NL",
    myteams: {
        tabs:{
            myteams:"My teams",
            publicteams:"Public teams"
        },
        columns: {
            title: "Title",
            members: "Members",
            private: "",
            member: "",
            bin: ""
        },
        filters: {
            all: 'All teams',
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
        confirmations: {
            delete: "Are you sure you want to delete this team?"
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

        create: "Create team"
    },
    forms: {
        cancel: "Cancel",
        delete: "Delete",
        submit: "Submit",
        save: "Save",
        update: "Update",
        edit: "Edit",
        required: "{{attribute}} is a required attribute",
        alreadyExists: "A {{object}} with {{attribute}} {{value}} already exists.",
        invalid: "{{value}} for {{attribute}} is invalid."
    },
    breadcrumbs: {
        myTeams: "My teams",
        newTeam: "Create new team"
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

export default I18n.translations.nl;
