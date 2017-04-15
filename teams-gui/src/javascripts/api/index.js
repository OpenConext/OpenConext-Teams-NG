import spinner from "../lib/spin";

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

export function parseJson(res) {
  return res.json();
}

function validFetch(path, options) {
  const contentHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": csrfToken
  };

  const fetchOptions = Object.assign({}, { headers: { ...contentHeaders } }, options, {
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

export function fetchJson(path, options = {}) {
  return validFetch(path, options)
  .then(parseJson);
}

function postPutJson(path, body, options = {}) {
  const method = body.id === undefined ? "post" : "put"   ;
  return validFetch(path, Object.assign({}, { method: method, body: JSON.stringify(body),headers: {
      "Content-Type": "application/json"
  } }, options));
}

export function fetchDelete(path) {
  return validFetch(path, { method: "delete" });
}

export function getMyTeams() {
    return fetchJson('my-teams');
}

export function getTeamDetail(id) {
    return fetchJson('teams/' + id);
}

export function getUser() {
    return fetchJson("users/me");
}

export function autoComplete(query) {
    return fetchJson('teams?query=' + encodeURIComponent(query));
}

export function deleteTeam(id) {
    return fetchDelete('teams/' + id);
}

export function saveTeam(team) {
    return this.postPutJson('teams', team);
}

export function teamExistsByName(name) {
    return this.doFetch('team-exists-by-name?query=' + encodeURIComponent(name), callback);
}

