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
        "X-CSRF-TOKEN": csrfToken
    };

    const fetchOptions = Object.assign({}, {headers: {...contentHeaders, ...headers}}, options, {
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

function postPutJson(path, body, options = {}, headers = {}) {
    const method = body.id === undefined ? "post" : "put";
    return fetchJson(path, Object.assign({}, {method: method, body: JSON.stringify(body)}, options, headers));
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

export function autoComplete(query) {
    return isEmpty(query) || query.length < 3 ? Promise.resolve([]) : fetchJson("teams?query=" + encodeURIComponent(query));
}

export function deleteTeam(id) {
    return fetchDelete("teams/" + id);
}

export function saveTeam(team) {
    return postPutJson("teams", team);
}

export function leaveTeam(membershipId) {
    return fetchDelete("membership/" + membershipId);
}

export function teamExistsByName(name) {
    return fetchJson("team-exists-by-name?query=" + encodeURIComponent(name));
}

export function invite(invitation, lang) {
    return postPutJson("invitations", invitation, {}, {"Accept-Language": lang});
}

export function linkExternalTeam(teamId, externalTeamId) {
    return postPutJson("teams/external", {teamId: teamId, externalTeamId: externalTeamId});
}

