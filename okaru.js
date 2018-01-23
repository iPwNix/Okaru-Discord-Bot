const Discord = require("discord.js");
const auth = require("./auths/auth.json");
const kitsu = require('node-kitsu');
const fs = require('fs');
const path = require('path');
//Prefix for the commands
const prefix = "~";

const bot = new Discord.Client();
bot.login(auth.token);
bot.lockedUsers = require("./lists/lockedUsers.json");

bot.commands = new Discord.Collection();


//https://gist.github.com/oliverswitzer/9194629
function extension(element) {
    var extName = path.extname(element);
    return extName === '.js'; 
};

fs.readdir("./commands/", function(err, files){
  if(err){ console.error (err) }

  files.filter(extension).forEach(function(fileName){
    console.log(fileName+" Loaded");
    var cmdProps = require("./commands/"+fileName)
    bot.commands.set(cmdProps.info.name, cmdProps);
  });
});


bot.on("ready", function(){
  console.log("Okaru is ready");
  bot.user.setStatus("Online");
  bot.user.setGame("Kitsu.io");
  //Reset the locked users JSON before startup.
  bot.lockedUsers = {};
  fs.writeFile("./lists/lockedUsers.json", JSON.stringify(bot.lockedUsers));
  console.log(bot.commands);
});


bot.on("message", function(message){
    //if the message starts with the prefix indicating its a command for the bot.
    if(message.content.startsWith(prefix)){
        //If the command message is from the bot return and do nothing.
        if(message.author.equals(bot.user)) return;
        //splits the message and removes the prefix so you can check the argument.
        var msgArg = message.content.substring(prefix.length).split("~");

        //Reads the json file of locked users
        var lockedObj = JSON.parse(fs.readFileSync('./lists/lockedUsers.json', 'utf8'));
        //If the senders ID exsists and the date now is greater/equal to the lock time, delete it from the json
        if(lockedObj[message.author.id] && Date.now() >= lockedObj[message.author.id].time){
            delete bot.lockedUsers[message.author.id];
            fs.writeFile("./lists/lockedUsers.json", JSON.stringify(bot.lockedUsers));
          }

          //Read lockedObject again, for if we deleted a user from the list who's time has expired
          var lockedUserObj = JSON.parse(fs.readFileSync('./lists/lockedUsers.json', 'utf8'));
          if(!lockedUserObj[message.author.id] || Date.now() >= lockedObj[message.author.id].time){

          //Add the user to the lockedUsers object in the json file.
          bot.lockedUsers[message.author.id] = {
            id: message.author.id,
            username: message.author.username,
            guild: message.guild.id,
            time: Date.now() + 30000
          };
          fs.writeFile("./lists/lockedUsers.json", JSON.stringify(bot.lockedUsers, null, 4));

          //https://stackoverflow.com/a/10272802/3559635
          var commandMsg = msgArg[0].toLowerCase();
          var commandArg = commandMsg.substr(0,commandMsg.indexOf(' '));
          var searchItem = commandMsg.substr(commandMsg.indexOf(' ')+1);
          
          switch(commandArg){
            case "anime":
              var animeCommand = bot.commands.get(commandArg);
              animeCommand.run(bot, message, searchItem);
              break;
            case "manga":
              var mangaCommand = bot.commands.get(commandArg);
              mangaCommand.run(bot, message, searchItem);
              break;
            case "profile":
              var profileCommand = bot.commands.get(commandArg);
              profileCommand.run(bot, message, searchItem);
              break;
            default:
              message.channel.send("Command not Found!");
          }

          }else{
            //https://stackoverflow.com/a/32846190/3559635
            var timeRemain = Math.floor(lockedObj[message.author.id].time / 1000) - Math.floor(Date.now() / 1000);
            switch(timeRemain) {
              case 1:
                  message.channel.send(message.author.toString()+" you are still on cooldown for "+timeRemain+" second!");
                  break;
              case 0:
                  message.channel.send(message.author.toString()+" your cooldown is almost up!");
                  break;
              default:
                  message.channel.send(message.author.toString()+" you are still on cooldown for "+timeRemain+" seconds!");
            }//END Switch timeRemain
          }//END if else lockedObj
        }//END if startsWith(prefix)

});//END bot.on("message")