import { Container, Sprite } from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
import Tooltip from './Tooltip';
import XP from './XP';

gsap.registerPlugin(PixiPlugin);
export default class ProgressBar extends Container {
  constructor() {
    super();

    this._max = 5000;
    this._value = 400;
    this._currentScore = 0;
    this.init();
  }

  /**
   * Initizlies the ProgressBar panel and all its elements - Current score and tag 
   * 
   * @method
   * @memberof ProgressBar
   */
  init() {
    this.toolTip = new Tooltip();
    this.toolTip.x = 10;
    this.toolTip.y = 3;
    this._addScoreBase();
    this._addCurrenScoreText();
    this._createBar();
    this.changeScore(0);
    this.addChild(this.toolTip);
  }

  /**
   * Add the base of the Scorebar 
   * 
   * @method
   * @private
   * @memberof ProgressBar
   */
  _addScoreBase() {
    const scoreBase = new Sprite.from('scoreBase');
    this.scoreBase = scoreBase;
    this.scoreBase.anchor.set(0.5);
    this.scoreBase.x = -30;
    this.scoreBase.y = 425;
    this.addChild(this.scoreBase);
  }

  /**
   * Controls the visual representation of the gained score in Progressbar
   * 
   * @method
   * @private
   * @memberof ProgressBar
   */
  _setProgressBarProgress() {

    if (!this._barBegining.visible && !this._barEnding.visible && !this._bar.visible) {
      this._barBegining.visible = true;
      this._bar.visible = true;
      this._barEnding.visible = true;
    }

    this._value = this._currentScore;

    if (this._barBegining.width + this._bar.width + this._barEnding.width < 570) {
      gsap.to(this._bar, { pixi: { width: this.scoreBase.width * this._value / this._max } });
      gsap.to(this._barEnding, { pixi: { x: this.scoreBase.width * this._value / this._max - 305 } });
    } else {
      gsap.to(this._bar, { pixi: { width: 547 } });
      gsap.to(this._barEnding, { pixi: { x: 547 - 305 } });
    }
  }

  /**
   * Creates filling of the score ProgressBar
   * 
   * @method
   * @private
   * @memberof ProgressBar
   */
  _createBar() {
    this._barBegining = new Sprite.from('loadingLeft');
    this._barBegining.x = -332;
    this._barBegining.y = 405;
    this._barBegining.visible = false;
    this.addChild(this._barBegining);

    this._bar = new Sprite.from('loadingMiddle');
    this._bar.x = -305;
    this._bar.y = 405;
    this._bar.width = 1;
    this._bar.visible = false;
    this.addChild(this._bar);

    this._barEnding = new Sprite.from('loadingRight');
    this._barEnding.x = -305;
    this._barEnding.y = 405;
    this._barEnding.visible = false;
    this.addChild(this._barEnding);
  }

  /**
   * Defines the score that will be displayed above the Progressbar.
   *
   * @method
   * @private
   * @memberof ProgressBar
   */
  _addCurrenScoreText() {
    const currentScoreContainer = new XP();
    this._currentScoreContainer = currentScoreContainer;

    this._currentScoreContainer.x = -60;
    this._currentScoreContainer.y = 363;
    this._currentScoreContainer.scale.set(0.92);
    this.addChild(this._currentScoreContainer);
  }

  /**
   * Changes the score displayed above the ProgressBar
   *
   * @param {Number} value - The new score gained by the user 
   * @memberof ProgressBar
   */
  changeScore(value) {
    this._currentScore += value;
    this._currentScoreContainer.defineXP(this._currentScore);

    this._setProgressBarProgress();
    if (this._currentScore >= 5000) {
      this.emit(ProgressBar.events.GAME_WON);
    }
  }

  /**
   * Defines the events triggered by the ProgressBar 
   *
   * @readonly
   * @static
   * @memberof ProgressBar
   */
  static get events() {
    return {
      GAME_WON: 'game_won',
    };
  }
}