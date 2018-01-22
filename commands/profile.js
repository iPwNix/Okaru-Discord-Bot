const Discord = require("discord.js");
const kitsu = require('node-kitsu');
const request = require('request');

module.exports.run = function(bot, message, argument){
	kitsu.getUser(argument).then(results => {
	    searchResult = results[0];
	    console.log(searchResult);
        if(!searchResult){
          message.channel.send("Manga Not Found");
        }else{
          var userID = searchResult.id;
          var userName = searchResult.attributes.name;
          var about = searchResult.attributes.about;
          if(!about){
          	  about = "No Description Found.";
          }
          var avatarMid = searchResult.attributes.avatar.medium;
          var avatarLarge = searchResult.attributes.avatar.large;
          var coverTiny = searchResult.attributes.coverImage.tiny;

          var timeSpendInMins = searchResult.attributes.lifeSpentOnAnime;
          var amountOfFavs = searchResult.attributes.favoritesCount;
          var followersCount = searchResult.attributes.followersCount;
          var followingCount = searchResult.attributes.followingCount;

          console.log(searchResult.relationships.waifu);
          console.log(searchResult.relationships.waifu.links);
          console.log(searchResult.relationships.waifu.links.self);
          var userRelationshipURL = searchResult.relationships.waifu.links.self;

          	//send a request to the API for the relationship info.
			request(userRelationshipURL, function (error, response, body) {
			if (!error && response.statusCode == 200) {        
			    //console.log(JSON.parse(body));
			    var userRelationship = JSON.parse(body);
			    //If the data in the userRelationship is null meaning they have not set a Waifu/Husbando send the normal embed.
			    //Else search up the Waifu/Husbando information to add to the embed to send.
			    if(userRelationship.data === null){
				      const embed = new Discord.RichEmbed()
			               .setTitle(userName)
			               .setAuthor("Okaru", "https://i.imgur.com/Jf765y4.png")
			               .setColor(16610652)
			               .setDescription(about)
			               .setFooter("Info brought to you by Kitsu.io & The Okaru Bot ©2018 iPwNix", "https://i.imgur.com/8pMWE28.png")
			               .setImage(coverTiny)
			               .setThumbnail(avatarMid)
			               .setTimestamp()
			               .setURL("https://kitsu.io/users/"+userID)
			               .addField("Time Spend on Anime:", timeSpendInMins)
			               .addField("Favorite Anime Count:", amountOfFavs)
			               .addField("Followers:", followersCount,true)
			               .addField("Following:", followingCount, true);
			               message.channel.send({embed});
			    }else{
				   	var characterID = userRelationship.data.id;
				    var characterAPIURL = "https://kitsu.io/api/edge/characters/"+characterID;
					request(characterAPIURL, function (error, response, body) {
					if (!error && response.statusCode == 200) {        
					    console.log(JSON.parse(body));
					    var userWaifu = JSON.parse(body);
					    var waifuImage = userWaifu.data.attributes.image.original;
					    var waifuName = userWaifu.data.attributes.name;
					    const embed = new Discord.RichEmbed()
			                 .setTitle(userName)
			                 .setAuthor("Okaru", "https://i.imgur.com/Jf765y4.png")
			                 .setColor(16610652)
			                 .setDescription(about)
			                 .setFooter("Info brought to you by Kitsu.io & The Okaru Bot ©2018 iPwNix", "https://i.imgur.com/8pMWE28.png")
			                 .setImage(coverTiny)
			                 .setThumbnail(avatarMid)
			                 .setTimestamp()
			                 .setURL("https://kitsu.io/users/"+userID)
			                 .addField("Waifu/Husbando:", waifuName)
			                 .addField("Time Spend on Anime:", timeSpendInMins, true)
			                 .addField("Favorite Anime Count:", amountOfFavs, true)
			                 .addField("Followers:", followersCount, true)
			                 .addField("Following:", followingCount, true);
			                 message.channel.send({embed});
					}});
			    }
			}});
        }//END if !searchresults
	});
}

module.exports.info = {
	name: "profile"
}