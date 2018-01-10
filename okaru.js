const Discord = require("discord.js");
var auth = require("./auths/auth.json");
var kitsu = require('node-kitsu');
//Prefix for the commands
const prefix = "~";

const bot = new Discord.Client();

bot.login(auth.token);

var servers = {};


bot.on("message", function(message){
    //if the message starts with the prefix indicating its a command for the bot.
    if(message.content.startsWith(prefix)){
        //If the command message is from the bot return and do nothing.
        if(message.author.equals(bot.user)) return;
        //splits the message and removes the prefix so you can check the argument.
        var arg = message.content.substring(prefix.length).split("~");

        //Transform the name to lower case so it wont cause confusion
        var animeNameToLower = arg[0].toLowerCase();
        //Encode for names with special characters such as "Pokémon"
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
        var animeNameEncoded = encodeURIComponent(animeNameToLower);

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
                  }
              });

    }

});