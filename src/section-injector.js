import parse from '../thirdparty-wrappers/mdast-util-from-markdown';

export default function ({usage}) {
  return ({type, value}, index, parent) => {
    if ('html' === type) {
      if ('<!--consumer-badges start -->' === value) {
        parent.children.splice(index, 0, {type: 'heading', depth: 2, children: [{type: 'text', value: 'Usage'}]});

        return index + 2;
      }

      if ('<!--contribution-badges start -->' === value) {
        parent.children.splice(index, 0, parse(usage));

        return index + 2;
      }

      return undefined;
    }

    return undefined;
  };
}
