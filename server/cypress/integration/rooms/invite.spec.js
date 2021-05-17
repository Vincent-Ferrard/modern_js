/// <reference types="cypress" />

context('Room Invitation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/rooms', {
      onBeforeLoad: function (window) {
          window.localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs");
      }
    });

    cy.get(".rooms > a")
      .last()
      .click();
    
    cy.get(".add-member")
      .click();
  });

  it("Try to add a user that does not exist", function() {
    cy.get("input[name='email']")
      .type("thisuserdoesnotexist@exist.com", { delay: 100 })
      .should("have.value", "thisuserdoesnotexist@exist.com");
    
    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-danger")
      .should("contain", "This user does not exist.");
  });

  it("Try to add a member when I have at least one room shared", function() {
    cy.get("input[name='email']")
      .type("scarlett.johns3@ethereal.email", { delay: 100 })
      .should("have.value", "scarlett.johns3@ethereal.email");
    
    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-success")
      .should("contain", "Scarlett Johns has been added to the room.");
  });

  it("Try to add a member when I have not at least one room shared", function() {
    cy.get("input[name='email']")
      .type("newtest", { delay: 100 })
      .should("have.value", "newtest");
    
    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-success")
      .should("contain", "An invitation has been sent.");
  });
});