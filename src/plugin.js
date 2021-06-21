import modifyChildren from '../thirdparty-wrappers/unist-util-modify-children';
import getSectionInjector from './section-injector';

export default function (documentation) {
  const modify = modifyChildren(getSectionInjector(documentation));

  return function transformer(node) {
    if (documentation.usage) {
      modify(node);
    }
  };
}
