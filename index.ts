import WebSocket from "ws";
import * as tmi from "tmi.js";
import { ChildProcess, spawn } from 'child_process';
import options = require("./config.json");

interface tagsObject {
  "badge-info": Object;
  badges: Object;
  "client-nonce": String;
  color: String;
  "display-name": String;
  emotes?: Object;
  id: String;
  mod: Boolean;
  "room-id": String;
  subscriber: Boolean;
  "tmi-sent-ts": String;
  turbo: Boolean;
  "user-id": String;
  "user-type"?: String;
  "emotes-raw"?: String;
  "badge-info-raw": String;
  "badges-raw": String;
  username: String;
  "message-type": String;
}



const botConfig = options.botConfig;
let setup: tmi.Options = botConfig;
const client = new (tmi.client as any)(setup);
client.connect();
client.on(
  "chat",
  (channel: string, tags: tagsObject, message: string, self: boolean) => {
    if (self) return;


   console.log(
      "twitch.handleChat",
      `[${channel}] ${tags["username"]}: ${message}`
    );

   console.log("twitch.handleChat.tags", `[${channel}] Tags:`, tags);

    if (message.startsWith ("!helloThere"))
    {
        client.say(channel, "General Kenobi!");
    }

    const socket = new WebSocket("wss://pubsub-edge.twitch.tv");
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
        const python = spawn("python",['python-scripts/'+ input + ".py"]);
        
        python.stdout.on('data', function (data) {
          console.log('Pipe data from python script ...');
          var dataToLog = data.toString();
          console.log(dataToLog);
         });
      }
      if (id == "477c5472-1e76-424c-8584-2110dfd4dec4"){
        client.timeout(channel, input, 300, "You have " + user + "to thank for this");
      }
    };
  }
);
