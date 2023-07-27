describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const comment = 'Testing comments';
    const comment_edited = 'Testing editing';
    
    it.only('Should add, edit and delete a comment successfully', () => {
        getIssueDetailsModal().within(() => {
            //Add comment
            cy.contains('Add a comment...').click();
            cy.get('textarea[placeholder="Add a comment..."]').type(comment);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.contains('Add a comment...').should('be.visible');
            //Assert comment is visible
            cy.get('[data-testid="issue-comment"]').should('contain', comment);

            //Edit comment
            cy.get('[data-testid="issue-comment"]').first().contains('Edit')
                .click().should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', comment).clear().type(comment_edited);
            cy.contains('button', 'Save').click().should('not.exist');
            //Assert edited comment is visible
            cy.get('[data-testid="issue-comment"]').should('contain', comment_edited);

            //Delete comment
            cy.get('[data-testid="issue-comment"]').first().contains('Delete')
                .click();
        });
        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.contains('button', 'Delete comment').click();
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        //Assert deleted comment is not visible
        getIssueDetailsModal().should('be.visible');
        cy.get('[data-testid="issue-comment"]').should('not.contain', comment_edited)
    });
});
