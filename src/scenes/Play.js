import { gsap, Sine } from 'gsap';
import { Sprite } from 'pixi.js';
import Character from '../components/Character';
import Moves from '../components/Moves';
import ProgressBar from '../components/ProgressBar';
import Tiles from '../components/Tiles';
import XP from '../components/XP';
import Assets from '../core/AssetManager';
import Scene from './Scene';

export default class Play extends Scene {
  constructor() {
    super();
    this.movesToPlay = 20;
    this.winScreenVisible = false;
    this.loseScreenVisible = false;

  }
  async onCreated() {
    await this._addMonsters();
    await this._addMovesPanel();
    await this._addProgressBar();
    await this._addTiles();

    // this._addBackgroundSounds();
    // play the backgroudn music
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars

  }

  /**
   * Defines tiles board and initializes all tiles 
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _addTiles() {
    const that = this;
    const tiles = new Tiles();
    this.name = 'playground';
    this.tiles = tiles;
    this.tiles.x = - 280;
    this.tiles.y = - 211;
    this.tiles.on('move_made', function moveMade() {
      that.movesToPlay -= 1;
      if (that.movesToPlay === 0) {
        that._showLoseScreen();
      }
      that.movesPanel.changeMoves(that.movesToPlay);
      that.tiles._checkForIdenticalElements();
    });

    // Executed when all operations on the playground are completed.
    // Updates the score in the progress bar
    // Adds 
    this.tiles.on('calculations_ready', function calculations_ready(scoreToChange, xpPositionX, xpPositionY) {

      if (scoreToChange > 300) {
        that.monsterBig._openEyes();
        that.monsterSmall._openEyes();
      }

      that.progressBar.changeScore(scoreToChange);
      const textSample = new XP(scoreToChange);
      that.addChild(textSample);

      textSample.position.x = xpPositionX * 100 - 320;
      textSample.position.y = xpPositionY * 100 - 220;
      textSample.name = 'xpGained';

      gsap.to(textSample, { pixi: { scale: 2, autoAlpha: 0 }, duration: 3 }).then(() => {
        that.removeChild(textSample);
      });
    });
    this.addChild(this.tiles);
  }

  /**
   * Initializes the monsters that appear next to the playground
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _addMonsters() {
    const monsterBig = new Character();
    this.monsterBig = monsterBig;

    const monsterSmall = new Character();
    this.monsterSmall = monsterSmall;

    this.monsterBig.x = -623;
    this.monsterBig.y = -111;
    gsap.to(this.monsterBig, {
      pixi: { y: -90 }, yoyo: true, repeat: -1, duration: 3, ease: Sine.easeInOut
    });

    this.monsterSmall.x = 345;
    this.monsterSmall.y = -305;
    this.monsterSmall.scale.set(0.4);
    gsap.to(this.monsterSmall, {
      pixi: { y: -280 }, yoyo: true, repeat: -1, duration: 6, ease: Sine.easeInOut
    });

    this.addChild(this.monsterBig);
    this.addChild(this.monsterSmall);
  }

  /**
   *Initizlies the "Moves" panel that appears above the tiles board

   * @method
   * @private
   * @memberof Play
   */
  async _addMovesPanel() {
    this.movesPanel = new Moves();
    this.movesPanel.x = - 2;
    this.movesPanel.y = - 480;

    this.addChild(this.movesPanel);
  }

  /**
   *Initizlies the Progressbar, the current points the targeted points in the tile
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _addProgressBar() {
    const that = this;
    const progressBar = new ProgressBar();
    this.progressBar = progressBar;
    this.progressBar.on('game_won', function gameWon() {
      if (this.parent.winScreenVisible === false) {
        that._showWinScreen();
      }
    });
    this.addChild(this.progressBar);
  }

  /**
   * Shows the win screen with all its items for the end of the game
   * @method
   * @private
   * @memberof Play
   */
  async _showWinScreen() {
    Assets.sounds.jingleAchievement.play();

    this.winScreenVisible = true;
    this._hidePlayGround();

    await this._addXpIconToWinScreen('xpLeft', - 387, - 271, 0.45, -0.5);
    await this._addXpIconToWinScreen('xpTop', 148, - 501, 0.5, 0.45);
    await this._addXpIconToWinScreen('xpRight', 381, - 223, 1, 0.69);

    const winScreenMonsterLeft = new Character(true);
    this.winScreenMonsterLeft = winScreenMonsterLeft;
    this.winScreenMonsterLeft.x = -308;
    this.winScreenMonsterLeft.y = -353;
    this.winScreenMonsterLeft.scale.set(0.7);
    gsap.to(this.winScreenMonsterLeft, {
      pixi: { y: -360 }, yoyo: true, repeat: -1, duration: 3, ease: Sine.easeInOut
    });

    const winScreenMonsterCenter = new Character(true);
    this.winScreenMonsterCenter = winScreenMonsterCenter;
    this.winScreenMonsterCenter.x = -110;
    this.winScreenMonsterCenter.y = -492;
    this.winScreenMonsterCenter.scale.set(0.44);
    gsap.to(this.winScreenMonsterCenter, {
      pixi: { y: -485 }, yoyo: true, repeat: -1, duration: 2, ease: Sine.easeInOut
    });

    const winScreenMonsterRight = new Character(true);
    this.winScreenMonsterRight = winScreenMonsterRight;
    this.winScreenMonsterRight.x = 40;
    this.winScreenMonsterRight.y = -431;
    this.winScreenMonsterRight.scale.set(1);
    gsap.to(this.winScreenMonsterRight, {
      pixi: { y: -420 }, yoyo: true, repeat: -1, duration: 4, ease: Sine.easeInOut
    });

    this.addChild(this.winScreenMonsterLeft);
    this.addChild(this.winScreenMonsterCenter);
    this.addChild(this.winScreenMonsterRight);
    await this._addLevelPassedLabel();
    await this._addPressSpaceButton();

  }

  /**
   * Shows the "Lose" screen of the game
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _showLoseScreen() {
    Assets.sounds.loseGameSound.play();

    this.loseScreenVisible = true;
    this._hidePlayGround();
    this._addLoseLabel();
    this._addPressSpaceButton();
  }

  /**
   * Hides the "Lose" screen from the game
   *
   * @method
   * @private
   * @memberof Play
   */
  async _hideLoseScreen() {
    this.removeChild(this.restartBtn);
    this.removeChild(this.loseLabel);
    document.removeEventListener('keypress', function () { });
    this.loseScreenVisible = false;
  }

  /**
   * Hides the playground of the game
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _hidePlayGround() {
    gsap.to(this.tiles, { pixi: { alpha: 0 } });
    gsap.to(this.movesPanel, { pixi: { alpha: 0 } });
    gsap.to(this.monsterBig, { pixi: { alpha: 0 } });
    gsap.to(this.monsterSmall, { pixi: { alpha: 0 } });
    await gsap.to(this.progressBar, { pixi: { alpha: 0 } });
    this.removeChild(this.tiles);
    this.removeChild(this.movesPanel);
    this.removeChild(this.progressBar);
    this.removeChild(this.monsterBig);
    this.removeChild(this.monsterSmall);
  }

  /**
   * Hides the win screen of the game
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _hideWinScreen() {
    gsap.to(this.winScreenMonsterLeft, { pixi: { alpha: 0 } });
    gsap.to(this.winScreenMonsterCenter, { pixi: { alpha: 0 } });
    gsap.to(this.winScreenMonsterRight, { pixi: { alpha: 0 } });
    gsap.to(this.winLabel, { pixi: { alpha: 0 } });
    gsap.to(this.restartBtn, { pixi: { alpha: 0 } });
    gsap.to(this.getChildByName('xpLeft'), { pixi: { alpha: 0 } });
    gsap.to(this.getChildByName('xpTop'), { pixi: { alpha: 0 } });
    gsap.to(this.getChildByName('xpRight'), { pixi: { alpha: 0 } });

    this.removeChild(this.winScreenMonsterLeft);
    this.removeChild(this.winScreenMonsterCenter);
    this.removeChild(this.winScreenMonsterRight);
    this.removeChild(this.winLabel);
    this.removeChild(this.restartBtn);
    document.removeEventListener('keydown', function () { });
    this.removeChild(this.getChildByName('xpLeft'));
    this.removeChild(this.getChildByName('xpTop'));
    this.removeChild(this.getChildByName('xpRight'));
    this.winScreenVisible = false;

  }

  /**
   * Adds the "Game WIN" label
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _addLevelPassedLabel() {
    const winLabel = new Sprite.from('labelPassed');
    this.winLabel = winLabel;
    this.winLabel.anchor.set(0.5);
    this.winLabel.x = -7;
    this.winLabel.y = - 70;
    this.winLabel.scale = 0;
    gsap.to(this.winLabel, { pixi: { scale: 1 } });

    this.addChild(this.winLabel);
  }

  /**
   * Adds the "Game Over" label
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _addLoseLabel() {
    const loseLabel = new Sprite.from('labelFailed');
    this.loseLabel = loseLabel;
    this.loseLabel.anchor.set(0.5);
    this.loseLabel.x = -7;
    this.loseLabel.y = - 70;
    this.loseLabel.scale = 0;
    gsap.to(this.loseLabel, { pixi: { scale: 1 } });

    this.addChild(this.loseLabel);
  }

  /**
   * Adds XP icon to the game. Used in the "Win" screen
   * 
   * @method
   * @private
   *
   * @param {String} elementName
   * @param {Number} positionX
   * @param {Number} positionY
   * @param {Number} scale
   * @param {Number} rotation
   * @memberof Play
   */
  async _addXpIconToWinScreen(elementName, positionX, positionY, scale, rotation) {
    const xp = new Sprite.from('xp');
    this.xp = xp;
    this.xp.anchor.set(0.5);
    this.xp.name = elementName;
    this.xp.x = positionX;
    this.xp.y = positionY;
    this.xp.scale.set(scale);
    this.xp.rotation = rotation;
    this.addChild(this.xp);
  }

  /**
   * Adds restart button to the game
   * 
   * @method
   * @private
   * @memberof Play
   */
  async _addPressSpaceButton() {
    const that = this;
    const restartBtn = new Sprite.from('playAgain');
    this.restartBtn = restartBtn;
    this.restartBtn.x = -16;
    this.restartBtn.y = 217;
    this.restartBtn.interactive = true;
    this.restartBtn.buttonMode = true;
    this.restartBtn.anchor.set(0.5);

    this.restartBtn
      .on('mousedown', function mouseDown() {
        that.restartGame();
      })
      .on('touchstart', function touchStart() {
        that.restartGame();
      });

    document.addEventListener('keydown', function touchStart(key) {
      if (key.code === 'Space' && that.winScreenVisible || key.code === 'Space' && that.loseScreenVisible) {
        that.restartGame();
      }
    });

    this.addChild(this.restartBtn);
  }

  /**
   * Restarts the game
   * 
   * @methods
   * @memberof Play
   */
  restartGame() {
    this._hideWinScreen();
    this._hideLoseScreen();
    this.onCreated();
  }


  /**
   * Periodically plays a "creature in the cave" sound.
   * Loops
   * 
   * @methods
   * @private
   * @memberof Play
   */
  _addBackgroundSounds() {
    Assets.sounds.horrorcaveambience.play();

    setInterval(() => {
      Assets.sounds.createureInTheCave.play();
    }, 30000);
  }
}
