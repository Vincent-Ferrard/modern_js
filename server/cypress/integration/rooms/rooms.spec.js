/// <reference types="cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/rooms', {
      onBeforeLoad: function (window) {
          window.localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs");
      }
    });
  });

  it("Check page is load", function() {
    cy.get(".sidebar").should("exist");
  });
});