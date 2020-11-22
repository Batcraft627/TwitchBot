import * as tmi from "tmi.js";
import config = require ("./config.json");

let setup: tmi.Options = config.botConfig;
const client = new (tmi.client as any)(setup);
client.connect();
client.on ("chat", (channel:string, tags:Object, message:string, self:boolean) => {
    if (self) return;
    console.log ("twitch.handleChat",`[${channel}] ${tags["username"]}: ${message}`);
    console.log("twitch.handleChat.tags", `[${channel}] Tags:`, tags);
    
    if (message == "!helloThere")
    {
        client.say(channel, "General Kenobi!");
    }
}
);