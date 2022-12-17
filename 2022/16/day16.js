"use strict";
exports.__esModule = true;
exports.solve16b = exports.solve16a = void 0;
var fs_1 = require("fs");
var Valves = /** @class */ (function () {
    function Valves(file) {
        this.valves = this.generateValves(file);
    }
    Valves.prototype.generateValves = function (file) {
        var valves = new Map();
        fs_1["default"].readFileSync(file, "utf-8")
            .split("\n")
            .forEach(function (item) {
            var _a = item.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/), _ = _a[0], name = _a[1], flowRate = _a[2], tunnels = _a[3];
            var splitTunnels = tunnels.split(", ");
            valves.set(name, {
                flowRate: parseInt(flowRate),
                leadsTo: splitTunnels
            });
        });
        console.log(valves);
        return valves;
    };
    return Valves;
}());
function solve16a(file) {
    var valves = new Valves(file);
    return 0;
}
exports.solve16a = solve16a;
function solve16b(file) {
    return 0;
}
exports.solve16b = solve16b;
console.log(solve16a("16/sample.txt"));
// console.log(solve16b(inputB));
