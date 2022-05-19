//sneaky, but alternative is redux and that is overkill
export let backPage = null;
export let isSuperAdmin = false;

export function setBackPage(page) {
    backPage = page;
}

export function clearBackPage() {
    backPage = null;
}

export function setSuperAdmin(superAdmin) {
    isSuperAdmin = superAdmin;
}
