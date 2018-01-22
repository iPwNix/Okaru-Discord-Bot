const Discord = require("discord.js");
const kitsu = require('node-kitsu');
const request = require('request');

module.exports.run = function(bot, message, argument){
	kitsu.getUser(argument).then(results => {
	    searchResult = results[0];
	    console.log(searchResult);
        if(!searchResult){
          message.channel.send("No Profile Found!");
        }else{
          	var userID = searchResult.id;
          	var userName = searchResult.attributes.name;
          	var about = searchResult.attributes.about;
          	if(!about){
          	  	about = "No Description Found.";
          	}

          	if(searchResult.attributes.avatar === null){
          		var avatarMid = "https://kitsu.io/images/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png";
          	}else{
          		var avatarMid = searchResult.attributes.avatar.medium;
          	}

          	if(searchResult.attributes.coverImage === null){
          		var coverTiny = "https://kitsu.io/images/default_cover-7bda2081d0823731a96bbb20b70f4fcf.png";
          	}else{
          		var coverTiny = searchResult.attributes.coverImage.tiny;
          	}
          	
          	var userLocation = searchResult.attributes.location;
          	if(!userLocation){
          		userLocation = "Location not set.";
          	}

          	var waifuOrHusbando = searchResult.attributes.waifuOrHusbando;
          	if(!waifuOrHusbando){
          		waifuOrHusbando = "Waifu/Husbando";
          	}

          var timeSpendInMins = searchResult.attributes.lifeSpentOnAnime;

        //Calculate the time spend from the api response in minutes.
        //https://stackoverflow.com/a/38355774/3559635
            var minutesSpend = Math.floor(timeSpendInMins),
			    hoursSpend   = Math.floor(minutesSpend / 60),
			    daysSpend    = Math.floor(hoursSpend / 24),
			    monthsSpend  = Math.floor(daysSpend / 30),
			    yearsSpend   = Math.floor(daysSpend / 365);

			minutesSpend = minutesSpend%60;
			hoursSpend = hoursSpend%24;
			daysSpend = daysSpend%30;
			monthsSpend = monthsSpend%12;

			if(yearsSpend === 0){
				var timeSpendLine = monthsSpend+" Months, "+daysSpend+" Days, "+hoursSpend+" Hours, "+minutesSpend+" Minutes";
			}else{
				var timeSpendLine = yearsSpend+" Years, "+monthsSpend+" Months, "+daysSpend+" Days, "+hoursSpend+" Hours, "+minutesSpend+" Minutes";
			}
		//////

          	var amountOfFavs = searchResult.attributes.favoritesCount;
          	var followersCount = searchResult.attributes.followersCount;
          	var followingCount = searchResult.attributes.followingCount;
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
			               	.addField(waifuOrHusbando+":", "None </3")
			               	.addField("Time Spend on Anime:", timeSpendLine)
			               	.addField("Location:", userLocation, true)
			               	.addField("Favorite Anime Count:", amountOfFavs, true)
			               	.addField("Followers:", followersCount, true)
			               	.addField("Following:", followingCount, true);
			               	message.channel.send({embed});
			    }else{
				   	var characterID = userRelationship.data.id;
				    var characterAPIURL = "https://kitsu.io/api/edge/characters/"+characterID;
					request(characterAPIURL, function (error, response, body) {
					if (!error && response.statusCode == 200) {        
					    //console.log(JSON.parse(body));
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
			                .addField(waifuOrHusbando+" <3:", waifuName)
			                .addField("Time Spend on Anime:", timeSpendLine)
			                .addField("Location:", userLocation, true)
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