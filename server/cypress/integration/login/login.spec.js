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
    cy.get("input[name='email']")
      .type("nouser@nouser.com", { delay: 100 })
      .should("have.value", "nouser@nouser.com");
    
    cy.get("input[name='password']")
      .type("nouser", { delay: 100 })
      .should("have.value", "nouser");

    cy.get("button")
      .click();
    
    cy.get(".alert-danger")
      .should("contain", "Wrong informations");
  });

  it("Try to connect with a real account.", function() {
    cy.get("input[name='email']")
      .type("vincent.ferrard@epitech.eu", { delay: 100 })
      .should("have.value", "vincent.ferrard@epitech.eu");
    
    cy.get("input[name='password']")
      .type("test", { delay: 100 })
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