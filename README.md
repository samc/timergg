# TIMER.GG

[Live Demo](https://timergg.herokuapp.com/tutorial)

TIMER.GG is an all inclusive timing website for all things League of Legends. The application itself is completely voice activated and features both visual and verbal feedback for all timers. This hands-free approach not only saves time, but also aims to minimize distractions and helps keep your focus on the important stuff. You can time almost anything:

* Summoner Spells
* Baron
* Dragon
* Scuttle Crab
* Inhibitors

## What TIMER.GG aims to solve

In League of Legends, maintaining accurate timers for important points of contention throughout the game is a very important process necessary in higher level play. As someone who played predominantly support and jungle, playing around various timings - whether that be the midlaner's flash or the enemy raptor camp - drastically improved the way I thought about the game. However, the process of typing and constantly scrolling through chat to look for the relevant timers is rather tedious and time consuming in a mentally taxing game like LoL. TIMER.GG aims to streamline the timing process using voice recognition and an intuitive GUI - letting you focus and structure macro decisions around the current state of the game.

## Getting Started

After a quick tutorial, you'll be introduced to the Player Dashboard, a dynamic interface that responds to your voice commands. As you time, the dashboard will record and display your information instantaneously - no fussing with typing out things ingame or fumbling over manual controls. Though the dashboard is entirely voice activated, you can always use the interactive GUI to control everything on the dashboard. Along with visual displays, the dashboard is also equipped with Voice Assist, providing you with verbal reminders when your cooldowns are almost up.

## Voice Commands

### Champions

```
"Time [champion] [summoner spell]"
```

```
"[lucidity] [champion]"
```

### Jungle Monsters

```
"Time [dragon, baron, or rift herald]"
```

```
"Time [top or bot] scuttle"
```

```
"Time [enemy or ally] [blue, red, gromp, wolves, raptors, or krugs]"
```

### Inhibitors

```
"Time [lane] [enemy or ally] inhibitor"
```

### Lanes

Any voice command that requires a lane can be called using the following:

- "Top"
- "Mid" or "Middle"
- "Bot" or "Bottom"

### Extras

You can toggle any of the extras with:

```
"Toggle [allies, ticker, display, or cannon]"
```

You can also set the the intervals for the ticker and the reminder with:

```
"Ticker set [1 - 10] seconds"
```

```
"Reminder set [time in seconds] seconds"
```

## Extras

TIMER.GG also features a few extras that you can equip that aim to improve the core fundamentals of wave control and map awareness, along with some nifty modifications to the dashboard:

* Map Awareness Ticker: Every beat reminds you to take a quick look at your minimap
* Cannon Wave Notifier: Alerts you when a cannon wave leaves the base
* Map Display: Interactive map of the rift that you can use to trigger objective timers
* Ally Team: Enables timing of your allies summoner spells and interactive player banners

## Color Scheme

- ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff`
- ![#a4ba53](https://placehold.it/15/a4ba53/000000?text=+) `#a4ba53`
- ![#222222](https://placehold.it/15/222222/000000?text=+) `#222222`

## Fonts

- [Montserrat](https://www.fontsquirrel.com/fonts/montserrat)
- Arial, Helvetica

## Built With

### Back-end

- [Node.js](https://nodejs.org/en/) - Server framework
- [Express](https://expressjs.com/) - Web framework
- [Riot Games API](https://developer.riotgames.com/) - Data population for active games

### Front-end

- [AngularJS](https://angularjs.org/) - Javascript framework
- [jQuery](https://jquery.com/) - Javascript library
- [Web Speech API](https://w3c.github.io/speech-api/speechapi.html) - A voice recognition and speech synthesis library for Javascript
- [Bootstrap](https://getbootstrap.com/) - front-end component library.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* The countless friends / players that provided input on the project

