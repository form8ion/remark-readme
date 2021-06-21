import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import * as childrenModifier from '../thirdparty-wrappers/unist-util-modify-children';
import * as sectionInjector from './section-injector';
import plugin from './plugin';

suite('plugin', () => {
  let sandbox, node;
  const injector = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(sectionInjector, 'default');
    sandbox.stub(childrenModifier, 'default');

    node = {...any.simpleObject(), children: []};
  });

  teardown(() => sandbox.restore());

  test('that the "Usage" section header is injected when not present', () => {
    const documentation = {usage: any.sentence()};
    const modifier = sinon.spy();
    sectionInjector.default.withArgs(documentation).returns(injector);
    childrenModifier.default.withArgs(injector).returns(modifier);

    plugin(documentation)(node);

    assert.calledWith(modifier, node);
  });

  test('that the document is not updated when no usage content is provided', () => {
    const documentation = {};
    const modifier = sinon.spy();
    sectionInjector.default.withArgs(documentation).returns(injector);
    childrenModifier.default.withArgs(injector).returns(modifier);

    plugin(documentation)(node);

    assert.notCalled(modifier);
  });
});
