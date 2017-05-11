import {EventEmitter} from "events";
import {isEmpty} from "./utils";

export const emitter = new EventEmitter();

let flash = {};

export function getFlash() {
    return {...flash};
}

export function setFlash(message, type) {
    flash = {message, type: type || "info"};
    emitter.emit("flash", flash);
}

export function clearFlash() {
    emitter.emit("flash", {});
}

export function clearFlashDependencies() {
    emitter.emit("clear_flash", {});
}

export function handleServerError(err) {
    if (isEmpty(err.response) || isEmpty(err.response.json)) {
        throw err;
    }
    err.response.json().then(json => {
        setFlash(JSON.stringify(json, null, 4), "error");
    });
}

