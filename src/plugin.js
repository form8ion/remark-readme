import modifyChildren from 'unist-util-modify-children';
import remark from 'remark';

export default function ({usage}) {
  const modify = modifyChildren((node, index, parent) => {
    if ('html' === node.type && '<!--consumer-badges start -->' === node.value) {
      parent.children.splice(
        index,
        0,
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Usage'}]
        }
      );

      return index + 2;
    }

    if ('html' === node.type && '<!--contribution-badges start -->' === node.value) {
      parent.children.splice(index, 0, remark.parse(usage));

      return index + 2;
    }

    return undefined;
  });

  return function transformer(node) {
    if (usage) {
      modify(node);
    }
  };
}
