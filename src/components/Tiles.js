import { Container, Sprite, Texture } from 'pixi.js';
import { random } from '../core/utils';

import { gsap, TimelineMax } from "gsap";
import PixiPlugin from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);

export default class Tiles extends Container {
  constructor() {
    super();

    this.sortableChildren = true;
    this.playGround = [[], [], [], [], [], []];
    this.init();
  }

  _tileGenerator() {
    const randomValue = random(1, 6);

    let randomTile;
    switch (randomValue) {
      case 1:
        randomTile = 'snowTile';
        break;
      case 2:
        randomTile = 'leafTile';
        break;
      case 3:
        randomTile = 'flameTile';
        break;
      case 4:
        randomTile = 'potionTile';
        break;
      case 5:
        randomTile = 'vortexTile';
        break;
      case 6:
        randomTile = 'skullTile';
        break;
    }

    return { randomTile, randomValue };
  }

  init() {

    let xPosition = 0;
    let yPosition = 0;
    for (let row = 0; row < 6; row++) {
      for (let column = 0; column < 6; column++) {
        const { randomTile, randomValue } = this._tileGenerator();
        this.createTile(randomTile, xPosition, yPosition, row, column);
        xPosition += 100;
      }
      xPosition = 0;
      yPosition += 100;
    }

    this._checkForIdenticalElements();
  }

  createTile(randomTile, xPosition, yPosition, row, col) {
    const tile = new Sprite.from(randomTile);
    if (tile === null) {
      alert("Title is null");
    }
    tile.tileType = randomTile;
    tile.name = String(row) + col;
    tile.zIndex = 100;
    tile.x = xPosition;
    tile.y = yPosition;
    tile.interactive = true;
    tile.buttonMode = true;
    tile.anchor.set(0.5);

    tile
      // events for drag start
      .on('mousedown', this.onDragStart)
      .on('touchstart', this.onDragStart)
      // events for drag end
      .on('mouseup', this.onDragEnd)
      .on('mouseupoutside', this.onDragEnd)
      .on('touchend', this.onDragEnd)
      .on('touchendoutside', this.onDragEnd)
      // events for drag move
      .on('mousemove', this.onDragMove)
      .on('touchmove', this.onDragMove);

    // this.playGround[row].push(tile);
    this.playGround[row][col] = tile;

    this.addChild(tile);
  }

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch

    this.zIndex = 1000;

    const nameSplit = this.name.split('');
    this.data = event.data;

    this.currentTileRow = nameSplit[0];
    this.currentTileCol = nameSplit[1];
    this.initialPositionX = this.position.x;
    this.initialPositionY = this.position.y;
    this.alpha = 0.5;
    this.dragging = true;
  }

  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;

    const newPosition = this.data.getLocalPosition(this.parent);

    if (newPosition.x < this.initialPositionX - 60 && this.name !== '00' && this.name !== '10' && this.name !== '20' && this.name !== '30' && this.name !== '40' && this.name !== '50') {
      this.position.x = this.initialPositionX - 100;
      this.position.y = this.initialPositionY;

      const itemToMoveSelector = String(this.currentTileRow) + Number(this.currentTileCol - 1);
      const itemToMove = this.parent.getChildByName(itemToMoveSelector);
      gsap.to(itemToMove, { pixi: { positionX: itemToMove.x + 100 }, duration: 0.3 });

      const selectedTile = this.parent.playGround[this.currentTileRow][this.currentTileCol];

      this.parent.playGround[this.currentTileRow][this.currentTileCol] = this.parent.playGround[this.currentTileRow][this.currentTileCol - 1];
      this.parent.playGround[this.currentTileRow][this.currentTileCol - 1] = selectedTile;

      const tile1 = this.parent.getChildByName(String(this.currentTileRow) + Number(this.currentTileCol - 1));
      const tile2 = this.parent.getChildByName(String(this.currentTileRow) + Number(this.currentTileCol));

      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(this.currentTileRow) + Number(this.currentTileCol - 1);

      // Emit an event on every move. 
      this.parent.emit(Tiles.events.MOVE_MADE);

    } else if (newPosition.x > this.initialPositionX + 60 && this.name !== '05' && this.name !== '15' && this.name !== '25' && this.name !== '35' && this.name !== '45' && this.name !== '55') {
      this.position.x = this.initialPositionX + 100;
      this.position.y = this.initialPositionY;

      const row = this.currentTileRow;
      const col = Number(this.currentTileCol) + 1;

      const itemToMoveSelector = String(row + col);
      const itemToMove = this.parent.getChildByName(itemToMoveSelector);
      gsap.to(itemToMove, { pixi: { positionX: itemToMove.x - 100 }, duration: 0.3 });

      const selectedTile = this.parent.playGround[this.currentTileRow][this.currentTileCol];

      this.parent.playGround[this.currentTileRow][this.currentTileCol] = this.parent.playGround[this.currentTileRow][Number(this.currentTileCol) + 1];
      this.parent.playGround[this.currentTileRow][Number(this.currentTileCol) + 1] = selectedTile;

      const tile1 = this.parent.getChildByName(String(row + col));
      const tile2 = this.parent.getChildByName(String(this.currentTileRow) + this.currentTileCol);

      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(row + col);


      // Emit an event on every move. 
      this.parent.emit(Tiles.events.MOVE_MADE);

    } else if (newPosition.y > this.initialPositionY + 60 && this.name !== '50' && this.name !== '51' && this.name !== '52' && this.name !== '53' && this.name !== '54' && this.name !== '55') {
      this.position.x = this.initialPositionX;
      this.position.y = this.initialPositionY + 100;

      const row = Number(this.currentTileRow) + 1;
      const col = this.currentTileCol;

      const itemToMoveSelector = String(row + col);
      const itemToMove = this.parent.getChildByName(itemToMoveSelector);
      gsap.to(itemToMove, { pixi: { positionY: itemToMove.y - 100 }, duration: 0.3 });

      const selectedTile = this.parent.playGround[this.currentTileRow][this.currentTileCol];
      this.parent.playGround[this.currentTileRow][this.currentTileCol] = this.parent.playGround[Number(this.currentTileRow) + 1][this.currentTileCol];
      this.parent.playGround[Number(this.currentTileRow) + 1][this.currentTileCol] = selectedTile;

      const tile1 = this.parent.getChildByName(String(row + col));
      const tile2 = this.parent.getChildByName(String(this.currentTileRow) + this.currentTileCol);

      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(row + col);

      // Emit an event on every move. 
      this.parent.emit(Tiles.events.MOVE_MADE);

    } else if (newPosition.y < this.initialPositionY - 60 && this.name !== '00' && this.name !== '01' && this.name !== '02' && this.name !== '03' && this.name !== '04' && this.name !== '05') {
      this.position.x = this.initialPositionX;
      this.position.y = this.initialPositionY - 100;

      const row = Number(this.currentTileRow) - 1;
      const col = this.currentTileCol;

      const itemToMoveSelector = String(row + col);
      const itemToMove = this.parent.getChildByName(itemToMoveSelector);
      gsap.to(itemToMove, { pixi: { positionY: itemToMove.y + 100 }, duration: 0.3 });

      const selectedTile = this.parent.playGround[this.currentTileRow][this.currentTileCol];
      this.parent.playGround[this.currentTileRow][this.currentTileCol] = this.parent.playGround[Number(this.currentTileRow) - 1][this.currentTileCol];
      this.parent.playGround[Number(this.currentTileRow) - 1][this.currentTileCol] = selectedTile;

      const tile1 = this.parent.getChildByName(String(row + col));
      const tile2 = this.parent.getChildByName(String(this.currentTileRow) + this.currentTileCol);

      tile1.name = String(this.currentTileRow) + Number(this.currentTileCol);
      tile2.name = String(row + col);

      // Emit an event on every move. 
      this.parent.emit(Tiles.events.MOVE_MADE);

    } else {
      this.position.x = this.initialPositionX;
      this.position.y = this.initialPositionY;
    }


    // set the interaction data to null
    this.data = null;
    this.initialPositionX = null;
    this.initialPositionY = null;
    this.currentTileCol = null;
    this.currentTileRow = null;
    this.zIndex = 100;
    // this.parent._checkForIdenticalElements();
    // console.log(this.parent.playGround);
  }

  onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);

      this.position.x = newPosition.x;
      this.position.y = newPosition.y;

    }
  }


  _checkForIdenticalElements() {
    console.log("Identical Elements check");
    let resultArr = [];

    for (let i = 0; i < this.playGround.length; i++) {
      let counter = 1;
      let result = [];
      for (let y = 0; y < this.playGround[i].length; y++) {
        if (this.playGround[i][y] !== null && this.playGround[i][y + 1] && this.playGround[i][y].tileType === this.playGround[i][y + 1].tileType) {
          counter++;
        } else {
          result.push(counter);
          counter = 1;
        }
      }
      resultArr.push(result);
    }

    for (let i = resultArr.length - 1; i >= 0; i--) {
      let fiveElementsSequenceIndexStart = resultArr[i].indexOf(5);
      let fourElementsSequenceIndexStart = resultArr[i].indexOf(4);
      let threeElementsSequenceIndexStart = resultArr[i].indexOf(3);

      let lastElementOfMatch;


      console.log("Five=", fiveElementsSequenceIndexStart);
      console.log("Four=", fourElementsSequenceIndexStart);
      console.log("THree=", threeElementsSequenceIndexStart);

      if (fiveElementsSequenceIndexStart !== -1) {
        const rowToHideElementsFrom = this.playGround[i];
        for (let y = fiveElementsSequenceIndexStart; y < fiveElementsSequenceIndexStart + 5; y++) {
          const elementName = rowToHideElementsFrom[y];
          console.log(elementName);
          lastElementOfMatch = elementName.x;
          gsap.to(elementName, { pixi: { autoAlpha: 0 } });
          elementName.destroy();
          this.playGround[i][y] = null;
        }
        this.emit(Tiles.events.TILE_NUMBER_CALCULATIONS_READY, 600, lastElementOfMatch);
        this._moveRowsDown();
      } else if (fourElementsSequenceIndexStart !== -1) {
        const rowToHideElementsFrom = this.playGround[i];
        for (let y = fourElementsSequenceIndexStart; y < fourElementsSequenceIndexStart + 4; y++) {
          const elementName = rowToHideElementsFrom[y];
          gsap.to(elementName, { pixi: { autoAlpha: 0 } });
          elementName.destroy();
          // Emit an event on every move. 
          this.playGround[i][y] = null;
        }
        this.emit(Tiles.events.TILE_NUMBER_CALCULATIONS_READY, 450);
        this._moveRowsDown();
      } else if (threeElementsSequenceIndexStart !== -1) {
        const rowToHideElementsFrom = this.playGround[i];
        for (let y = threeElementsSequenceIndexStart; y < threeElementsSequenceIndexStart + 3; y++) {
          const elementName = rowToHideElementsFrom[y];
          gsap.to(elementName, { pixi: { autoAlpha: 0 } });
          elementName.destroy();
          this.playGround[i][y] = null;
        }
        this.emit(Tiles.events.TILE_NUMBER_CALCULATIONS_READY, 300);
        this._moveRowsDown();
      };
    }

    // console.log(this.playGround);

  }


  _moveRowsDown() {
    // console.log("MoveRowsDown");
    for (let i = this.playGround.length - 1; i >= 0; i--) {
      for (let y = 0; y < this.playGround[i].length; y++) {
        if (this.playGround[i][y] === null && i !== 0) {
          let counter = 1;
          while (this.playGround[i - counter][y] === null || i - counter < 0) {
            counter++;
          }

          if (i - counter >= 0) {
            this.playGround[i][y] = this.playGround[i - counter][y];

            this.playGround[i][y].name = i + '' + y;
            gsap.to(this.playGround[i][y], { pixi: { positionY: this.playGround[i][y].y + 100 } });
            this.playGround[i - counter][y] = null;
          }
          else {
            this.playGround[i][y] = null;
          }
        }
        else if (this.playGround[i][y] === null && i === 0) {
          const { randomTile, randomValue } = this._tileGenerator();
          this.createTile(randomTile, y * 100, i * 100, i, y);
        }
      }
    }
    this._fulFillTheGaps();
  }

  _fulFillTheGaps() {
    for (let i = this.playGround.length - 1; i >= 0; i--) {
      for (let y = 0; y < this.playGround[i].length; y++) {
        if (this.playGround[i][y] === null) {
          const { randomTile, randomValue } = this._tileGenerator();
          this.createTile(randomTile, y * 100, i * 100, i, y);
        };
      }
    }
  }


  static get events() {
    return {
      MOVE_MADE: 'move_made',
      TILE_NUMBER_CALCULATIONS_READY: 'calculations_ready'
    };
  }

}
