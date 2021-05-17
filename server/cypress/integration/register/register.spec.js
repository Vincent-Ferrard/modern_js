/// <reference types="cypress" />

context('Register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/register')
    });

    it("Try to register without informations.", function() {
        cy.get("button")
          .click();
        
        cy.get(".alert-danger")
          .should("contain", "Wrong informations");
    });

    it("Registers a user", function() {
        cy.get("input[name='email']")
          .type("hello@hello.com", { delay: 100 })
          .should("have.value", "hello@hello.com");
        
        cy.get("input[name='name']")
          .type("hello", { delay: 100 })
          .should("have.value", "hello");

        cy.get("input[name='password']")
          .type("hello", { delay: 100 })
          .should("have.value", "hello");

        cy.get("button")
          .click();
        
        cy.get(".alert-success")
          .should("contain", "Confirmation email sent");
    });
});