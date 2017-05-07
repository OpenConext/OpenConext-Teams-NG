import {EventEmitter} from "events";
import {isEmpty} from "./utils";

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
    window.scrollTo(0, 0);
}

export function clearFlash() {
    clearTimeout(timeout);
    emitter.emit("flash", {});
}

export function handleServerError(err) {
    if (isEmpty(err.response) || isEmpty(err.response.json)) {
        throw err;
    }
    err.response.json().then(json => {
        setFlash(JSON.stringify(json, null, 4), "error");
    });
}

