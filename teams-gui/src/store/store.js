//sneaky, but alternative is redux and that is overkill
export let isSuperAdmin = false;

export function setSuperAdmin(superAdmin) {
    isSuperAdmin = superAdmin;
}
