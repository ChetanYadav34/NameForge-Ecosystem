"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGenerationStore = void 0;
var zustand_1 = require("zustand");
exports.useGenerationStore = (0, zustand_1.create)(function (set) { return ({
    currentInput: '',
    seeds: [],
    isGenerating: false,
    fsmState: 'IDLE',
    results: [],
    setInput: function (input) { return set({ currentInput: input }); },
    addSeed: function (seed) { return set(function (state) { return ({
        seeds: __spreadArray(__spreadArray([], state.seeds, true), [__assign(__assign({}, seed), { id: crypto.randomUUID() })], false)
    }); }); },
    removeSeed: function (id) { return set(function (state) { return ({
        seeds: state.seeds.filter(function (s) { return s.id !== id; })
    }); }); },
    setGenerating: function (isGenerating) { return set({ isGenerating: isGenerating }); },
    setFsmState: function (fsmState) { return set({ fsmState: fsmState }); },
    addResult: function (result) { return set(function (state) { return ({
        results: __spreadArray(__spreadArray([], state.results, true), [result], false)
    }); }); },
    clearResults: function () { return set({ results: [] }); }
}); });
