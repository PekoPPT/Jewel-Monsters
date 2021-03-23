import { Container, Sprite } from "pixi.js";
import Symbol from "./Symbol";
import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import Tooltip from "./Tooltip";
import XP from "./XP";

gsap.registerPlugin(PixiPlugin);
export default class ProgressBar extends Container {
  constructor() {
    super();

    this._max = 5000;
    this._value = 400;
    this._currentScore = 0;
    this.init();
  }

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

  _fulfillScoreBar() {

  }

  set() {

    if (!this._barBegining.visible && !this._barEnding.visible && !this._bar.visible) {
      this._barBegining.visible = true;
      this._bar.visible = true;
      this._barEnding.visible = true;
    }

    this._value = this._currentScore;

    if (this._barBegining.width + this._bar.width + this._barEnding.width < 570) {
      gsap.to(this._bar, { pixi: { width: this.scoreBase.width * this._value / this._max } });
      gsap.to(this._barEnding, { pixi: { x: this.scoreBase.width * this._value / this._max - 305 } });
    }
    else {
      gsap.to(this._bar, { pixi: { width: 547 } });
      gsap.to(this._barEnding, { pixi: { x: 547 - 305 } });
    }
  }

  _createBar() {
    this._barBegining = new Sprite.from('loadingLeft');
    this._barBegining.x = -332;
    this._barBegining.y = 405;
    this._barBegining.visible = false;
    this.addChild(this._barBegining);


    this._bar = new Sprite.from('loadingMiddle');
    // this._bar.beginFill(0x000000);
    // this._bar.drawRect(0, 0, this._width, 25);
    // this._bar.endFill();
    // this._bar.alpha = 0.1;
    this._bar.x = -305;
    this._bar.y = 405;
    this._bar.width = 1;
    this._bar.visible = false;
    // this._bar.height = 47;
    // gsap.to(this._bar, { pixi: { width: this.scoreBase.width * this._value / this._max } });
    this.addChild(this._bar);

    this._barEnding = new Sprite.from('loadingRight');
    this._barEnding.x = -305;
    this._barEnding.y = 405;
    this._barEnding.visible = false;
    this.addChild(this._barEnding);
  }

  /**
   * Defines the Symbol elements that will be displayed as part of the user's score.
   * The Symbols defined below appear above the Pogressbar
   *
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


  changeScore(value) {
    this._currentScore += value;
    this._currentScoreContainer.defineXP(this._currentScore);

    this.set();
    if (this._currentScore >= 5000) {
      this.emit(ProgressBar.events.GAME_WON);
    }
  }

  static get events() {
    return {
      GAME_WON: 'game_won',
    };
  }
}