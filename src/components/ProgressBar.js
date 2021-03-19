import { Container, Sprite } from "pixi.js";
import Symbol from "./Symbol";
import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import Tooltip from "./Tooltip";

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
    const currentScoreContainer = new Container();
    currentScoreContainer.x = -60;
    currentScoreContainer.y = 360;

    const thousandsScoreDigit = new Symbol(5, 0.35, '');
    this.thousandsScoreDigit = thousandsScoreDigit;

    const hundredsScoreDigit = new Symbol(0, 0.35, '');
    this.hundredsScoreDigit = hundredsScoreDigit;
    this.hundredsScoreDigit.x = 18;

    const decimalsScoreDigit = new Symbol(0, 0.35, '');
    this.decimalsScoreDigit = decimalsScoreDigit;
    this.decimalsScoreDigit.x = 36;

    const singlesScoreDigit = new Symbol(0, 0.35, '');
    this.singlesScoreDigit = singlesScoreDigit;
    this.singlesScoreDigit.x = 54;

    const xSymbolScoreBar = new Symbol('x', 0.24, '');
    this.xSymbolScoreBar = xSymbolScoreBar;
    this.xSymbolScoreBar.x = 76;
    this.xSymbolScoreBar.y = 9;

    const pSymbolScoreBar = new Symbol('p', 0.24, '');
    this.pSymbolScoreBar = pSymbolScoreBar;
    this.pSymbolScoreBar.x = 90;
    this.pSymbolScoreBar.y = 9;

    currentScoreContainer.addChild(this.thousandsScoreDigit);
    currentScoreContainer.addChild(this.hundredsScoreDigit);
    currentScoreContainer.addChild(this.decimalsScoreDigit);
    currentScoreContainer.addChild(this.singlesScoreDigit);
    currentScoreContainer.addChild(this.xSymbolScoreBar);
    currentScoreContainer.addChild(this.pSymbolScoreBar);
    this.addChild(currentScoreContainer);
  }


  changeScore(value) {
    console.log(value);
    this._currentScore += value;
    const currentScoreElements = this._currentScore.toString().split('');

    if (currentScoreElements.length === 4) {
      this.thousandsScoreDigit.setSymbol(currentScoreElements[0]);
      this.hundredsScoreDigit.setSymbol(currentScoreElements[1]);
      this.decimalsScoreDigit.setSymbol(currentScoreElements[2]);
      this.singlesScoreDigit.setSymbol(currentScoreElements[3]);
    } else if (currentScoreElements.length === 3) {
      this.thousandsScoreDigit.setSymbol('0');
      this.hundredsScoreDigit.setSymbol(currentScoreElements[0]);
      this.decimalsScoreDigit.setSymbol(currentScoreElements[1]);
      this.singlesScoreDigit.setSymbol(currentScoreElements[2]);
    } else if (currentScoreElements.length === 2) {
      this.thousandsScoreDigit.setSymbol('0');
      this.hundredsScoreDigit.setSymbol('0');
      this.decimalsScoreDigit.setSymbol(currentScoreElements[0]);
      this.singlesScoreDigit.setSymbol(currentScoreElements[1]);
    } else if (currentScoreElements.length === 1) {
      this.thousandsScoreDigit.setSymbol('0');
      this.hundredsScoreDigit.setSymbol('0');
      this.decimalsScoreDigit.setSymbol('0');
      this.singlesScoreDigit.setSymbol(currentScoreElements[0]);
    }
    this.set();
    if (this._currentScore >= 500) {
      this.emit(ProgressBar.events.GAME_WON);
    }
  }

  static get events() {
    return {
      GAME_WON: 'game_won',
    };
  }
}