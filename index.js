"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const tmi = __importStar(require("tmi.js"));
const child_process_1 = require("child_process");
const options = require("./config.json");
const botConfig = options.botConfig;
let setup = botConfig;
const client = new tmi.client(setup);
client.connect();
client.on("chat", (channel, tags, message, self) => {
    if (self)
        return;
    console.log("twitch.handleChat", `[${channel}] ${tags["username"]}: ${message}`);
    console.log("twitch.handleChat.tags", `[${channel}] Tags:`, tags);
    if (message.startsWith("!helloThere")) {
        client.say(channel, "General Kenobi!");
    }
    const socket = new ws_1.default("wss://pubsub-edge.twitch.tv");
    socket.onopen = () => {
        //console.log(socket.readyState);
        socket.send('{"type": "PING"}');
        setInterval(function () {
            socket.send('{"type": "PING"}');
        }, 240000);
        socket.send(JSON.stringify(options.listen));
    };
    socket.onmessage = function (event) {
        console.log(event.data);
        var obj = JSON.parse(event.data.toString());
        //console.log(obj.data);
        if (obj.data !== undefined) {
            var msg = JSON.parse(obj.data.message);
            var id = msg.data.redemption.reward.id;
            var input = msg.data.redemption.user_input;
            var user = msg.data.redemption.user.display_name;
            input = input.trim();
            console.log(input);
            console.log(id);
        }
        if (id == "13ceaf45-488c-47b8-ac09-cdaf78d7dc74") {
            const python = child_process_1.spawn("python", ['python-scripts/' + input + ".py"]);
            python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                var dataToLog = data.toString();
                console.log(dataToLog);
            });
        }
    };
});
