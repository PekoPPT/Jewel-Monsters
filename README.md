# Jewel Monsters - A game with "Bejeweled" or "Candy Crush" gameplay

## Gameplay and rules

The user has to reach a score of 5000 points by moving the tiles on the board. The tiles should create a connection of more than 3 one and the same symbols. Based on the number of connected tiles the points the player gets are as follows:
* 3 Tiles - 300 points
* 4 Tiles - 450 points
* 5 Tiles - 600 points
* 6 Tiles - 750 points 

The games ends if the user collect 5000 points or when more than 20 moves are made. 

## Game features:
Based on the pre-defined specifications the following requirements are met: 

* Project based on [PIXI.js Boilerplate](https://github.com/dopamine-lab/pixi-boilerplate)
* The game has animations and transitions during the gameplay
* The expected gameplay
* Loading scene with circular loading bar
* Has Win and Lose screens
* The XP won with each move flies out of the created line
* There are animations in the tiles' moving
* The user has to reach 5000 xp in 20 moves
* The Monsters that appear in the game are moving up and down
* The score's progressbar is filled based in a way that corresponds to the gained XP points
* The player's moves are counted in the area above the playground
* The game has background sounds, sounds when the tiles are droped, while the tiles are moving and when the player win or lose the game
* The code is well commented using jsDocs
* Runs on 60fps
* The project has [Cypress](https://www.cypress.io/) tests implemeted
## How to start, run & build for production?

| Command | Description |
|---------|-------------|
| 1. `npm install` | Install project dependencies |
| 2. `npm start` | Build project and open web server running project |
| 3. `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## How to run the tests?

| Command | Description |
|---------|-------------|
| 1. `npm start` | Make sure that you have a running project by starting the `npm start` commad |
| 2. `npm test` | Run the Cypress tests |

## Future improvements
* Add separate Win a Lose scenese
* Rewrite the Tile moves implementation
* Rewrite the Tile moves implementation in a way this functionality can be tested with Cypress
* Make the game more catchy by creating additional animations for the Monsters, Fire and other elements 

🟡🟡🟡