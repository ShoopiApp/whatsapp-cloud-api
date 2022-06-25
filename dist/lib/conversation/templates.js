"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Templates = /** @class */ (function () {
    function Templates() {
    }
    Templates.getInstance = function () {
        if (!Templates.instance) {
            Templates.instance = new Templates();
        }
        return Templates.instance;
    };
    Templates.prototype.setTemplate = function (templates) {
        this.templates = templates;
    };
    Templates.prototype.getTemplate = function (id) {
        return this.templates[id];
    };
    return Templates;
}());
exports.default = Templates;
//# sourceMappingURL=templates.js.map