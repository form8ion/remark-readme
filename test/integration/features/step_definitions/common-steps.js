import {When} from '@cucumber/cucumber';
import remark from 'remark';
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import remarkReadme from '@form8ion/remark-readme';

When('a node is processed', async function () {
  const usageContents = this.usage;
  const tocContents = this['table of contents'];

  remark()
    .use(remarkReadme, {usage: usageContents, toc: tocContents})
    .process(this.existingReadmeContent, (err, file) => {
      if (err) throw err;

      this.resultingContent = file.contents;
    });
});
