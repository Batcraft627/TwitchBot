"use strict";
exports.__esModule = true;
var tmi = require("tmi.js");
var config = require("./config.json");
var setup = config.botConfig;
var client = new tmi.client(setup);
client.connect();
client.on("chat", function (channel, tags, message, self) {
    if (self)
        return;
    console.log("twitch.handleChat", "[" + channel + "] " + tags["username"] + ": " + message);
    console.log("twitch.handleChat.tags", "[" + channel + "] Tags:", tags);
    if (message == "!helloThere") {
        client.say(channel, "General Kenobi!");
    }
});
