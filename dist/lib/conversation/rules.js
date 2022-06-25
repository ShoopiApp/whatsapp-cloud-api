"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rules = /** @class */ (function () {
    function Rules() {
    }
    Rules.getInstance = function () {
        if (!Rules.instance) {
            Rules.instance = new Rules();
        }
        return Rules.instance;
    };
    Rules.prototype.setRules = function (rules) {
        this.rules = rules;
    };
    Rules.prototype.checkParagraph = function (text) {
        var words = text.split(" ");
        return this.rules.find(function (r) {
            var _a;
            var count = 0;
            (_a = r.triggers) === null || _a === void 0 ? void 0 : _a.filter(function (item) { return words.forEach(function (w) { return (w.toLowerCase() === item ? count++ : null); }); });
            //Check if have minimun matchs
            return count >= (r.matchs || 1);
        });
    };
    Rules.prototype.validateMessage = function (type, text) {
        return this.rules.find(function (r) { return r.type === type && r.button_id === text; }) || this.checkParagraph(text);
    };
    return Rules;
}());
exports.default = Rules;
//# sourceMappingURL=rules.js.map