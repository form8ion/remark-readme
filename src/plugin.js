import headingRange from '../thirdparty-wrappers/mdast-util-heading-range';
import modifyChildren from '../thirdparty-wrappers/unist-util-modify-children';
import getSectionInjector from './section-injector';
import getSectionContentInjector from './section-content-injector';

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
