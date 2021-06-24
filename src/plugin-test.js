import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import * as childrenModifier from '../thirdparty-wrappers/unist-util-modify-children';
import * as headingRange from '../thirdparty-wrappers/mdast-util-heading-range';
import * as sectionInjector from './section-injector';
import * as sectionContentInjector from './section-content-injector';
import plugin from './plugin';

suite('plugin', () => {
  let sandbox, node;
  const injector = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(sectionInjector, 'default');
    sandbox.stub(sectionContentInjector, 'default');
    sandbox.stub(childrenModifier, 'default');
    sandbox.stub(headingRange, 'default');

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
    assert.notCalled(headingRange.default);
  });

  test('that the "Table of Contents" section header is injected when not present', () => {
    const documentation = {toc: any.sentence()};
    const modifier = sinon.spy();
    sectionInjector.default.withArgs(documentation).returns(injector);
    childrenModifier.default.withArgs(injector).returns(modifier);

    plugin(documentation)(node);

    assert.calledWith(modifier, node);
    assert.notCalled(headingRange.default);
  });

  test('that the "Contributing" section header is injected when not present', () => {
    const contributingContent = any.sentence();
    const documentation = {contributing: contributingContent};
    const modifier = sinon.spy();
    const contentInjector = sinon.spy();
    sectionInjector.default.withArgs(documentation).returns(injector);
    sectionContentInjector.default.withArgs(contributingContent).returns(contentInjector);
    childrenModifier.default.withArgs(injector).returns(modifier);

    plugin(documentation)(node);

    assert.calledWith(modifier, node);
    assert.calledWith(
      headingRange.default,
      node,
      {test: 'Contributing', ignoreFinalDefinitions: true},
      contentInjector
    );
  });

  test('that the document is not updated when no usage or toc content is provided', () => {
    const documentation = {};
    const modifier = sinon.spy();
    sectionInjector.default.withArgs(documentation).returns(injector);
    childrenModifier.default.withArgs(injector).returns(modifier);

    plugin(documentation)(node);

    assert.notCalled(modifier);
  });
});
