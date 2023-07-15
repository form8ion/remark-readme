import {fromMarkdown as parse} from 'mdast-util-from-markdown';

const TOC_HEADING = 'Table of Contents';
const USAGE_HEADING = 'Usage';
const CONTRIBUTING_HEADING = 'Contributing';

function tocSectionHeadingAlreadyExistsAfter(parent, index) {
  const nextSibling = parent.children[index + 1];

  return 'heading' === nextSibling.type && TOC_HEADING === nextSibling.children[0].value;
}

function headingAlreadyExistsBefore(parent, index) {
  return 'heading' === parent.children[index - 1].type;
}

function injectSectionHeadingBefore(parent, sectionHeading, index) {
  parent.children.splice(index, 0, {type: 'heading', depth: 2, children: [{type: 'text', value: sectionHeading}]});
}

function injectSectionHeadingAndContentAfter(parent, node, sectionHeading, content, index) {
  parent.children.splice(
    index,
    1,
    node,
    {type: 'heading', depth: 2, children: [{type: 'text', value: sectionHeading}]},
    parse(content)
  );
}

export default function ({toc, usage, contributing}) {
  return (node, index, parent) => {
    const {type, value} = node;

    if ('html' === type) {
      if (toc && '<!--status-badges end -->' === value && !tocSectionHeadingAlreadyExistsAfter(parent, index)) {
        injectSectionHeadingAndContentAfter(parent, node, TOC_HEADING, toc, index);

        return index + 3;
      }

      if (usage && '<!--consumer-badges start -->' === value && !headingAlreadyExistsBefore(parent, index)) {
        injectSectionHeadingBefore(parent, USAGE_HEADING, index);

        return index + 2;
      }

      if ('<!--contribution-badges start -->' === value) {
        let incrementCount = 0;

        if (contributing && 'heading' !== parent.children[index - 1].type) {
          injectSectionHeadingBefore(parent, CONTRIBUTING_HEADING, index);

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
