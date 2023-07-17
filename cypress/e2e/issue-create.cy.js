import { faker } from '@faker-js/faker';
describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      
      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
          .trigger('click');
            
      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      
      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Test 1 - Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
            
      //Type value to description input field
      cy.get('.ql-editor').type('My bug description');

      //Type value to title input field
      cy.get('input[name="title"]').type('Bug');

      //open issue type dropdown and choose Bug
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
          .trigger('click');

      //Select priority
      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Highest"]')
          .trigger('click');
      
      //Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      //assert all values are correctly visible
      cy.get('input[name="title"]').should('have.value', 'Bug');
      cy.get('.ql-editor').should('have.text', 'My bug description');
      cy.get('[data-testid="select:type"]').should('have.text', 'Bug');
      cy.get('[data-testid="select:reporterId"]').should('have.text', 'Pickle Rick');
      cy.get('[data-testid="select:priority"]').should('have.text', 'Highest');

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Bug');
      //Assert that correct type icon is visible
      cy.get('[data-testid="icon:bug"]').should('be.visible');
    });
  });

  const randomDescription = faker.lorem.words(5)
  const randomTitle = faker.lorem.word()
  it('Test 2 - Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
            
      //Type value to description input field
      cy.get('.ql-editor').type(randomDescription);

      //Type value to title input field
      cy.get('input[name="title"]').type(randomTitle);

      //open issue type dropdown and check that Task icon is visible and selected
      cy.get('[data-testid="select:type"]').click()
      cy.get('[data-testid="icon:task"]').should('be.visible');

      //Select priority
      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Low"]')
          .trigger('click');
      
      //Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      //assert all values are correctly visible
      cy.get('input[name="title"]').should('have.value', randomTitle);
      cy.get('.ql-editor').should('have.text', randomDescription);
      cy.get('[data-testid="select:type"]').should('have.text', 'Task');
      cy.get('[data-testid="select:reporterId"]').should('have.text', 'Baby Yoda');
      cy.get('[data-testid="select:priority"]').should('have.text', 'Low');

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(randomTitle);
      //Assert that correct type icon is visible
      cy.get('[data-testid="icon:task"]').first().should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});
