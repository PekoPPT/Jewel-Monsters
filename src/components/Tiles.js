import { Container, Sprite, Texture } from 'pixi.js';
import { random } from '../core/utils';
import Assets from '../core/AssetManager';

import { gsap } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);

export default class Tiles extends Container {
  constructor() {
    super();

    this.sortableChildren = true;
    this.tileHeight = 100;
    this.tileWidth = 100;
    this.playGround = [[], [], [], [], [], []];
    this.init();
  }

  /**
   * Initializes the Board of the game
   *
   * @method
   * @memberof Tiles
   */
  async init() {
    let xPosition = 0;
    let yPosition = 0;

    for (let row = 0; row < 6; row++) {
      for (let column = 0; column < 6; column++) {
        this.createTile(xPosition, yPosition, row, column);
        xPosition += 100;
      }

      xPosition = 0;
      yPosition += 100;
    }

    setTimeout(() => {
      this._checkForIdenticalElements();
    }, 2000);
  }

  /**
   * Creates a single Tile. Adds it to the Playground array and assigns mouse and click events
   *
   * @param {*} randomTile - The tyle of the tile that will be initialized
   * @param {*} xPosition - The X position of the new tile
   * @param {*} yPosition - THe Y position of the new tile
   * @param {*} row - The row number in which the element is poistion in the Playgound
   * @param {*} col - The column number in which the element is poistion in the Playgound
   * @method
   * @memberof Tiles
   */
  async createTile(xPosition, yPosition, row, col) {
    const tileId = ['snowTile', 'leafTile', 'flameTile', 'potionTile', 'vortexTile', 'skullTile'][random(0, 5)];

    const tile = new Sprite.from(tileId);
    tile.tileType = tileId;
    tile.name = String(row) + col;
    tile.zIndex = 100;
    tile.x = xPosition;
    tile.y = -200;
    tile.interactive = true;
    tile.buttonMode = true;
    tile.anchor.set(0.5);

    gsap.to(tile, { y: row * this.tileHeight + (this.tileHeight / 2) - 60 });

    tile
      // events for drag start
      .on('mousedown', this._onDragStart)
      .on('touchstart', this._onDragStart)
      // events for drag end
      .on('mouseup', this._onDragEnd)
      .on('mouseupoutside', this._onDragEnd)
      .on('touchend', this._onDragEnd)
      .on('touchendoutside', this._onDragEnd)
      // events for drag move
      .on('mousemove', this._onDragMove)
      .on('touchmove', this._onDragMove);

    this.playGround[row][col] = tile;

    this.addChild(tile);
  }

  /**
   * Controls the logic when a tiles is Clicked or Tapped
   *
   * @param {*} event
   * @method
   * @private
   * @memberof Tiles
   */
  _onDragStart(event) {
    this.zIndex = 1000;

    const nameSplit = this.name.split('');
    this.data = event.data;

    this.currentTileRow = Number(nameSplit[0]);
    this.currentTileCol = Number(nameSplit[1]);
    this.initialPositionX = this.position.x;
    this.initialPositionY = this.position.y;
    this.alpha = 0.5;
    this.dragging = true;
  }

  /**
   * Controls the logic when a tiles is dropped
   *
   * @method
   * @private
   * @memberof Tiles
   */
  _onDragEnd() {
    Assets.sounds.stoneHit.play();
    debugger;
    this.alpha = 1;
    this.dragging = false;

    const newPosition = this.data.getLocalPosition(this.parent);

    const oldX = this.initialPositionX;
    const oldY = this.initialPositionY;

    const newX = newPosition.x;
    const newY = newPosition.y;

    const max = 600;
    const min = 0;

    const moveThreshold = 60;

    const playground = this.parent.playGround;

    // Exchnage tile with the one on left
    if (newX < oldX - moveThreshold && this.initialPositionX > min) {
      // Set the position of the new tile;
      this.position.x = oldX - 100;
      this.position.y = oldY;

      // Identify tile over which we are moving
      const itemToMove = playground[this.currentTileRow][this.currentTileCol - 1];

      // Tile being moved
      const selectedTile = playground[this.currentTileRow][this.currentTileCol];

      // Remove this when we get rid of the names
      const tile1 = playground[this.currentTileRow][this.currentTileCol - 1];
      const tile2 = playground[this.currentTileRow][this.currentTileCol];
      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(this.currentTileRow) + Number(this.currentTileCol - 1);

      // Switch the tiles
      playground[this.currentTileRow][this.currentTileCol] = itemToMove;
      playground[this.currentTileRow][this.currentTileCol - 1] = selectedTile;

      // Play sound & do animation
      this.parent._moveStoneSound();
      gsap.to(itemToMove, { pixi: { positionX: itemToMove.x + 100 }, duration: 0.3 });

      this.parent.emit(Tiles.events.MOVE_MADE);
    }

    // Exchnage tile with the one on right
    else if (newX > oldX + moveThreshold && this.initialPositionX < max) {
      this.position.x = oldX + 100;
      this.position.y = oldY;

      // Identify tile over which we are moving
      const itemToMove = playground[this.currentTileRow][this.currentTileCol + 1];

      // Tile being moved
      const selectedTile = playground[this.currentTileRow][this.currentTileCol];

      // Remove this when we get rid of the names
      const tile1 = playground[this.currentTileRow][this.currentTileCol + 1];
      const tile2 = playground[this.currentTileRow][this.currentTileCol];

      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(this.currentTileRow) + Number(this.currentTileCol + 1);

      // Switch the tiles
      playground[this.currentTileRow][this.currentTileCol] = itemToMove;
      playground[this.currentTileRow][this.currentTileCol + 1] = selectedTile;

      // Play sound & do animation
      this.parent._moveStoneSound();
      gsap.to(itemToMove, { pixi: { positionX: itemToMove.x - 100 }, duration: 0.3 });

      // Emit an event on every move.
      this.parent.emit(Tiles.events.MOVE_MADE);
    }

    // Exchnage tile with the one below
    else if (newY > oldY + moveThreshold && this.initialPositionY < max) {

      this.position.x = oldX;
      this.position.y = oldY + 100;

      // Identify tile over which we are moving
      const itemToMove = playground[this.currentTileRow + 1][this.currentTileCol];

      // Tile being moved
      const selectedTile = playground[this.currentTileRow][this.currentTileCol];

      // Remove this when we get rid of the names
      const tile1 = playground[this.currentTileRow + 1][this.currentTileCol];
      const tile2 = playground[this.currentTileRow][this.currentTileCol];
      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(this.currentTileRow + 1) + Number(this.currentTileCol);

      // Switch the tiles
      playground[this.currentTileRow][this.currentTileCol] = itemToMove;
      playground[this.currentTileRow + 1][this.currentTileCol] = selectedTile;

      // Play sound & do animation
      this.parent._moveStoneSound();
      gsap.to(itemToMove, { pixi: { positionY: itemToMove.y - 100 }, duration: 0.3 });

      // Emit an event on every move.
      this.parent.emit(Tiles.events.MOVE_MADE);

    }

    // Exchnage tile with the one above
    else if (newY < oldY - moveThreshold && this.initialPositionY > min) {

      this.position.x = oldX;
      this.position.y = oldY - 100;

      // Identify tile over which we are moving
      const itemToMove = playground[this.currentTileRow - 1][this.currentTileCol];

      // Tile being moved
      const selectedTile = playground[this.currentTileRow][this.currentTileCol];


      // Remove this when we get rid of the names
      const tile1 = playground[this.currentTileRow - 1][this.currentTileCol];
      const tile2 = playground[this.currentTileRow][this.currentTileCol];
      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(this.currentTileRow - 1) + Number(this.currentTileCol);

      // Switch the tiles
      playground[this.currentTileRow][this.currentTileCol] = itemToMove;
      playground[this.currentTileRow - 1][this.currentTileCol] = selectedTile;

      // Play sound & do animation
      this.parent._moveStoneSound();
      gsap.to(itemToMove, { pixi: { positionY: itemToMove.y + 100 }, duration: 0.3 });

      // Emit an event on every move.
      this.parent.emit(Tiles.events.MOVE_MADE);

    } else {
      this.position.x = this.initialPositionX;
      this.position.y = this.initialPositionY;
    }

    this.zIndex = 100;
  }

  /**
   * Controls the logic when a tiles is dragged
   *
   * @method
   * @private
   * @memberof Tiles
   */
  _onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);

      this.position.x = newPosition.x;
      this.position.y = newPosition.y;

    }
  }

  /**
   * Plays sound when a Tile is moved
   *
   * @method
   * @private
   * @memberof Tiles
   */
  _moveStoneSound() {
    Assets.sounds.scrapingStone.play();
  }


  /**
   * Check for identical elements in the playgound.
   * Handles the remove of the matched Tiles and the generation of the new ones.
   *
   * @method
   * @private
   * @memberof Tiles
   */
  _checkForIdenticalElements() {
    const matches = this._getMatches(this.playGround);

    // If there are matches, remove them
    if (matches.length > 0) {

      // Remove the tiles
      this._removeTileGroup(matches);

      // Move the tiles down to fulfill the gaps opened by the removed tiles
      this._moveRowsDown();

      // Add new tiles to the board
      this._fulFillTheGaps();

    } else {
      // If there are no matches available
    }
  }

  /**
   * Returns the groups of the matching tiles in the Playfround
   *
   * @param {Array} tileGrid - The two dimensional array that holds the Playground
   * @return {Array} - Holds all the groups of matching Tiles
   * @method
   * @private
   * @memberof Tiles
   */
  _getMatches(tileGrid) {
    const matches = [];
    let matchedTiles = [];

    // Check the board for horizontal matches
    for (let row = 0; row < tileGrid.length; row++) {
      const tempArr = tileGrid[row];

      matchedTiles = [];

      for (let col = 0; col < tempArr.length; col++) {
        if (col < tempArr.length - 2) {
          if (tileGrid[row][col] && tileGrid[row][col + 1] && tileGrid[row][col + 2]) {
            if (tileGrid[row][col].tileType === tileGrid[row][col + 1].tileType && tileGrid[row][col + 1].tileType === tileGrid[row][col + 2].tileType) {
              if (matchedTiles.length > 0 && matchedTiles.indexOf(tileGrid[row][col]) === -1) {
                matches.push(matchedTiles);
                matchedTiles = [];
              }

              if (matchedTiles.indexOf(tileGrid[row][col]) === -1) {
                matchedTiles.push(tileGrid[row][col]);
              }
              if (matchedTiles.indexOf(tileGrid[row][col + 1]) === -1) {
                matchedTiles.push(tileGrid[row][col + 1]);
              }
              if (matchedTiles.indexOf(tileGrid[row][col + 2]) === -1) {
                matchedTiles.push(tileGrid[row][col + 2]);
              }
            }
          }
        }
      }
      if (matchedTiles.length > 0) matches.push(matchedTiles);
    }

    // Check the board for vertical matches

    for (let col = 0; col < tileGrid.length; col++) {
      const tempArr = tileGrid[col];

      matchedTiles = [];
      for (let row = 0; row < tempArr.length; row++) {
        if (row < tempArr.length - 2) {
          if (tileGrid[row][col] && tileGrid[row + 1][col] && tileGrid[row + 2][col]) {
            if (tileGrid[row][col].tileType === tileGrid[row + 1][col].tileType && tileGrid[row + 1][col].tileType === tileGrid[row + 2][col].tileType) {
              if (matchedTiles.length > 0 && matchedTiles.indexOf(tileGrid[row][col]) === -1) {
                matches.push(matchedTiles);
                matchedTiles = [];
              }

              if (matchedTiles.indexOf(tileGrid[row][col]) === -1) {
                matchedTiles.push(tileGrid[row][col]);
              }
              if (matchedTiles.indexOf(tileGrid[row + 1][col]) === -1) {
                matchedTiles.push(tileGrid[row + 1][col]);
              }
              if (matchedTiles.indexOf(tileGrid[row + 2][col]) === -1) {
                matchedTiles.push(tileGrid[row + 2][col]);
              }
            }
          }
        }
      }
      if (matchedTiles.length > 0) matches.push(matchedTiles);
    }

    return matches;
  }

  /**
   * Removes the groups of matching Tiles
   *
   * @param {Array} matchedRecords - Holds all groups of matching Tiles
   * @method
   * @private
   * @memberof Tiles
   */
  _removeTileGroup(matchedRecords) {
    const tilesToDestroy = [];

    // Loop through all the matches and remove tiles
    for (let row = 0; row < matchedRecords.length; row++) {
      const tempArr = matchedRecords[row];
      let scoreGained = 0;

      const xpPositionX = (parseInt(tempArr[0].name[1]) + parseInt(tempArr[tempArr.length - 1].name[1])) / 2;
      const xpPositionY = (parseInt(tempArr[0].name[0]) + parseInt(tempArr[tempArr.length - 1].name[0])) / 2;

      for (let col = 0; col < tempArr.length; col++) {

        const tile = tempArr[col];

        // Remove the tile from the screen
        const tileRow = tile.name[0];
        const tileCol = tile.name[1];

        tilesToDestroy.push(tile);
        this.playGround[tileRow][tileCol] = null;

        tilesToDestroy.forEach((tile) => {
          this.parent.removeChild(tile);
          gsap.to(tile, { pixi: { autoAlpha: 0 } });
        });
      }


      if (tempArr.length === 3) {
        scoreGained = 300;
      } else if (tempArr.length === 4) {
        scoreGained = 450;
      } else if (tempArr.length === 5) {
        scoreGained = 600;
      } else if (tempArr.length === 6) {
        scoreGained = 750;
      }

      this.emit(Tiles.events.TILE_NUMBER_CALCULATIONS_READY, scoreGained, xpPositionX, xpPositionY);
    }
  }

  /**
   * Moves the existing tiles down to fulfill the gaps left by the removed tiles
   *
   * @method
   * @private
   * @memberof Tiles
   */
  _moveRowsDown() {
    for (let row = this.playGround.length - 1; row >= 0; row--) {
      for (let y = this.playGround[row].length - 1; y >= 0; y--) {
        let counter = 0;

        if (this.playGround[row][y] === null) {
          while (row - counter >= 0 && this.playGround[row][y] === null) {
            if (this.playGround[row - counter][y] !== null) {
              this.playGround[row][y] = this.playGround[row - counter][y];
              this.playGround[row][y].name = String(row) + y;
              gsap.to(this.playGround[row][y], { y: row * this.tileHeight + (this.tileHeight / 2) - 60 });
              this.playGround[row - counter][y] = null;
            }
            counter += 1;
          }
        }
      }
    }

    // setTimeout(() => {
    this.playGround.forEach((row) => {
      let namesArr = [];
      // console.log(row);
      row.forEach((record) => {
        if (record !== null) {
          namesArr.push(record.name);
        } else {
          namesArr.push(null);
        }
      });
      namesArr = [];
    });
    // }, 1000);
    // setTimeout(() => {

    //   this.playGround.forEach((row) => {
    //     let namesArr = [];
    //     row.forEach((record) => namesArr.push(record.name));
    //     console.log(namesArr);
    //     namesArr = [];
    //   })
    // }, 1000);

  }

  /**
   * Generates new tiles and add them on the top of each playgorund column
   *
   * @method
   * @private
   * @memberof Tiles
   */
  async _fulFillTheGaps() {

    for (let row = this.playGround.length - 1; row >= 0; row--) {
      for (let y = 0; y < this.playGround[row].length; y++) {
        if (this.playGround[row][y] === null) {
          await this.createTile(y * 100, row * 100, row, y);
        };
      }
    }
    setTimeout(() => {
      this._checkForIdenticalElements();
    }, 1000);
  }

  /**
   * Defines the events triggered by each Tile
   *
   * @readonly
   * @static
   * @memberof Tiles
   */
  static get events() {
    return {
      MOVE_MADE: 'move_made',
      TILE_NUMBER_CALCULATIONS_READY: 'calculations_ready'
    };
  }

}
