import {EventEmitter} from "events";
import {stopEvent} from "../utils/utils";

export const emitter = new EventEmitter();

//Sneaky global state
let flash = {};

export function setFlash(message, type) {
    flash = {msg: message, type: type || "info"};
    emitter.emit("flash", flash);
}

export function clearFlash(e) {
    stopEvent(e);
    emitter.emit("flash", {});
}