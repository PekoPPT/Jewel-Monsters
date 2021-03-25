import { Sprite, Container } from "pixi.js";
import Symbol from "./Symbol";

export default class Tooltip extends Container {
  constructor() {
    super();
    this.init();
  }

  /**
   * Initializes the Tooltip graphics
   * 
   * @method
   * @memberof Tooltip
   */
  init() {
    this._addTooltip();
  }

  /**
   * Adds the Tooltip background
   * 
   * @method
   * @private
   * @memberof Tooltip
   */
  _addTooltip() {
    const toolTip = new Sprite.from('toolTip');

    toolTip.anchor.set(0.5);
    toolTip.x = 310;
    toolTip.y = 420;

    this._addTooltipText();
    this.addChild(toolTip);
  }

  /**
   * Adds text to the Tooltip
   * 
   * @method
   * @private
   * @memberof Tooltip
   */
  _addTooltipText() {
    const thousandsTooltipDigit = new Symbol('5', 0.18, 'bw');
    this.thousandsTooltipDigit = thousandsTooltipDigit;
    this.thousandsTooltipDigit.x = 282;
    this.thousandsTooltipDigit.y = 410;

    const hundredTooltipDigit = new Symbol('0', 0.18, 'bw');
    this.hundredTooltipDigit = hundredTooltipDigit;
    this.hundredTooltipDigit.x = 292;
    this.hundredTooltipDigit.y = 410;

    const decimalTooltipDigit = new Symbol('0', 0.18, 'bw');
    this.decimalTooltipDigit = decimalTooltipDigit;
    this.decimalTooltipDigit.x = 302;
    this.decimalTooltipDigit.y = 410;

    const singleTooltipDigit = new Symbol('0', 0.18, 'bw');
    this.singleTooltipDigit = singleTooltipDigit;
    this.singleTooltipDigit.x = 312;
    this.singleTooltipDigit.y = 410;

    const xSymbol = new Symbol('x', 0.11, 'bw');
    this.xSymbol = xSymbol;
    this.xSymbol.x = 324;
    this.xSymbol.y = 416;

    const pSymbol = new Symbol('p', 0.11, 'bw');
    this.pSymbol = pSymbol;
    this.pSymbol.x = 331;
    this.pSymbol.y = 416;

    this.toolTipNumber = new Container();

    this.toolTipNumber.addChild(thousandsTooltipDigit);
    this.toolTipNumber.addChild(hundredTooltipDigit);
    this.toolTipNumber.addChild(decimalTooltipDigit);
    this.toolTipNumber.addChild(singleTooltipDigit);
    this.toolTipNumber.addChild(xSymbol);
    this.toolTipNumber.addChild(pSymbol);

    this.toolTipNumber.x = 5;
    this.toolTipNumber.y = 1;
    this.addChild(this.toolTipNumber);
  }
}