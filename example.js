// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {promises as fs} from 'node:fs';
import {remark} from 'remark';
import updateReadme from './lib/index.js';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

// remark-usage-ignore-next
(async () => {
  const file = await remark()
    .use(
      updateReadme,
      {
        usage: 'information about using the project'
      }
    )
    .process(
      `# project-name

Description of the project

<!--status-badges start -->
<!--status-badges end -->

<!--consumer-badges start -->
<!--consumer-badges end -->

<!--contribution-badges start -->
<!--contribution-badges end -->
`
    );

  await fs.writeFile(`${process.cwd()}/README.md`, `${file}`);
  // remark-usage-ignore-next 2
  stubbedFs.restore();
})();
