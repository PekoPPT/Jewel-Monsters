import { Container } from "pixi.js";
import Symbol from "./Symbol";

export default class XP extends Container {
  constructor(XPGained = 0) {
    super();
    this._addXPContainer();
    this.defineXP(XPGained);
  }

  _addXPContainer() {
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

    this.addChild(this.thousandsScoreDigit);
    this.addChild(this.hundredsScoreDigit);
    this.addChild(this.decimalsScoreDigit);
    this.addChild(this.singlesScoreDigit);
    this.addChild(this.xSymbolScoreBar);
    this.addChild(this.pSymbolScoreBar);
  }

  defineXP(value) {
    this._value = value;
    const currentXPElements = this._value.toString().split('');

    if (currentXPElements.length === 4) {
      this.thousandsScoreDigit.setSymbol(currentXPElements[0]);
      this.hundredsScoreDigit.setSymbol(currentXPElements[1]);
      this.decimalsScoreDigit.setSymbol(currentXPElements[2]);
      this.singlesScoreDigit.setSymbol(currentXPElements[3]);
    } else if (currentXPElements.length === 3) {

      // Below line can be uncommented if the users can gain a 4 digits XP
      // this.thousandsScoreDigit.setSymbol('0');

      this.hundredsScoreDigit.setSymbol(currentXPElements[0]);
      this.decimalsScoreDigit.setSymbol(currentXPElements[1]);
      this.singlesScoreDigit.setSymbol(currentXPElements[2]);
    } else if (currentXPElements.length === 2) {
      this.thousandsScoreDigit.setSymbol('0');
      this.hundredsScoreDigit.setSymbol('0');
      this.decimalsScoreDigit.setSymbol(currentXPElements[0]);
      this.singlesScoreDigit.setSymbol(currentXPElements[1]);
    } else if (currentXPElements.length === 1) {
      this.thousandsScoreDigit.setSymbol('0');
      this.hundredsScoreDigit.setSymbol('0');
      this.decimalsScoreDigit.setSymbol('0');
      this.singlesScoreDigit.setSymbol(currentXPElements[0]);
    }
  }
}