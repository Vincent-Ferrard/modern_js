/// <reference types="cypress" />

context('Room', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/rooms', {
      onBeforeLoad: function (window) {
          window.localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs");
      }
    });
    cy.get(".rooms > a")
      .last()
      .click();
  });

  it("Try to send a message", function() {
    cy.get("#input-form")
      .type("new cypress", {delay: 100})
      .should("have.value", "new cypress");
    
    cy.get("#input-form")
      .type("{enter}", {delay: 100})
      .should("have.value", "");
  });

  it("Try to receive a message", function() {
    cy.get(".message-content")
      .last()
      .should("contain", "new cypress")
  });

  // it("Try to promote a user to owner", function() {
  //   cy.get(".members")
  //     .last()
  //     .click();
    
  //   cy.get(".promote")
  //     .last()
  //     .click();
    
  //   cy.get(".alert-success")
  //     .should("contain", "The user has been promoted");
  // });
});