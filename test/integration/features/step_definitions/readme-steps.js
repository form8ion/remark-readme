import {Before, Given} from '@cucumber/cucumber';
import any from '@travi/any';

Before(function () {
  this.projectDescription = any.sentence();
  this.badgeDefinitions = [`[${any.word}]: ${any.url()}

[${any.word()}]: ${any.url()}`];
});

Given('the existing README uses modern badge zones', async function () {
  this.existingReadmeContent = `# project-name

${this.projectDescription}

<!--status-badges start -->
<!--status-badges end -->

1. item 1
1. item 2

${this['usage-heading'] ? `## ${this['usage-heading']}\n\n` : ''}<!--consumer-badges start -->
<!--consumer-badges end -->

<!--contribution-badges start -->
<!--contribution-badges end -->

${this.badgeDefinitions.join('\n\n')}`;
});
