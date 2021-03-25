// / <reference types="Cypress" />

describe('the Jewel Monster game', () => {

  it('should successfully load', () => {
    cy.visit('http://localhost:8080/');
  });

  it('should display the Play scene', () => {
    cy.visit('http://localhost:8080/').then(() => {

      //Shurely not the best solution to use wait but couln't catch an event that loads the Play scene
      cy.wait(1000);
      cy.window().then((window) => {
        if (!window.pixiApp) {
          throw new Error('Pixi Application not attached to window.');
        } else {
          cy.wrap({ visible: window.pixiApp.children[1].children[0].visible }).its('visible').should('eq', true);
        }
      });

    });
  });

});