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
exports.__esModule = true;
exports.solve16b = exports.solve16a = void 0;
var fs_1 = require("fs");
function generateValves(file) {
    var valves = new Map();
    fs_1["default"].readFileSync(file, "utf-8")
        .split("\n")
        .forEach(function (item) {
        var _a = item.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/), _ = _a[0], name = _a[1], flowRate = _a[2], tunnels = _a[3];
        var splitTunnels = tunnels.split(", ");
        valves.set(name, {
            flowRatePerMinute: parseInt(flowRate),
            leadsTo: splitTunnels
        });
    });
    // iterate over valves, and add distances to each valve
    var valvesWithDistances = new Map();
    valves.forEach(function (valve, name) {
        var distances = new Map();
        var queue = valve.leadsTo.map(function (valveName) { return ({
            name: valveName,
            distance: 2
        }); });
        var _loop_1 = function () {
            var _a = queue.shift(), name_1 = _a.name, distance = _a.distance;
            if (distances.has(name_1))
                return "continue";
            distances.set(name_1, distance);
            var nextValve = valves.get(name_1);
            if (nextValve) {
                queue.push.apply(queue, nextValve.leadsTo.map(function (valveName) { return ({
                    name: valveName,
                    distance: distance + 1
                }); }));
            }
        };
        while (queue.length > 0) {
            _loop_1();
        }
        valvesWithDistances.set(name, __assign(__assign({}, valve), { distances: distances }));
    });
    console.log(valvesWithDistances);
    return valvesWithDistances;
}
function enterWalk(_a) {
    var valves = _a.valves;
    var outcomes = [];
    walk({
        valves: valves,
        curr: "AA",
        path: [],
        flow: 0,
        turns: 30,
        score: 0,
        outcomes: outcomes
    });
    var bestPath = outcomes.sort(function (a, b) { return b.score - a.score; })[0];
    // console.log("bestPath", bestPath);
    return bestPath.score;
}
function walk(_a) {
    var _b, _c;
    var valves = _a.valves, curr = _a.curr, path = _a.path, flow = _a.flow, turns = _a.turns, score = _a.score, outcomes = _a.outcomes;
    var newPath = __spreadArray(__spreadArray([], path, true), [curr], false);
    flow += ((_b = valves.get(curr)) === null || _b === void 0 ? void 0 : _b.flowRatePerMinute) || 0;
    // walk possible paths
    var nextValves = ((_c = valves.get(curr)) === null || _c === void 0 ? void 0 : _c.distances) || [];
    nextValves.forEach(function (distance, name) {
        var _a;
        if (typeof name === "string" &&
            !newPath.includes(name) &&
            turns >= distance &&
            ((_a = valves.get(name)) === null || _a === void 0 ? void 0 : _a.flowRatePerMinute)) {
            walk({
                valves: valves,
                curr: name,
                path: newPath,
                flow: flow,
                turns: turns - distance,
                score: score + flow * distance,
                outcomes: outcomes
            });
        }
    });
    // wait until end of turns
    outcomes.push({
        path: newPath,
        score: score + flow * turns
    });
}
function enterWalkWithElephant(_a) {
    var valves = _a.valves;
    var outcomes = [];
    var targetValves = __spreadArray([], valves, true).filter(function (valve) { return valve[1].flowRatePerMinute > 0; })
        .map(function (valve) { return valve[0]; });
    console.log("start targetValves:", targetValves);
    walkWithElephant({
        valves: valves,
        playerState: { valve: "AA", path: [], queue: [] },
        elephantState: { valve: "AA", path: [], queue: [] },
        openValves: [],
        targetValves: targetValves,
        turns: 27,
        score: 0,
        outcomes: outcomes,
        log: []
    });
    var bestPath = outcomes.sort(function (a, b) { return b.score - a.score; })[0];
    console.log("bestPath", bestPath);
    console.log(outcomes.map(function (outcome) { return outcome.score; }).sort(function (a, b) { return b - a; }));
    var betterPath = outcomes.filter(function (outcome) {
        return JSON.stringify(outcome.playerPath) === "[\"JJ\",\"BB\",\"CC\"]" &&
            JSON.stringify(outcome.elephantPath) === "[\"DD\",\"HH\",\"EE\"]";
    });
    console.log("better path:", betterPath);
    return bestPath.score;
}
function walkWithElephant(_a) {
    var _b, _c, _d, _e, _f, _g;
    var valves = _a.valves, playerState = _a.playerState, elephantState = _a.elephantState, openValves = _a.openValves, targetValves = _a.targetValves, turns = _a.turns, score = _a.score, outcomes = _a.outcomes, log = _a.log;
    turns -= 1;
    var flow = openValves
        .map(function (valve) { return valves.get(valve).flowRatePerMinute; })
        .reduce(function (acc, cur) { return acc + cur; }, 0);
    var newScore = score + flow;
    var newLog = "== turn ".concat(26 - turns, ", score ").concat(score, " => ").concat(newScore, "\n");
    newLog += "".concat(openValves.join(", "), " are open, releasing ").concat(flow, " pressure\n");
    newLog += "player queue: ".concat(playerState.queue.join(", "), ", elephant queue: ").concat(elephantState.queue.join(", "), "\n");
    var playerMove = playerState.queue.shift() || "wait";
    if (playerMove !== "wait") {
        openValves.push(playerMove);
        newLog += "player opens ".concat(playerMove, "\n");
    }
    else {
        newLog += "player is walking somewhere or waiting\n";
    }
    var elephantMove = elephantState.queue.shift() || "wait";
    if (elephantMove !== "wait") {
        openValves.push(elephantMove);
        newLog += "elephant opens ".concat(elephantMove, "\n");
    }
    else {
        newLog += "elephant is walking somewhere or waiting\n";
    }
    if (turns === 0) {
        console.log("found an end state", outcomes.length + 1, newScore);
        outcomes.push({
            playerPath: playerState.path,
            elephantPath: elephantState.path,
            score: newScore,
            log: __spreadArray(__spreadArray([], log, true), [newLog], false)
        });
    }
    else {
        // if both have 1+ turn left, just keep going
        // if there are no more valid paths, also just keep going
        if ((playerState.queue.length > 0 && elephantState.queue.length > 0) ||
            targetValves.length === 0) {
            newLog += "---keep walking - targetValves: ".concat(targetValves.join(", "));
            walkWithElephant({
                valves: valves,
                playerState: JSON.parse(JSON.stringify(playerState)),
                elephantState: JSON.parse(JSON.stringify(elephantState)),
                openValves: __spreadArray([], openValves, true),
                targetValves: targetValves,
                turns: turns,
                score: newScore,
                outcomes: outcomes,
                log: __spreadArray(__spreadArray([], log, true), [newLog], false)
            });
        }
        // if both have 0 turns left, try to give both a new path
        else if (playerState.queue.length === 0 &&
            elephantState.queue.length === 0) {
            newLog += "player queue: ".concat(playerState.queue.join(", "), ", elephant queue: ").concat(elephantState.queue.join(", "));
            newLog += "-- both are getting new paths - targetValves: ".concat(targetValves.join(", "));
            // if only one valve left, recurse twice - once for each player to open it
            if (targetValves.length === 1) {
                // player gets it
                walkWithElephant({
                    valves: valves,
                    playerState: JSON.parse(JSON.stringify({
                        valve: targetValves[0],
                        path: __spreadArray(__spreadArray([], playerState.path, true), [targetValves[0]], false),
                        queue: __spreadArray(__spreadArray([], new Array(((_b = valves
                            .get(playerState.valve)) === null || _b === void 0 ? void 0 : _b.distances.get(targetValves[0])) - 1).fill("wait"), true), [
                            targetValves[0],
                        ], false)
                    })),
                    elephantState: JSON.parse(JSON.stringify(__assign(__assign({}, elephantState), { queue: ["wait"] }))),
                    openValves: __spreadArray([], openValves, true),
                    targetValves: [],
                    turns: turns,
                    score: newScore,
                    outcomes: outcomes,
                    log: __spreadArray(__spreadArray([], log, true), [newLog], false)
                });
                // elephant gets it
                walkWithElephant({
                    valves: valves,
                    playerState: JSON.parse(JSON.stringify(__assign(__assign({}, playerState), { queue: ["wait"] }))),
                    elephantState: JSON.parse(JSON.stringify({
                        valve: targetValves[0],
                        path: __spreadArray(__spreadArray([], elephantState.path, true), [targetValves[0]], false),
                        queue: __spreadArray(__spreadArray([], new Array(((_c = valves
                            .get(elephantState.valve)) === null || _c === void 0 ? void 0 : _c.distances.get(targetValves[0])) - 1).fill("wait"), true), [
                            targetValves[0],
                        ], false)
                    })),
                    openValves: __spreadArray([], openValves, true),
                    targetValves: [],
                    turns: turns,
                    score: newScore,
                    outcomes: outcomes,
                    log: __spreadArray(__spreadArray([], log, true), [newLog], false)
                });
            }
            if (targetValves.length > 1) {
                var _loop_2 = function (i) {
                    var _loop_5 = function (j) {
                        if (i === j)
                            return "continue";
                        // send player to i, elephant to j
                        walkWithElephant({
                            valves: valves,
                            playerState: JSON.parse(JSON.stringify({
                                valve: targetValves[i],
                                path: __spreadArray(__spreadArray([], playerState.path, true), [targetValves[i]], false),
                                queue: __spreadArray(__spreadArray([], new Array(((_d = valves
                                    .get(playerState.valve)) === null || _d === void 0 ? void 0 : _d.distances.get(targetValves[i])) - 1).fill("wait"), true), [
                                    targetValves[i],
                                ], false)
                            })),
                            elephantState: JSON.parse(JSON.stringify({
                                valve: targetValves[j],
                                path: __spreadArray(__spreadArray([], elephantState.path, true), [targetValves[j]], false),
                                queue: __spreadArray(__spreadArray([], new Array(((_e = valves
                                    .get(elephantState.valve)) === null || _e === void 0 ? void 0 : _e.distances.get(targetValves[j])) - 1).fill("wait"), true), [
                                    targetValves[j],
                                ], false)
                            })),
                            openValves: __spreadArray([], openValves, true),
                            targetValves: targetValves.filter(function (valve) {
                                return valve !== targetValves[i] && valve !== targetValves[j];
                            }),
                            turns: turns,
                            score: newScore,
                            outcomes: outcomes,
                            log: __spreadArray(__spreadArray([], log, true), [newLog], false)
                        });
                    };
                    for (var j = 0; j < targetValves.length; j++) {
                        _loop_5(j);
                    }
                };
                // iterate over all possible combinations of remaining valves
                // recurse all of them except sending both players to the same valve
                for (var i = 0; i < targetValves.length; i++) {
                    _loop_2(i);
                }
            }
        }
        // if player has 0 turns left and elephant has 1+ turn left, give player a new path
        else if (playerState.queue.length === 0 && elephantState.queue.length > 0) {
            var _loop_3 = function (i) {
                walkWithElephant({
                    valves: valves,
                    playerState: JSON.parse(JSON.stringify({
                        valve: targetValves[i],
                        path: __spreadArray(__spreadArray([], playerState.path, true), [targetValves[i]], false),
                        queue: __spreadArray(__spreadArray([], new Array(((_f = valves
                            .get(playerState.valve)) === null || _f === void 0 ? void 0 : _f.distances.get(targetValves[i])) - 1).fill("wait"), true), [
                            targetValves[i],
                        ], false)
                    })),
                    elephantState: JSON.parse(JSON.stringify(elephantState)),
                    openValves: __spreadArray([], openValves, true),
                    targetValves: targetValves.filter(function (valve) { return valve !== targetValves[i]; }),
                    turns: turns,
                    score: newScore,
                    outcomes: outcomes,
                    log: __spreadArray(__spreadArray([], log, true), [newLog], false)
                });
            };
            for (var i = 0; i < targetValves.length; i++) {
                _loop_3(i);
            }
        }
        // if elephant has 0 turns left and player has 1+ turn left, give elephant a new path
        else if (elephantState.queue.length === 0 && playerState.queue.length > 0) {
            newLog += "++++++ IS THIS WHERE WE FUCK UP??? +++++++";
            newLog += "".concat(JSON.stringify(playerState));
            var _loop_4 = function (i) {
                walkWithElephant({
                    valves: valves,
                    playerState: JSON.parse(JSON.stringify(playerState)),
                    elephantState: JSON.parse(JSON.stringify({
                        valve: targetValves[i],
                        path: __spreadArray(__spreadArray([], elephantState.path, true), [targetValves[i]], false),
                        queue: __spreadArray(__spreadArray([], new Array(((_g = valves
                            .get(elephantState.valve)) === null || _g === void 0 ? void 0 : _g.distances.get(targetValves[i])) - 1).fill("wait"), true), [
                            targetValves[i],
                        ], false)
                    })),
                    openValves: __spreadArray([], openValves, true),
                    targetValves: targetValves.filter(function (valve) { return valve !== targetValves[i]; }),
                    turns: turns,
                    score: newScore,
                    outcomes: outcomes,
                    log: __spreadArray(__spreadArray([], log, true), [newLog], false)
                });
            };
            for (var i = 0; i < targetValves.length; i++) {
                _loop_4(i);
            }
        }
    }
}
function solve16a(file) {
    var valves = generateValves(file);
    var bestPath = enterWalk({
        valves: valves
    });
    return bestPath;
}
exports.solve16a = solve16a;
function solve16b(file) {
    var valves = generateValves(file);
    var bestPath = enterWalkWithElephant({
        valves: valves
    });
    return bestPath;
}
exports.solve16b = solve16b;
// console.time();
// console.log(solve16a("16/input.txt"));
// console.timeEnd(); // 380ms
console.log(solve16b("16/input.txt"));
// part 2 guesses
// 1624
