import {EventEmitter} from "events";

export const emitter = new EventEmitter();

let flash = null;
let timeout = null;

export function getFlash() {
    const tempFlash = flash;
    timeout = setTimeout(() => flash = null, 100);
    return tempFlash;
}

export function setFlash(message, type) {
    clearTimeout(timeout);
    flash = {message, type: type || "info"};
    emitter.emit("flash", flash);
}

export function clearFlash() {
    clearTimeout(timeout);
    emitter.emit("flash", {});
}

export function handleServerError(err) {
    err.response.json().then(json => {
        setFlash(JSON.stringify(json, null, 4), "error");
        window.scrollTo(0, 0);
    });
}

