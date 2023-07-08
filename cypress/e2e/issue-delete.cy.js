describe('Issue deleting', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.get('[data-testid="board-list:backlog"]').children().should('have.length',4)
        cy.get('[data-testid="board-list:backlog"]').eq(0).contains('This is an issue of type: Task.').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  let IssueTitle = 'This is an issue of type: Task.'

    it('Should delete the first issue successfully', () => {
    getIssueDetailsModal()
        .get('[data-testid="icon:trash"]')
        .click();
    //Assert that confirmation modal is visible and delete button active
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete issue').click();
    //Assert that confirmation modal is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    //Assert that issue is deleted
    cy.get('[data-testid="board-list:backlog"]').children().should('have.length',3);
    cy.get('[data-testid="board-list:backlog"]').should('not.contain', IssueTitle);
    });

    it('Should cancel the deletion process of first issue successfully', () => {
        getIssueDetailsModal()
            .get('[data-testid="icon:trash"]')
            .click();
        //Assert that confirmation modal is visible, cancel button active
        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.get('[data-testid="modal:confirm"]').contains('button', 'Cancel').click();
        //Assert that confirmation modal is not visible
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        //Assert that issue is not deleted and seen on the board
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="board-list:backlog"]').children().should('have.length',4);
        cy.get('[data-testid="board-list:backlog"]').contains(IssueTitle);
        });
  });
  