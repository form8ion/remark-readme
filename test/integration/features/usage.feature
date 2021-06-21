Feature: Usage

  Scenario: Initial Usage Definition
    Given the existing README has no "Usage" heading
    And the existing README uses modern badge zones
    And content is provided for the "Usage" section
    When a node is processed
    Then there is a "Usage" heading
    And the "Usage" content is populated

  Scenario: No Usage Definition Provided
    Given the existing README has no "Usage" heading
    And the existing README uses modern badge zones
    When a node is processed
    Then there is no "Usage" heading
