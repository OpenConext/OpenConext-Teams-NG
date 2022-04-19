const apiPath = "/api/teams/";
let csrfToken = null;

const apiUrl = path => {
    return apiPath + path;
}

function validateResponse(showErrorDialog) {
    return res => {

        if (!res.ok) {
            if (res.type === "opaqueredirect") {
                setTimeout(() => window.location.reload(true), 100);
                return res;
            }
            const error = new Error(res.statusText);
            error.response = res;
            if (showErrorDialog) {
                setTimeout(() => {
                    const error = new Error(res.statusText);
                    error.response = res;
                    throw error;
                }, 100);
            }
            throw error;
        }
        csrfToken = res.headers.get("x-csrf-token");

        const sessionAlive = res.headers.get("x-session-alive");

        if (sessionAlive !== "true") {
            window.location.reload(true);
        }
        return res;

    };
}

function validFetch(path, options, headers = {}, showErrorDialog = true) {
    const contentHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
        "X-ADMIN-HEADER": false,
        ...headers
    };

    const fetchOptions = Object.assign({}, {headers: contentHeaders}, options, {
        credentials: "same-origin",
        redirect: "manual"
    });
    return fetch(apiUrl(path), fetchOptions)
        .catch(err => {
            throw err;
        })
        .then(validateResponse(showErrorDialog));
}

function fetchJson(path, options = {}, headers = {}, showErrorDialog = true) {
    return validFetch(path, options, headers, showErrorDialog)
        .then(res => res.json());
}

function postPutJson(path, body = {}, method) {
    const httpMethod = method || (body.id === undefined ? "post" : "put");
    return fetchJson(path, {method: httpMethod, body: JSON.stringify(body)});
}

function fetchDelete(path) {
    return validFetch(path, {method: "delete"});
}

//API
export function getMyTeams() {
    return fetchJson("my-teams");
}

export function getTeamDetail(id, showErrorDialog = true) {
    return fetchJson("teams/" + id, {}, {}, showErrorDialog);
}

export function teamIdFromUrn(urn) {
    return fetchJson(`teamIdFromUrn/${urn}`, {}, {}, false);
}

export function getUser() {
    return fetchJson("users/me", {}, {}, false);
}

export function autoCompleteTeam(query) {
    return isEmpty(query) || query.length < 2 ? Promise.resolve([]) : fetchJson("teams?query=" + encodeURIComponent(query));
}

export function autoCompletePerson(query) {
    return isEmpty(query) || query.length < 2 ? Promise.resolve([]) : fetchJson("users?query=" + encodeURIComponent(query));
}

export function deleteTeam(id) {
    return fetchDelete("teams/" + id);
}

export function saveTeam(teamProperties) {
    return postPutJson("teams", teamProperties);
}

export function resetPublicLink(id) {
    return postPutJson("teams/reset-public-link/" + id, {}, "put");
}

export function leaveTeam(membershipId) {
    return fetchDelete("memberships/" + membershipId);
}

export function teamExistsByName(name) {
    return fetchJson("team-exists-by-name?name=" + encodeURIComponent(name));
}

export function roleOfCurrentUserInTeam(teamId) {
    return fetchJson("memberships/" + teamId);
}

export function invite(invitation) {
    return postPutJson("invitations", invitation);
}

export function getInvitation(id) {
    return fetchJson("invitations/" + id);
}

export function getInvitationInfo(key) {
    return fetchJson("invitations/info/" + key, {}, {}, false);
}

export function denyInvitation(key) {
    return postPutJson("invitations/deny/" + key, {}, "put");
}

export function acceptInvitation(key) {
    return postPutJson("invitations/accept/" + key, {}, "put");
}

export function resendInvitation(invitation) {
    return postPutJson("invitations", invitation);
}

export function deleteInvitation(id) {
    return fetchDelete("invitations/" + id);
}

export function getPublicLink(publicLink) {
    return fetchJson("public-links/" + publicLink, {}, {}, false);
}

export function acceptPublicLink(publicLink) {
    return postPutJson("public-links/" + publicLink, {}, "put");
}

export function linkExternalTeam(teamId, externalTeamIdentifier) {
    return postPutJson("external-teams/link", {id: teamId, externalTeamIdentifier: externalTeamIdentifier});
}

export function delinkExternalTeam(teamId, externalTeamIdentifier) {
    return postPutJson("external-teams/delink", {id: teamId, externalTeamIdentifier: externalTeamIdentifier});
}

export function linkedTeams() {
    return fetchJson("external-teams/linked-teams");
}

export function deleteJoinRequest(id) {
    return fetchDelete("join-requests/" + id);
}

export function joinRequest(clientJoinRequest) {
    return postPutJson("join-requests", clientJoinRequest);
}

export function getJoinRequest(id, showErrorDialog = true) {
    return fetchJson("join-requests/" + id, {}, {}, showErrorDialog);
}

export function approveJoinRequest(id) {
    return postPutJson("join-requests/approve", {id: id});
}

export function rejectJoinRequest(id) {
    return fetchDelete("join-requests/reject/" + id);
}

export function changeRole(membershipProperties) {
    return postPutJson("memberships", membershipProperties);
}

export function deleteMember(memberId) {
    return fetchDelete("memberships/" + memberId);
}

export function reportError(error) {
    return postPutJson("error", error);
}

export function logOut() {
    return fetchDelete("users/logout");
}
