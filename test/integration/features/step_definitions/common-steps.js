import {When} from '@cucumber/cucumber';
import remark from 'remark';
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import remarkReadme from '@form8ion/remark-readme';

When('a node is processed', async function () {
  remark()
    .use(remarkReadme)
    .process(this.existingContent, (err, file) => {
      if (err) throw err;

      this.resultingContent = file.contents;
    });
});
