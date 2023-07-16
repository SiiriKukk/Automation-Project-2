describe('Issue deleting', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.get('[data-testid="board-list:backlog"]').children().should('have.length',4);
        cy.contains(issueTitle).click();
        //Assert that iddue detail modal is visible
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const issueTitle = 'This is an issue of type: Task.';

    it('Should delete the first issue successfully', () => {
    getIssueDetailsModal().get('[data-testid="icon:trash"]').click();
    //Assert that confirmation modal is visible and delete button active
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete issue').click();
    //Assert that confirmation modal and issue details modal is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    getIssueDetailsModal().should('not.exist');
    //Assert that issue is deleted
    cy.get('[data-testid="board-list:backlog"]').should('be.visible');
    cy.reload();
    cy.get('[data-testid="board-list:backlog"]').children().should('have.length',3);
    cy.get('[data-testid="board-list:backlog"]').should('not.contain', issueTitle);
    });

    it('Should cancel the deletion process of first issue successfully', () => {
        getIssueDetailsModal().get('[data-testid="icon:trash"]').click();
        //Assert that confirmation modal is visible, cancel button active
        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.get('[data-testid="modal:confirm"]').contains('button', 'Cancel').click();
        //Assert that confirmation modal is not visible
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        //Assert that issue details modal is visible
        getIssueDetailsModal().should('be.visible');
        //Assert that issue is not deleted and seen on the board
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="board-list:backlog"]').should('be.visible');
        cy.reload();
        cy.get('[data-testid="board-list:backlog"]').children().should('have.length',4);
        cy.get('[data-testid="board-list:backlog"]').contains(issueTitle);
        });
  });
  