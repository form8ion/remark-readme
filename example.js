// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import fs from 'fs';
import remark from 'remark';
import updateReadme from './lib/index';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

remark()
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
`,
    (err, file) => {
      fs.writeFileSync(`${process.cwd()}/README.md`, file.contents);
    }
  );

// remark-usage-ignore-next
stubbedFs.restore();
