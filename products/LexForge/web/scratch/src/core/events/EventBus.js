"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionEventBus = exports.EventBus = void 0;
var EventBus = /** @class */ (function () {
    function EventBus() {
        this.listeners = {};
    }
    EventBus.prototype.on = function (eventName, fn) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(fn);
    };
    EventBus.prototype.off = function (eventName, fn) {
        var eventListeners = this.listeners[eventName];
        if (eventListeners) {
            this.listeners[eventName] = eventListeners.filter(function (listener) { return listener !== fn; });
        }
    };
    EventBus.prototype.emit = function (eventName, params) {
        var eventListeners = this.listeners[eventName];
        if (eventListeners) {
            eventListeners.forEach(function (fn) { return fn(params); });
        }
    };
    return EventBus;
}());
exports.EventBus = EventBus;
exports.InteractionEventBus = new EventBus();
