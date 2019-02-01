// Interpolation works as follows:
//
// Make a key with the translation and enclose the variable with {{}}
// ie "Hello {{name}}" Do not add any spaces around the variable name.
// Provide the values as: I18n.t("key", {name: "John Doe"})
import I18n from "i18n-js";

I18n.translations.pt = {
    code: "PT",
    name: "Português",
    select_locale: "Seleccionar Português",

    boolean: {
        yes: "Sim",
        no: "Não"
    },

    date: {
        month_names: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Septembro", "Outubro", "Novembro", "Dezembro"]
    },

    header: {
        title: "Grupos",
        links: {
            logout: "Logout",
            exit: "Sair",
            help: "Ajuda"
        },
        role: "Perfil"
    },

    navigation: {
        my_teams: "Os Meus Grupos",
        institution_teams: "Grupos Institucionais"
    },

    error_dialog: {
        title: "erro inesperado",
        body: "Isto é embaraçoso; ocorreu um erro inesperado. O erro foi registado e reportado. Por favor tente de novo. Continua a não funcionar? Carregue em 'Ajuda'.",
        ok: "Fechar"
    },

    confirmation_dialog: {
        title: "Confirme por favor",
        confirm: "Confirmar",
        cancel: "Cancelar",
        leavePage: "Pretende mesmo sair desta página?",
        leavePageSub: "A alteração realizadas não serão gravadas.",
        stay: "Ficar",
        leave: "Sair"
    },

    teams: {
        title: "Os Meus Grupos",
        name: "Nome do Grupo",
        viewable: "Público",
        viewableTooltip: "Outros usuários do SURFconext Teams<br/>podem encontrar equipes públicas e solicitar associação.<br/>Arquivos não públicos são ocultados para não-membros.<br/>Os administradores podem alterar essa<br/>configuração na página de configurações de Equipes.",
        description: "Descrição",
        searchPlaceHolder: "Procurar todos os grupos públicos...",
        role: "O Meu Perfil",
        membershipCount: "Membros",
        actions: "",
        actions_phone: "Acções",
        edit: "Editar",
        delete: "Apagar",
        join: "JOIN",
        received_join_request: "1 convite recebido",
        received_join_requests: "{{count}} convites recebidos",
        pending_invitation: "1 convite pendente",
        pending_invitations: "{{count}} convites pendentes",
        no_found: "Ainda não é membro de qualquer Grupo",
        filtered: "Filtrou todos os seus Grupos",
        add: "ADICIONAR",
        join_request: "Convite: ",
        created: "Data: ",
        message: "Mensagem: ",
        action_options: {
            join_request_resend: "Reenviar convite",
            join_request_remove: "Apagar convite",
            invite_member: "Convidar membro",
            team_delete: "Apagar grupo",
            team_details: "Detalhes do grupo"
        },
        confirmations: {
            team_delete: "Tem a certeza que pretente apagar o Grupo {{name}}?",
            join_request_delete: "Tem a certeza que pretende apagar a solicitação de se juntar ao Grupo {{name}}?",
        },
        flash: {
            team: "O Grupo {{name}} foi {{action}} com sucesso",
            updated: "actualizado",
            created: "criado",
            deleted: "apagado",
            join_request_deleted: "O convite para o Grupo {{name}} foi apagado"
        }
    },

    teams_autocomplete: {
        name: "nome",
        results_limited: "Mais entradas correspondidas do que as que podem ser exibidas. Por favor, restrinja o seu termo de pesquisa ..."
    },

    team_detail: {
        back: "VOLTAR PARA OS MEUS GRUPOS",
        urn: "Identificador",
        description: "Descrição",
        personalNote: "Nota pessoal",
        viewable: "Grupos Públicos",
        viewable_info: "Ao tornar o grupo público, outros utilizadores podem encontrar o grupo e solicitar a sua afiliação. Os nomes e endereços de e-mail dos administradores também ficam visíveis.",
        name: "Nome",
        actions: "...",
        leave: "Sair do Grupo",
        team_members: "MEMBROS ({{count}})",
        team_groups: "GRUPOS INSTITUCIONAIS LIGADOS ({{count}})",
        membership: {
            name: "nome",
            email: "email",
            status: "estado",
            expiry_date: "data expiração",
            role: "perfil",
            actions: "",
        },
        email: "Email",
        intended_role: "Perfil pretendido",
        actions_phone: "Acções",
        status: "Estado",
        expiry_date: "Data expiração",
        role: "Perfil",
        pending: "PENDENTE",
        resend_invitation: "Enviar convite de novo",
        delete: "Apagar",
        edit: "Editar",
        invite: "Convidar",
        link_to_institution_team: "Adicionar",
        search_members_placeholder: "Procurar membro",
        no_found: "Não foram encontrado membros",
        public_link: "Endereço Público",
        public_link_disabled: "Se activado, pessoas com o endereço público podem juntar-se ao Grupo como membro sem necessitar de aprovação dos Administradores ou Gestores.",
        copy: "Copiar para a memória",
        copied: "Copiado",
        one_admin_warning: "É o único administrador do Grupo. É altamente recomendado existirem pelo menos dois Administradores em cada Grupo.",
        add: "CONVITE",
        linked: "Ligado",
        action_options: {
            join_request_accept: "Convite aceite",
            join_request_reject: "Convite rejeitado",
            invite_resend: "Enviar convite de novo",
            invite_delete: "Apagar convite",
            member_delete: "Apagar membro",
            member_leave: "Sair do Grupo",
            member_send_email: "Enviar email"
        },
        confirmations: {
            delete_team: "Tem a certeza que pretende apagar o Grupo {{name}}?",
            leave_team: "Tem a certeza que pretende sair do Grupo {{name}}?",
            delete_member: "Tem a certeza que pretende apagar a associação de {{name}}?",
            accept_join_request: "Tem a certeza que pretende aprovar o pedido de associação de {{name}}?",
            reject_join_request: "Tem certeza de que deseja rejeitar a solicitação de participação de {{name}}?",
            delete_invitation: "Tem a certeza que pretende apagar o convite para {{name}}?",
            downgrade_current_user: "Tem a certeza que não pretende ser mais administrador do Grupo {{name}}? Não poderá reverter esta acção sozinho.",
        },
        flash: {
            deleted: "Grupo apagado com sucesso {{name}}.",
            role_changed: "O perfil para {{name}} alterado para {{role}}.",
            left: "Saiu do Grupo {{name}} com sucesso.",
            deleted_member: "Eliminou com sucesso a associação para {{name}}.",
            deleted_invitation: "Eliminou com sucesso o convite para {{name}}.",
            accepted_join_request: "Pedido de associação aceite por {{name}}.",
            rejected_join_request: "Pedido de associação reejitado por {{name}}.",
            linked_institutional_team: "Pedido de ligação ao Grupo Institucional {{team}} aceite para {{name}}.",
            unlinked_institutional_team: "Pedido de ligação ao Grupo Institucional {{team}} rejeitado por {{name}}."
        }

    },
    join_request: {
        title: "Convite",
        team: {
            name: "Nome Grupo",
            description: "Descrição",
            admins: "Administradores",
        },
        cancel: "Cancelar",
        submit: "Submeter convite",
        resubmit: "Enviar de novo",
        flash: "O seu pedido para se juntar {{name}} foi enviado aos administradores",
        previous: "Pedido pendente",
        previous_message: "Já enviou um pedido de associação para este Grupo a {{date}}",
        share_info: "Compartilhe esta informação com as aplicações usadas neste Grupo.",
        approval_required: "Deve aprovar que esta informação deve ser partilhada",
        message: "Mensagem",
        message_info: "A mensagem pessoal deste convite para o administrador do grupo",
        message_placeholder: "A sua mensagem pessoal",
    },
    icon_legend: {
        admin: "Administrador",
        manager: "Gestor",
        member: "Membro",
        invitation: "Convite",
        join_request: "Join Request"
    },
    sort: {
        label: "ORDENADO POR",
        name: "Nome",
        status: "Estado",
        email: "Email",
        role: "Perfil",
        description: "Descrição",
        expiryDate: "Data de Expiração",
        membershipCount: "Membros",
        viewable: "Público",
        linked: "Ligado"
    },
    filter: {
        ADMIN: "Administradores",
        MANAGER: "Gestores",
        MEMBER: "Membros",
        JOIN_REQUEST: "Join requests",
        INVITATION: "Convites",
        label: "MOSTRAR",
        all: "TODOS",
        selected: "FILTRADO",

    },

    new_team: {
        title: "Novo Grupo",
        name: "Nome do Grupo",
        name_info: "O nome do Grupo não pode ser alterado assim que tenha sido criado.",
        format_error: "Os caracteres permitidos para o nome de um grupo são, caracteres alfanuméricos, espaços, hífen e o separador “‘”. Poderá ter um tamanho máximo de 255 caracteres..",
        already_exists_error: "Já existe um Grupo com este nome",
        required: "O nome é obrigatório",
        description: "Descrição",
        description_info: "A descrição do Grupo é visível a qualquer pessoa se tornar este Grupo como público. Caso contrário, apenas os membros do Grupo podem visualizar a descrição.",
        viewable_info: "Liste essa equipe no índice público de equipes para que outras pessoas possam ver as informações da equipe e solicitar a associação a essa equipe.",
        personal_note: "Nota pessoal",
        personal_note_info: "Esta nota só é visível para você e outros administradores desta equipe. Você pode usar este campo para especificar o que essa equipe é usada, por exemplo.",
        admins: "administradores",
        admins_info: "É extremamente recomendado convidar outro Administrador.",
        admins_email_placeholder: "Adicionar um endereço de email para que haja outro Administrador...",
        invalid_email: "Endereço de email inválido",
        invitation_message: "Messagem",
        invitation_message_info: "Mensagem pessoal para o colega Administrador deste grupo",
        invitation_language: "Idioma do convite",
        current_user: "{{name}} (é você)",
        share_info: "Compartilhe esta informação com as aplicações usadas neste Grupo.",
        approval_required: "Deve aprovar que esta informação deve ser partilhada",
        submit: "CRIAR",
        cancel: "CANCELAR",
        cancel_confirmation: "Tem a certeza que pretende sair deste grupo?"
    },
    invite: {
        title: "Convidar membro",
        email: "Adicionar membros por endereço de email",
        emails_placeholder: "Indique um ou mais endereços de email...",
        email_required: "Email is required - either add an email address or select a file containing comma separated email addresses",
        email_invalid: "O formato do email é inválido.",
        file_import: "Add members by file import",
        file_placeholder: "Seleccione um ficheiro csv ou txt...",
        file_import_result: "Importar {{nbr}} emails a partir de {{fileName}}",
        file_extension_error: "Only .csv extension files are allowed",
        role: "Perfil no grupo",
        invitation_language: "Idioma do convite",
        expiry_date: "Data de expiração",
        expiry_date_placeholder: "Expiry date for membership",
        expiry_date_none: "Nenhum",
        message: "Mensagem",
        message_info: "Sua mensagem de convite pessoal",
        submit: "Convidar membros",
        cancel: "Cancelar",
        flash: "O convite foi enviado",
        flash_resent: "O email de lembrete foi enviado",
        message_placeholder: "Mensagem pessoal a ser incluída no email de convite",
        expiry_data_info: "A data de expiração é a data de expiração da associação desta Equipe (se este convite for aceito). Ao definir uma data de expiração, um membro será removido automaticamente desta equipe após o vencimento da data de expiração. Esta não é a data de expiração do convite."
    },
    invitation: {
        title: "Convite recebido para o Grupo '{{name}}'",
        invalid_title: "Convite inválido",
        team: {
            name: "Nome do Grupo",
            description: "Descrição",
            admins: "Administradores",
            role: "O seu perfil futuro"
        },
        cancel: "Cancelar",
        deny: "Decline",
        deny_confirmation: "Tem certeza de que deseja recusar este convite?",
        accept: "Aceitar",
        denied: "declined",
        share_info: "Compartilhe esta informação com as aplicações usadas neste Grupo.",
        approval_required: "Deve aprovar que esta informação deve ser partilhada",
        message: "Messagem",
        message_info: "A mensagem de convite pessoal que você recebeu com o convite",
        flash: {
            "accept": "Você aderiu com sucesso ao Grupo {{name}}.",
            "deny": "Você negou com sucesso a adesão ao Grupo {{name}}."
        },
        invalid: {
            not_found: "O convite expirou e foi removido ou você não foi convidado.",
            accepted: "Você já aceitou este convite.",
            declined: "Você já recusou este convite.",
            expired: "Este convite expirou.",
            already_member: "Você já é um membro desta equipe",
            join_request: "juntar pedido",
            join_request_1: " Você pode enviar uma ",
            join_request_2: " se você quiser se tornar um membro."
        }
    },
    public_link: {
        title: "Endereço público para aderir ao Grupo '{{name}}'",
        invalid_title: "Endereço público inválido",
        team: {
            name: "Nome do Grupo",
            description: "Descrição",
            admins: "Administradores",
            role: "O seu perfil futur"
        },
        cancel: "Cancelar",
        accept: "Aceitar",
        share_info: "Compartilhe esta informação com as aplicações usadas neste Grupo.",
        approval_required: "Deve aprovar que esta informação deve ser partilhada",
        flash: {
            "accept": "Você juntou-se ao Grupo {{name}} com sucesso.",
            "deny": "Você rejeitou com sucesso o endereço público para se tornar membro do Grupo {{name}}."
        },
        invalid: {
            not_found: "Este é um endereço público inválido.",
            already_member: "Você já é membro deste Grupo",
            join_request: "convite",
            join_request_1: " Você pode enviar um ",
            join_request_2: " se pretender tornar-se membro."
        }
    },
    institution_teams: {
        name: "Nome do Grupo / identificador",
        help: "Explicar",
        description: "Descrições",
        linked_teams: "Grupos institucionais ligados",
        searchPlaceHolder: "Procurar grupos",
        filtered: "Nenhum Grupo institucional encontrado",
        institution_team: "Grupo Institucional",
        no_teams: "A sua instituição não fornece nenhum Grupo ou você não é membro de nenhum Grupo Institucional.",

    },
    linked_institution_example: {
        title: "Grupos Institucionais explicados",
        institution_name: "Universidade de Lisboa",
        institution_team_name: "Professores",
        surf_name: "Administradores"
    },
    profile: {
        email: "Email",
        name: "Nome",
        role: "Perfil",
        true: "{{productName}} convidado",
        false: "{{productName}} membros"
    },

    auto_complete: {
        no_results: "Sem resultados"
    },

    not_found: {
        title: "Não foi encontrada a página solicitada.",
        description_html: "Por favor, tente mais tarde ou envie um email para <a href=\"mailto:{{helpMail}}\">{{helpMail}}</a>."
    },

    server_error: {
        title: "{{productName}} está indisponível no momento devido a um problema técnico.",
        description_html: "Por favor, tente mais tarde ou envie um email para <a href=\"mailto:{{helpMail}}\">{{helpMail}}</a>.",
        missing_attribute: "A autenticação foi efetuada com sucesso, contudo, {{productName}} não recebeu todos os atributos necessários para funcionar corretamente.",
        missing_attribute_description_html: "Por favor visite a <a href=\"{{helpUrl}}\">{{productName}} página de ajuda</a> o que poderá fazer sobre esta situação.",
        missing_attribute_not_provided: "Atributo(s) em falta:"
    },

    logout: {
        title: "Logout efetuado com successo.",
        description_html: "Você <strong>DEVE</strong> fechar o seu browser para terminar o processo de logout."
    },

    footer: {
        terms: "Termos do Serviço"
    }

};

export default I18n.translations.pt;
