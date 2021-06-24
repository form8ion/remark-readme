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

${this['table of contents-heading']
    ? `## ${this['table of contents-heading']}\n\n${this['table of contents-existing-content']}\n\n`
    : ''}
${this['usage-heading'] ? `## ${this['usage-heading']}\n\n` : ''}<!--consumer-badges start -->
<!--consumer-badges end -->

${this['contributing-heading'] ? `## ${this['contributing-heading']}\n\n` : ''}<!--contribution-badges start -->
<!--contribution-badges end -->

${this.badgeDefinitions.join('\n\n')}`;
});
