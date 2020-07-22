import {
    Client,
    MESSAGE_CREATE,
    READY,
    RATES,
    HEARTBEAT,
    RESUMED,
    INVALID_SESSION,
    ev,
  } from "https://raw.githubusercontent.com/tsdiscord/discordts/master/mod.ts";
  
  const bot = new Client({
    token: "YOUR TOKEN HERE",
  });
  
  console.log(`Running Discord.TS v${bot.version}`);
  
  for await (const ctx of bot) {
    switch (ctx.event) {
      case ev.Ready: {
        const ready: READY = ctx;
  
        console.log("Discord.TS is now ready!");
        console.log("Discord websocket API version is " + ready.gatewayVersion);
  
        // Sets client presence
        bot.user.setPresence({
          status: "online",
          game: {
            name: "Taking over the world!",
            type: "playing",
          },
        });
        break;
      }
      case ev.Resumed: {
        const resumed: RESUMED = ctx;
        if (resumed.reconnectRequested) {
          console.log("Discord API requested a reconnect.");
          break;
        }
        console.log(`Resumed at: ${resumed.resumeTime}`);
        break;
      }
      case ev.InvalidSession: {
        const session: INVALID_SESSION = ctx;
        console.log(
          `An invalid session occured. Can resume from previous state?: ${session.canResume}`,
        );
        break;
      }
      case ev.Ratelimit: {
        const ratelimit: RATES = ctx;
        console.log(`A rate limit was hit for the route: ${ratelimit.route}`);
        // deno-fmt-ignore
        console.log(`The ratelimit will reset in ${Math.round(ratelimit.resetIn / 1000 * 10) / 10}s`);
        break;
      }
  
      case ev.Heartbeat: {
        const heartbeat: HEARTBEAT = ctx;
        // deno-fmt-ignore
        console.log(
          "Heartbeat recieved: \n" +
          `=>total: ${heartbeat.total}\n=>rate: ${Math.round(heartbeat.rate / 1000 * 10) / 10}s`
          );
        break;
      }
      case ev.Message: {
        const msg: MESSAGE_CREATE = ctx;
        if (msg.author.id !== bot.user.id) {
          if (msg.content === "!ping") {
            await msg.reply(`Pong!`);
            await msg.reply(`Message author: ${msg.author.username}`);
            await msg.reply(`User created at: ${msg.author.createdOn}`);
            await msg.reply(`Created at: ${msg.createdAt}`);
            await msg.reply(`Client name: ${bot.user.name}`);
            continue;
          }
          if (msg.content === "!Discord.TS") {
            await msg.reply(`Discord.TS version: v${bot.version}`);
          }
        }
        break;
      }
    }
  }