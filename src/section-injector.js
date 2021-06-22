import parse from '../thirdparty-wrappers/mdast-util-from-markdown';

export default function ({toc, usage, contributing}) {
  return (node, index, parent) => {
    const {type, value} = node;

    if ('html' === type) {
      if (toc && '<!--status-badges end -->' === value) {
        parent.children.splice(
          index,
          1,
          node,
          {type: 'heading', depth: 2, children: [{type: 'text', value: 'Table of Contents'}]},
          parse(toc)
        );

        return index + 3;
      }

      if (usage && '<!--consumer-badges start -->' === value) {
        parent.children.splice(index, 0, {type: 'heading', depth: 2, children: [{type: 'text', value: 'Usage'}]});

        return index + 2;
      }

      if ('<!--contribution-badges start -->' === value) {
        let incrementCount = 0;

        if (contributing) {
          parent.children.splice(
            index,
            0,
            {type: 'heading', depth: 2, children: [{type: 'text', value: 'Contributing'}]}
          );

          incrementCount += 2;
        }

        if (usage) {
          parent.children.splice(index, 0, parse(usage));

          incrementCount += 2;
        }

        if (incrementCount) return index + incrementCount;
      }
    }

    return undefined;
  };
}
