const Discord = require("discord.js");
const auth = require("./auths/auth.json");
const kitsu = require('node-kitsu');
const fs = require('fs');
//Prefix for the commands
const prefix = "~";

const bot = new Discord.Client();

bot.login(auth.token);

bot.lockedUsers = require("./lists/lockedUsers.json");

bot.on("ready", function(){
  console.log("Okaru is ready");
  //Resets the locked users JSON on startup.
  bot.lockedUsers = {};
  fs.writeFile("./lists/lockedUsers.json", JSON.stringify(bot.lockedUsers));
});


bot.on("message", function(message){
    //if the message starts with the prefix indicating its a command for the bot.
    if(message.content.startsWith(prefix)){
        //If the command message is from the bot return and do nothing.
        if(message.author.equals(bot.user)) return;
        //splits the message and removes the prefix so you can check the argument.
        var arg = message.content.substring(prefix.length).split("~");

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
          

          //Transform the name to lower case so it wont cause confusion
          var animeNameToLower = arg[0].toLowerCase();
          //Encode for names with special characters such as "Pokémon"
          //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
          var animeNameEncoded = encodeURIComponent(animeNameToLower);

          //Not every anime has an English/Rōmaji title, synopsis, episode count or start/end dates, therefor alot of if checks for now.
          kitsu.searchAnime(animeNameEncoded, 0).then(results => {
                  searchResult = results[0];
                  if(!searchResult){
                    message.channel.send("Anime Not Found");
                  }else{
                    var animeID = searchResult.id;
                    var titleEn = searchResult.attributes.titles.en;
                    if(!titleEn){
                        titleEn = "English title Not Found."
                    }
                    var titleJP = searchResult.attributes.titles.en_jp;
                    if(!titleJP){
                        titleJP = "Rōmaji title Not Found."
                    }
                    var title = searchResult.attributes.canonicalTitle;
                    if(!title){
                      if(!titleEn){
                          title = titleEn;
                      }else if(!titleJP){
                          title = titleJP;
                      }else{
                          title = "Canon Title Not Found.";
                      }
                    }
                    var synopsis = searchResult.attributes.synopsis;
                    if(!synopsis){
                        synopsis = "No Synopsis Found";
                    }
                    var episodeCount = searchResult.attributes.episodeCount;
                    if(!episodeCount){
                        episodeCount = "Unknown";
                    }
                    var status = searchResult.attributes.status;
                    var startDate = searchResult.attributes.startDate;
                    if(!startDate){
                        startDate = "Unknown";
                    }
                    var endDate = searchResult.attributes.endDate;
                    if(!endDate){
                        endDate = "Unknown";
                    }                    
                    var smallPoster = searchResult.attributes.posterImage.small;

                    //If the synopsis is longer then 700 characters cut it off and add "..."
                    //So the post doesn't become to long.
                    if(synopsis.length > 700){
                        var synopsis = synopsis.substring(0, 700) + '...';
                    }
                    //The Status returns lowercase "finished", This transforms it into "Finished"
                    var statusUpper = status.charAt(0).toUpperCase() + status.substr(1).toLowerCase();

                    const embed = new Discord.RichEmbed()
                      .setTitle(title)
                      .setAuthor("Okaru", "https://i.imgur.com/Jf765y4.png")

                      .setColor(16610652)
                      .setDescription("Status: "+statusUpper+", Episode Count: "+episodeCount)
                      .setFooter("Info brought to you by Kitsu.io & The Okaru Bot ©2018 iPwNix", "https://i.imgur.com/8pMWE28.png")
                      .setImage(smallPoster)
                      .setThumbnail("https://i.imgur.com/Jf765y4.png")

                      .setTimestamp()
                      .setURL("https://kitsu.io/anime/"+animeID)
                      .addField("Synopsis:", synopsis)
                      .addField("English:", titleEn, true)
                      .addField("Romanized:", titleJP, true)

                      .addField("Start:", startDate, true)

                      .addField("End:", endDate, true);

                      message.channel.send({embed});
                  }//END if !searchresults
              });//END searchAnime
          }else{
            //https://stackoverflow.com/a/32846190/3559635
            var timeRemain = Math.floor(lockedObj[message.author.id].time / 1000) - Math.floor(Date.now() / 1000);
            switch(timeRemain) {
              case 1:
                  message.channel.send(message.author.username+" you are still on cooldown for "+timeRemain+" second!");
                  break;
              case 0:
                  message.channel.send(message.author.username+" you're cooldown is up!");
                  break;
              default:
                  message.channel.send(message.author.username+" you are still on cooldown for "+timeRemain+" seconds!");
            }//END Switch timeRemain
          }//END if else lockedObj
        }//END if startsWith(prefix)

});//END bot.on("message")