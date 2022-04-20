import I18n from "i18n-js";

I18n.translations.en = {
    code: "EN",
    myteams: {
        columns: {
            title: "Title",
            members: "Members",
            private: "",
            member: "",
            bin: ""
        },
        filters:{
          all: 'All teams',
          owner: "Owner of",
          admin: "Admin of",
          manager: "Manager of",
          member: "Member of"  
        },
        empty: "",
        private: "Private team",
        add_members: "Add members"
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
    breadcrumbs: {
        myTeams: "My teams"
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
