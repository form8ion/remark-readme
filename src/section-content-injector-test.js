import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as parser from '../thirdparty-wrappers/mdast-util-from-markdown';
import sectionContentInjectorFactory from './section-content-injector';

suite('section content injector', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(parser, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the content is appended to the section range', () => {
    const content = any.sentence();
    const start = any.simpleObject();
    const nodes = any.listOf(any.simpleObject);
    const end = any.simpleObject();
    const contentTree = any.simpleObject();
    parser.default.withArgs(content).returns(contentTree);

    assert.deepEqual(
      sectionContentInjectorFactory(content)(start, nodes, end),
      [start, {type: 'root', children: [...nodes, contentTree]}, end]
    );
  });
});
