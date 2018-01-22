# "Okaru" A Discord Bot for Kitsu #
Okaru is used to get Anime/Manga and User profile information from [Kitsu.io](http://kitsu.io) and display this info on your Discord Server.
Made with the [node-kitsu](https://github.com/the-conceptionist/node-kitsu) Node Package made by [The Conceptionist](https://github.com/the-conceptionist).

## Version: 0.0.5
The Bot is now able to search up Anime, Manga and Profile Information and display it in a embedded Discord Message, a user can only make a request once every 30 seconds.

The only error i've encountered so far is with the cleaning of the JSON on launching the bot, this error only occurs sometimes and im trying to figure out whats causing it.

## Usage
The bot's prefix is set to ~, followed by the command and the argument ~"Command" "Argument"

For anime and Manga you can both search on the English and Rōmaji titles.
```
~anime "Anime Name"
~manga "Mange Name"
~profile "Username"
```
As seen here, searching with an English Title:

![alt text](https://i.imgur.com/WAZ237h.png)

Searching up a Manga:

![alt text](https://i.imgur.com/dmEGcSJ.png)

Searching up a Profile with the Username:

![alt text](https://i.imgur.com/hKuDpX2.png)

If you try to make another request to the bot within 30 seconds of your previous request you will get this response:

![alt text](https://i.imgur.com/1I471sJ.png)

If you search for something and the bot gets an empty response from Kitsu you will recieve this message:

![alt text](https://i.imgur.com/IWpoJNu.png)

Using an incorrect command with the prefix will result in this message being sent:

![alt text](https://i.imgur.com/sTZnv5A.png)


## Authors

* **Erik Vlasblom** -- [iPwNix](https://github.com/iPwNix)
