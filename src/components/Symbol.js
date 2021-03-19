import { Sprite, Texture, filters } from 'pixi.js';

export default class Symbol extends Sprite {
  constructor(symbolValue, scaleSize, symbolColor) {
    super();

    this.init(symbolValue, scaleSize, symbolColor);
  }

  init(symbolValue, scaleSize, symbolColor) {
    this.initTextures();

    this.symbol = new Sprite();
    this.symbol.scale.set(scaleSize);
    this.setColor(this.symbol, symbolColor);
    this.setSymbol(symbolValue);
    this.addChild(this.symbol);
  }

  initTextures() {
    this.movesText = new Texture.from('movesText');
    this.textureX = new Texture.from('xSymbol');
    this.textureP = new Texture.from('pSymbol');
    this.textureZero = new Texture.from('zeroDigit');
    this.textureOne = new Texture.from('oneDigit');
    this.textureTwo = new Texture.from('twoDigit');
    this.textureThree = new Texture.from('threeDigit');
    this.textureFour = new Texture.from('fourDigit');
    this.textureFive = new Texture.from('fiveDigit');
    this.textureSix = new Texture.from('sixDigit');
    this.textureSeven = new Texture.from('sevenDigit');
    this.textureEight = new Texture.from('eightDigit');
    this.textureNine = new Texture.from('nineDigit');
  }

  getCorrespondingTexture(symbolValue) {
    let texture;

    switch (symbolValue) {
      case 'movesText':
        texture = this.movesText;
        break;
      case 'x':
        texture = this.textureX;
        break;
      case 'p':
        texture = this.textureP;
        break;
      case '0':
        texture = this.textureZero;
        break;
      case '1':
        texture = this.textureOne;
        break;
      case '2':
        texture = this.textureTwo;
        break;
      case '3':
        texture = this.textureThree;
        break;
      case '4':
        texture = this.textureFour;
        break;
      case '5':
        texture = this.textureFive;
        break;
      case '6':
        texture = this.textureSix;
        break;
      case '7':
        texture = this.textureSeven;
        break;
      case '8':
        texture = this.textureEight;
        break;
      case '9':
        texture = this.textureNine;
        break;
    }

    return texture;
  }

  setSymbol(symbolValue) {
    const texture = this.getCorrespondingTexture(symbolValue);
    this.symbol.texture = texture;
  }

  setColor(sprite, color) {
    const colorMatrix = new filters.ColorMatrixFilter();

    switch (color) {
      case 'bw':
        sprite.filters = [colorMatrix];
        colorMatrix.blackAndWhite();
      // colorMatrix.greyscale(0.4);
    }
  }

}