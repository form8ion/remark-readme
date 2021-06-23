import parse from '../thirdparty-wrappers/mdast-util-from-markdown';

export default function (content) {
  return (start, nodes, end) => [start, {type: 'root', children: [...nodes, parse(content)]}, end];
}
