//This imports all of the libraries i will use
import * as tmi from "tmi.js";
import config = require ("./config.json");
import WebSocket from "ws";


let setup: tmi.Options = config.botConfig;
//This creates a client that connects to twitch IRC
const client = new (tmi.client as any)(setup);
client.connect();
//When it recieves an update (someone posts a message) It will log all of the tags associated with the message
client.on ("chat", (channel:string, tags:Object, message:string, self:boolean) => {
    if (self) return;
    console.log ("twitch.handleChat",`[${channel}] ${tags["username"]}: ${message}`);
    console.log("twitch.handleChat.tags", `[${channel}] Tags:`, tags);
    
    if (message.startsWith ("!helloThere"))
    {
        client.say(channel, "General Kenobi!");
    }

    //This will connect to the pubsub API. This is to allow me to track any channel point redemptions
    const socket = new WebSocket("wss://pubsub-edge.twitch.tv");
    socket.onopen = () => {
        socket.send('{"type": "PING"}');
        setInterval(function () {
          socket.send('{"type": "PING"}');
        }, 240000);
        socket.send(JSON.stringify(config.listen));
      };
      
    socket.onmessage = function (event) {
    //console.log(event.data);
    var obj = JSON.parse(event.data.toString());
    //console.log(obj.data);
    if (obj.data !== undefined) {
        var msg = JSON.parse(obj.data.message.data);
        var id = msg.data.redemption.reward.id;
        var input = msg.data.redemption.user_input;
        var user = msg.data.redemption.user.display_name;
        input = input.trim();
        console.log(input);
        console.log(id);
        }
}
}
);