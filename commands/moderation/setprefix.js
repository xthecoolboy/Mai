const Discord = require("discord.js");
const settings = require("./../settings.json");
const timeout = settings.timeout;
const fs = require ("fs");
const setprefixstat = new Set();

module.exports.run = async (bot, message, args) => {
  const stat = "active";
  var icon = (!message.guild.iconURL) ? `http://www.clker.com/cliparts/I/8/E/F/G/d/glossy-gray-icon-angle-md.png` : message.guild.iconURL;
  if (setprefixstat.has(stat))
      {
        const statusActive = new Discord.RichEmbed().setTitle(`${message.author.username}, Slow down!`).setColor(settings.colors.red).setDescription(`A Set Prefix Dialogue is still active. You cannot open multiple instances of this command.`).setFooter(`${message.guild.name} | Mai Sakurajima | ${message.author.username}`, icon)
        return message.channel.send({embed: statusActive});
      } else {
        setprefixstat.add(stat);
  }
  const missArg = new Discord.RichEmbed()
  .setTitle(`No Prefix Provided`)
  .setDescription(`${message.author.username}, seems like you have forgotten to specify the prefix you wanted for the replacement.`)
  .setColor(settings.colors.red)
  .setFooter(`${message.guild.name} | Bot Settings Change Attempt Failed | ${message.author.username}`, icon);
  const noPerm = new Discord.RichEmbed()
  .setTitle("Insuffecient Permissions!")
  .setDescription(message.author + ", You don't have the permission to make changes to the bot!")
  .setColor(settings.colors.red)
  .setFooter(`${message.guild.name} | Regular Member | ${message.author.username}`, icon);
if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed: noPerm}).then(setprefixstat.delete(stat)).catch(console.error)
let prefix = message.content.split(/\s+/g).slice(1).join(" ");
if (!prefix) return message.channel.send({embed: missArg}).then(setprefixstat.delete(stat)).catch(console.error);
if (prefix.toString() === "\\") return message.channel.send("Invalid prefix").then(setprefixstat.delete(stat)).catch(console.error);
let mainpassword = "yes";
const menu = new Discord.RichEmbed()
.setTitle("Prefix Change")
.setColor(settings.colors.orange)
.setDescription(`**${message.author.username}**, do you really want to change this bot's prefix from "${settings.prefix}" to "${prefix}" ? Please type yes to confirm`)
.setFooter(`${message.guild.name} | Moderator | ${message.author.username}`, icon);
const password = response => response.content.toLowerCase() === mainpassword.toLowerCase() && response.author.id === message.author.id;
message.channel.send(menu).then(() => {
message.channel.awaitMessages(password, { maxMatches: 1, time: timeout, errors: ['time'] })
  .then(collected => {
    message.channel.send(`**${collected.first().author.username}** successfully changed this bot's prefix to **${prefix}** !`);
    settings.prefix = prefix.toString();
    setprefixstat.delete(stat)
    fs.writeFile("./botconfig.json", JSON.stringify(settings, null, 2), (err) =>{
    if (err) console.log(err)
    });

  })
  .catch(collected => {
    let failed = new Discord.RichEmbed()
    .setTitle(`${message.author.username}'s attempt on changing this bot's prefix failed.`)
    .setDescription(`${message.author.username} ran out of time.`)
    .setFooter(`${message.guild.name} | Moderator | ${message.author.username}`, icon);
    message.channel.send({embed: failed});
    setprefixstat.delete(stat)
  });
});

}

module.exports.help = {
  name: "setprefix"
}
