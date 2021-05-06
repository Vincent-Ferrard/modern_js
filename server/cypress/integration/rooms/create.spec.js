/// <reference types="cypress" />

context('Rooms', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/rooms', {
      onBeforeLoad: function (window) {
          window.localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs");
      }
    });
  });

  it("Try to create a new room", function() {
    cy.get(".create-room")
      .first()
      .click();

    const name = generate_random_string(6);

    cy.get("input[name='name']")
      .type(name, { delay: 100 })
      .should("have.value", name);
    
    cy.get("button[type='submit']")
      .click();

    cy.get('button')
      .first()
      .click();
    
    cy.get(".rooms > a")
      .last()
      .should("contain", name);
  });
});

function generate_random_string(string_length) {
  let random_string = '';
  let random_ascii;
  for(let i = 0; i < string_length; i++) {
      random_ascii = Math.floor((Math.random() * 25) + 97);
      random_string += String.fromCharCode(random_ascii)
  }
  return random_string
}