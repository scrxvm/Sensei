const botSettings = require("./botsettings.json");   // here will be all const etc. <--
const Discord = require("discord.js");
const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: false});
// bot connect stuff
bot.on("ready", async () => {
    console.log(`Bot jest gotowy! ${bot.user.username}`);
    bot.user.setGame('s!pomoc | Warframe Wiki ', 'https://twitch.tv/warframewikipl')

    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch(e) {
        console.log(e.stack);
    }
});
//commands only!
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;
//help command
    if(command === `${prefix}pomoc`) {
        let embed = new Discord.RichEmbed()
        .setAuthor("Sensei", "https://i.imgur.com/AqQI8pO.png")
        .setFooter("Sensei (1.0.0)", "https://i.imgur.com/AqQI8pO.png")
        .setColor("#ffff00")
        .addField(":cop:Pomoc", "Dowiesz się tutaj jakie posiadam komendy!")
        .addField(":art:Moderacja", "wycisz odcisz")
        .addField(":computer:Serwerowe", "powiedz ankieta ogloszenie")

        message.channel.sendEmbed(embed);
        return;
    }
//mute
    if(command === `${prefix}wycisz`) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed: {
            title: ":cop:Wyciszenie",
            description: "Nie masz do tego permisji.",
            color: 0xffff00
        }})

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.send({embed: {
            title: ":cop:Wyciszenie",
            description: "Użycie: s!wycisz @(UserMention) albo ID",
            color: 0xffff00
        }})

        if(toMute.id  === message.author.id) return message.channel.send({embed: {
            title: ":cop:Wyciszenie",
            description: "Nie możesz wyciszyć siebie samego.",
            color: 0xffff00
        }})
        if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send({embed: {
            title: ":cop:Wyciszenie",
            description: "Nie możesz wyciszyć użytkownika który ma rolę wyższą lub taką samą jak ty.",
            color: 0xffff00
        }})

        let role = message.guild.roles.find(r => r.name === "Wyciszony");
        if(!role) {
        try{
           role = await message.guild.createRole({
               name: "Wyciszony",
               color: "#ffff00",
               permissions: []
           });

           message.guild.channels.forEach(async (channel, id) => {
               await channel.overwritePermissions(role, {
                   SEND_MESSAGES: false,
                   ADD_REACTIONS: false
                });
            });
        } catch(e) {
            console.log(e.stack);
        }
    }

    if(toMute.roles.has(role.id)) return message.channel.send({embed: {
        title: ":cop:Wyciszenie",
        description: "Ten użytkownik jest obecnie wyciszony.",
        color: 0xffff00
    }})

    await toMute.addRole(role);
    message.channel.send({embed: {
        title: ":cop:Wyciszenie",
        description: "Użytkownik został wyciszony.",
        color: 0xffff00
    }})

    return;
    }
//unmute
    if(command === `${prefix}odcisz`) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed: {
            title: ":cop:Odciszenie",
            description: "Nie masz do tego permisji.",
            color: 0xffff00
        }})

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.send({embed: {
            title: ":cop:Odciszenie",
            description: "Użycie: s!odcisz @(UserMention) albo ID",
            color: 0xffff00
        }})

        let role = message.guild.roles.find(r => r.name === "Wyciszony");

        if(!role || !toMute.roles.has(role.id)) return message.channel.send({embed: {
            title: ":cop:Odciszenie",
            description: "Ten użytkownik nie jest wyciszony!.",
            color: 0xffff00
        }})

    await toMute.removeRole(role);
    message.channel.send({embed: {
        title: ":cop:Odciszenie",
        description: "Użytkownik został odciszony.",
        color: 0xffff00
    }})

    return;
    }
//say
    if(command === `${prefix}powiedz`) {
        message.delete()
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return 
        let botmessage = args.join(" ");
        message.delete().catch();
        message.channel.send(botmessage)

    return;
    }
//ogloszenie
    if(command === `${prefix}ogloszenie`) {
        message.delete()
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return 
        let botmessage = args.join(" ");
        message.delete().catch();
        message.channel.send("@everyone @here")
        message.channel.send(botmessage)

    return;
    }
 //ankieta
    if(command === `${prefix}ankieta`) {
        message.delete()
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return 
        let botmessage = args.join(" ");
        message.delete().catch();
        message.channel.send("@everyone @here")
        message.channel.send(botmessage)
        .then(function (message) {
            message.react("🐼")
            message.react("🐹")
            message.react("🐮")
            message.react("🐯")
            message.react("🐸")
            message.react("🐙")
            message.react("🐢")
          }).catch(function() {
            //Something
           });

    return;
    }
});
bot.login(botSettings.token);