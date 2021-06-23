Feature: Contribution

  Scenario: Initial Contributing Definition
    Given the existing README has no "Contributing" heading
    And the existing README uses modern badge zones
    And content is provided for the "Contributing" section
    When a node is processed
    Then there is a "Contributing" heading
    And the "Contributing" content is populated

  Scenario: Initial Contributing Definition with Initial Contributing Definition
    Given the existing README has no "Usage" heading
    And the existing README has no "Contributing" heading
    And the existing README uses modern badge zones
    And content is provided for the "Usage" section
    And content is provided for the "Contributing" section
    When a node is processed
    Then there is a "Usage" heading
    And there is a "Contributing" heading
    And the "Usage" content is populated
    And the "Contributing" content is populated

  Scenario: No Contributing Definition Provided
    Given the existing README has no "Contributing" heading
    And the existing README uses modern badge zones
    When a node is processed
    Then there is no "Contributing" heading

  Scenario: Contributing Definition Provided When Section Already Exists
    Given the existing README has an existing "Contributing" section
    And the existing README uses modern badge zones
    And content is provided for the "Contributing" section
    When a node is processed
    Then there is a "Contributing" heading
    And the "Contributing" content is populated
