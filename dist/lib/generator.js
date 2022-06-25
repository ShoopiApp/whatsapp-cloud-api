"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = void 0;
function id() {
    var id = "xyxxyx"
        .replace(/y/g, function () { return (~~(Math.random() * 9) + 1).toString(); })
        .replace(/x/g, function () { return (~~(Math.random() * 10)).toString(); });
    return id;
}
exports.id = id;
//# sourceMappingURL=generator.js.map