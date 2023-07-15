import {headingRange} from 'mdast-util-heading-range';
import {modifyChildren} from 'unist-util-modify-children';

import getSectionInjector from './section-injector.js';
import getSectionContentInjector from './section-content-injector.js';

export default function (documentation) {
  const {toc, usage, contributing} = documentation;
  const modify = modifyChildren(getSectionInjector(documentation));

  return function transformer(node) {
    if (toc || usage || contributing) {
      modify(node);
    }

    if (contributing) {
      headingRange(node, {test: 'Contributing', ignoreFinalDefinitions: true}, getSectionContentInjector(contributing));
    }
  };
}
