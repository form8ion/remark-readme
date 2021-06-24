Feature: Table of Contents

  Scenario: Initial TOC Definition
    Given the existing README has no "Table of Contents" heading
    And the existing README uses modern badge zones
    And content is provided for the "Table of Contents" section
    When a node is processed
    Then there is a "Table of Contents" heading
    And the "Table of Contents" content is populated

  Scenario: Initial TOC Definition with existing Usage Section
    Given the existing README has no "Table of Contents" heading
    And the existing README has an existing "Usage" section
    And the existing README uses modern badge zones
    And content is provided for the "Table of Contents" section
    When a node is processed
    Then there is a "Table of Contents" heading
    And the "Table of Contents" content is populated

  Scenario: No TOC Definition Provided
    Given the existing README has no "Table of Contents" heading
    And the existing README uses modern badge zones
    When a node is processed
    Then there is no "Table of Contents" heading

  Scenario: TOC Definition Provided When Section Already Exists
    Given the existing README has an existing "Table of Contents" section
    And the existing README uses modern badge zones
    And content is provided for the "Table of Contents" section
    When a node is processed
    Then there is a "Table of Contents" heading
    And the "Table of Contents" content is unchanged
