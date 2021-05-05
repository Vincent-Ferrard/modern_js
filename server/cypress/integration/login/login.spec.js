/// <reference types="cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  });

  it("Verify that user is not already authenticated.", function() {
    expect(localStorage.getItem("token")).to.be.null;
  });

  it("Try to connect without informations.", function() {
    cy.get("button")
      .click();
    
    cy.get(".alert-danger")
      .should("contain", "Wrong informations");
  });

  it("Try to connect with a false account.", function() {
    cy.get("input[name='email']", { delay: 100 })
      .type("hello@hello.com")
      .should("have.value", "hello@hello.com");
    
    cy.get("input[name='password']", { delay: 100 })
      .type("hello")
      .should("have.value", "hello");

    cy.get("button")
      .click();
    
    cy.get(".alert-danger")
      .should("contain", "Wrong informations");
  });

  it("Try to connect with a real account.", function() {
    cy.get("input[name='email']", { delay: 100 })
      .type("vincent.ferrard@epitech.eu")
      .should("have.value", "vincent.ferrard@epitech.eu");
    
    cy.get("input[name='password']", { delay: 100 })
      .type("test")
      .should("have.value", "test");

    cy.get("button")
      .click()
      .should(() => {
        expect(localStorage.getItem('token')).to.be.not.null;
      });
    
    cy.get(".alert-success")
      .should("contain", "Login successful");
    
    cy.url().should("include", "rooms", ()=> {
      expect(localStorage.getItem("token")).to.exist;
    })
  });
});