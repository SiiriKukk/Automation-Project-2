describe("Issue time-tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.get('[data-testid="icon:plus"]').click();
        getIssueCreateModal().within(() => {
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Story"]').click();
          cy.get(".ql-editor").type(issueDescription);
          cy.get('input[name="title"]').type(issueTitle);
          cy.get('[data-testid="select:userIds"]').click();
          cy.get('[data-testid="select-option:Lord Gaben"]').click();
          cy.get('button[type="submit"]').click();
        });
        //Assert that new issue is created and opened
        cy.contains("Issue has been successfully created.").should(
          "be.visible"
        );
        cy.get(backlogList).should("be.visible").contains(issueTitle).click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getIssueCreateModal = () =>
    cy.get('[data-testid="modal:issue-create"]');
  const getTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const backlogList = '[data-testid="board-list:backlog"]';
  const issueTitle = "Time-tracking";
  const issueDescription = "Testing time tracking functionality";
  const closeDetailModalButton = '[data-testid="icon:close"]';
  const timeTracking = '[data-testid="icon:stopwatch"]';

  it("Should add, update and remove estimated time", () => {
    //Add estimated time
    getIssueDetailsModal().within(() => {
      cy.contains("No time logged").should("be.visible");
      cy.get('[placeholder="Number"]').type(10);
      cy.get('[placeholder="Number"]').should("have.value", 10);
      cy.contains("10h estimated").should("be.visible");
      cy.get(closeDetailModalButton).first().click();
    });
    //Assert that estimated time is saved
    cy.get(backlogList).should("be.visible").contains(issueTitle).click();
    cy.get('[placeholder="Number"]').should("have.value", 10);
    cy.contains("10h estimated").should("be.visible");
    //Update estimated time
    cy.get('[placeholder="Number"]').clear().type(20);
    cy.get('[placeholder="Number"]').should("have.value", 20);
    cy.contains("20h estimated").should("be.visible");
    cy.get(closeDetailModalButton).first().click();
    //Assert that updated time is saved
    cy.get(backlogList).should("be.visible").contains(issueTitle).click();
    cy.get('[placeholder="Number"]').should("have.value", 20);
    cy.contains("20h estimated").should("be.visible");
    //Remove estimated time
    cy.get('[placeholder="Number"]').clear();
    cy.contains("No time logged").should("be.visible");
    cy.get(closeDetailModalButton).first().click();
    //Assert that removed time is saved
    cy.get(backlogList).should("be.visible").contains(issueTitle).click();
    cy.contains("No time logged").should("be.visible");
    cy.get('[placeholder="Number"]').should("have.value", "");
  });

  it("Should add and remove logged time", () => {
    //Add estimated time
    getIssueDetailsModal().within(() => {
      cy.contains("No time logged").should("be.visible");
      cy.get('[placeholder="Number"]').type(10);
      cy.get('[placeholder="Number"]').should("have.value", 10);
      cy.contains("10h estimated").should("be.visible");
      //Add logged time
      cy.get(timeTracking).click();
    });
    getTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.get('[placeholder="Number"]').first().type(2);
        cy.get('[placeholder="Number"]').last().type(5);
        cy.contains("button", "Done").click();
      });
    //Assert that logged time is saved and estimated time is not visible
    getTrackingModal().should("not.exist");
    cy.contains("2h logged").should("be.visible");
    cy.contains("5h remaining").should("be.visible");
    cy.contains("No time logged").should("not.exist");
    cy.contains("10h estimated").should("not.exist");
    cy.get(closeDetailModalButton).first().click();
    cy.get(backlogList).should("be.visible").contains(issueTitle).click();
    //Delete logged time
    cy.get(timeTracking).click();
    getTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.get('[placeholder="Number"]').first().clear();
        cy.get('[placeholder="Number"]').last().clear();
        cy.contains("button", "Done").click();
      });
    //Assert that no time is logged
    cy.contains("No time logged").should("be.visible");
    cy.get(closeDetailModalButton).first().click();
    cy.get(backlogList).should("be.visible").contains(issueTitle).click();
    //Assert that estimated time is visible
    cy.contains("No time logged").should("be.visible");
    cy.contains("10h estimated").should("be.visible");
  });
});
