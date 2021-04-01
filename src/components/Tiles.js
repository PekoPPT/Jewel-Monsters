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
        await this.createTile(xPosition, yPosition, row, column);
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
    tile.zIndex = 100;
    tile.x = xPosition;
    tile.y = -200;
    tile.interactive = true;
    tile.buttonMode = true;
    tile.anchor.set(0.5);
    tile.row = row;
    tile.col = col;

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

    this.movedTile = this;

    this.data = event.data;

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
  async _onDragEnd() {
    Assets.sounds.stoneHit.play();
    this.alpha = 1;
    this.zIndex = 100;
    this.dragging = false;

    const playground = this.parent.playGround;
    const droppedAt = this.data.getLocalPosition(this.parent);
    const moveThreshold = 60;
    const validLeftMove = droppedAt.x < this.initialPositionX - moveThreshold && this.movedTile.col > 0;
    const validRightMove = droppedAt.x > this.initialPositionX + moveThreshold && this.movedTile.col < playground[0].length - 1;
    const validDownMove = droppedAt.y > this.initialPositionY + moveThreshold && this.movedTile.row < playground.length - 1;
    const validUpMove = droppedAt.y < this.initialPositionY - moveThreshold && this.movedTile.row > 0;

    const horizontalMove = validLeftMove || validRightMove;
    const moveSign = validLeftMove || validUpMove ? -1 : 1;

    if (!(validLeftMove || validRightMove || validDownMove || validUpMove)) {
      this.position.x = this.initialPositionX;
      this.position.y = this.initialPositionY;
      return;
    };

    const otherTile = horizontalMove
      ? playground[this.movedTile.row][this.movedTile.col + moveSign]
      : playground[this.movedTile.row + moveSign][this.movedTile.col];

    this.parent._switchTiles(otherTile, this.movedTile);
    this.parent._moveStoneSound();
    this.parent.emit(Tiles.events.MOVE_MADE);

    if (horizontalMove) {
      this.position.x = this.initialPositionX + moveSign * 100;
      this.position.y = this.initialPositionY;
      if (validLeftMove) {
        await gsap.to(otherTile, { pixi: { positionX: otherTile.x + 100 }, duration: 0.3 });
      } else {
        await gsap.to(otherTile, { pixi: { positionX: otherTile.x - 100 }, duration: 0.3 });
      }
    } else {
      this.position.x = this.initialPositionX;
      this.position.y = this.initialPositionY + moveSign * 100;
      if (validDownMove) {
        await gsap.to(otherTile, { pixi: { positionY: otherTile.y - 100 }, duration: 0.3 });
      } else {
        await gsap.to(otherTile, { pixi: { positionY: otherTile.y + 100 }, duration: 0.3 });
      }
    }
    // setTimeout(() => {
    console.log(this.parent._debugPl(playground));
    // }, 1000);
  }


  _debugPl(playgoround) {
    console.log(playgoround);
    // return playgoround.map((rows) =>
    //   rows.map((tile) => (tile ? {col: tile.col, row: tile.row} : null))
    // )
  }


  _switchTiles(a, b) {
    this.playGround[a.row][a.col] = b;
    this.playGround[b.row][b.col] = a;

    const { col: aCol, row: aRow } = a;
    a.row = b.row;
    a.col = b.col;
    b.row = aRow;
    b.col = aCol;
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
  async _checkForIdenticalElements() {
    const matches = this._getMatches(this.playGround);

    // If there are matches, remove them
    if (matches.length > 0) {

      // Remove the tiles
      await this._removeTileGroup(matches);

      // Move the tiles down to fulfill the gaps opened by the removed tiles

      // setTimeout(() => {
      await this._moveRowsDown();
      // }, 1000)

      // Add new tiles to the board
      // setTimeout(() => {
      await this._fulFillTheGaps();
      // }, 2000)

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
  async _removeTileGroup(matchedRecords) {
    const tilesToDestroy = [];

    // Loop through all the matches and remove tiles
    for (let row = 0; row < matchedRecords.length; row++) {
      const tempArr = matchedRecords[row];
      let scoreGained = 0;

      const xpPositionX = (tempArr[0].col + tempArr[tempArr.length - 1].col) / 2;
      const xpPositionY = (tempArr[0].row + tempArr[tempArr.length - 1].row) / 2;

      for (let col = 0; col < tempArr.length; col++) {

        const tile = tempArr[col];

        // Remove the tile from the screen
        const tileRow = tile.row;
        const tileCol = tile.col;

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

    return Promise.resolve();

  }

  /**
   * Moves the existing tiles down to fulfill the gaps left by the removed tiles
   *
   * @method
   * @private
   * @memberof Tiles
   */
  async _moveRowsDown() {
    for (let row = this.playGround.length - 1; row >= 0; row--) {
      for (let col = this.playGround[row].length - 1; col >= 0; col--) {
        let counter = 0;

        if (this.playGround[row][col] === null) {
          while (row - counter >= 0 && this.playGround[row][col] === null) {
            if (this.playGround[row - counter][col] !== null) {
              this.playGround[row][col] = this.playGround[row - counter][col];
              this.playGround[row][col].row = row;
              this.playGround[row][col].col = col;
              this.playGround[row - counter][col] = null;

              gsap.to(this.playGround[row][col], { y: row * this.tileHeight + (this.tileHeight / 2) - 60 });
            }
            counter += 1;
          }
        }
      }
    }

    return Promise.resolve();

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
      for (let col = 0; col < this.playGround[row].length; col++) {
        if (this.playGround[row][col] === null) {
          await this.createTile(col * 100, row * 100, row, col);
        }
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
