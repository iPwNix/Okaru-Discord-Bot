const Discord = require("discord.js");
const kitsu = require('node-kitsu');

module.exports.run = function(bot, message, argument){
kitsu.searchManga(argument, 0).then(results => {
        searchResult = results[0];
        if(!searchResult){
          message.channel.send("Manga Not Found");
        }else{
          var mangaID = searchResult.id;
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
          var chapterCount = searchResult.attributes.chapterCount;
          if(!chapterCount){
              chapterCount = "Unknown";
          }
          var volumeCount = searchResult.attributes.volumeCount;
          if(!volumeCount){
          	  volumeCount = "Unknown";
          }
          var serialization = searchResult.attributes.serialization;
          if(!serialization){
          	  serialization = "Unknown";
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
               .setDescription("Status: "+statusUpper)
               .setFooter("Info brought to you by Kitsu.io & The Okaru Bot ©2018 iPwNix", "https://i.imgur.com/8pMWE28.png")
               .setImage(smallPoster)
               .setThumbnail("https://i.imgur.com/Jf765y4.png")
               .setTimestamp()
               .setURL("https://kitsu.io/anime/"+mangaID)
               .addField("Synopsis:", synopsis)
               .addField("Magazine:", serialization)
               .addField("Chapters:", chapterCount, true)
               .addField("Volumes:", volumeCount,true)
               .addField("English:", titleEn, true)
               .addField("Romanized:", titleJP, true)
               .addField("Start:", startDate, true)
               .addField("End:", endDate, true);
               message.channel.send({embed});
        }//END if !searchresults
    });//END searchManga
}

module.exports.info = {
	name: "manga"
}