import spinner from "../lib/spin";
import {isEmpty} from "../utils/utils";

const apiPath = "/api/teams/";
let csrfToken = null;

function apiUrl(path) {
    return apiPath + path;
}

function validateResponse(res) {
    spinner.stop();

    if (!res.ok) {
        const error = new Error(res.statusText);
        error.response = res;
        throw error;
    }

    csrfToken = res.headers.get("x-csrf-token");

    const sessionAlive = res.headers.get("x-session-alive");

    if (sessionAlive !== "true") {
        window.location.reload(true);
    }

    return res;
}

function validFetch(path, options, headers = {}) {
    const contentHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
        ...headers
    };

    const fetchOptions = Object.assign({}, {headers: contentHeaders}, options, {
        credentials: "same-origin"
    });
    spinner.start();
    return fetch(apiUrl(path), fetchOptions)
        .catch(err => {
            spinner.stop();
            throw err;
        })
        .then(validateResponse);
}

function fetchJson(path, options = {}, headers = {}) {
    return validFetch(path, options, headers)
        .then(res => res.json());
}

function postPutJson(path, body) {
    const method = body.id === undefined ? "post" : "put";
    return fetchJson(path, {method: method, body: JSON.stringify(body)});
}

function fetchDelete(path) {
    return validFetch(path, {method: "delete"});
}

//API
export function getMyTeams() {
    return fetchJson("my-teams");
}

export function getTeamDetail(id) {
    return fetchJson("teams/" + id);
}

export function getUser() {
    return fetchJson("users/me");
}

export function autoCompleteTeam(query) {
    return isEmpty(query) || query.length < 3 ? Promise.resolve([]) : fetchJson("teams?query=" + encodeURIComponent(query));
}

export function autoCompletePerson(query) {
    return isEmpty(query) || query.length < 3 ? Promise.resolve([]) : fetchJson("users?query=" + encodeURIComponent(query));
}

export function deleteTeam(id) {
    return fetchDelete("teams/" + id);
}

export function saveTeam(teamProperties) {
    return postPutJson("teams", teamProperties);
}

export function leaveTeam(membershipId) {
    return fetchDelete("membership/" + membershipId);
}

export function teamExistsByName(name) {
    return fetchJson("team-exists-by-name?name=" + encodeURIComponent(name));
}

export function invite(invitation) {
    return postPutJson("invitations", invitation);
}

export function linkExternalTeam(teamId, externalTeamId) {
    return postPutJson("teams/external", {teamId: teamId, externalTeamId: externalTeamId});
}

