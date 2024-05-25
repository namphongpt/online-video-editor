Feature: Creating a project (US-01)
  Scenario: Successful creation flow
    Given the user is authenticated
    And the user is on the project overview page
    When the user opens the 'Project aanmaken' modal
    And the user enters the project title 'A Test Project'
    And the user submits the form
    Then the user is on the page of the project titled 'A Test Project'

  Scenario: an empty title
    Given the user is authenticated
    And the user is on the project overview page
    When the user opens the 'Project aanmaken' modal
    And the user enters the project title ''
    And the user submits the form
    Then the user sees the text 'De titel is verplicht.'
