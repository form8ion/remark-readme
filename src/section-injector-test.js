import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as parser from '../thirdparty-wrappers/mdast-util-from-markdown';
import getSectionInjector from './section-injector';

suite('section injector', () => {
  let sandbox;
  const index = any.integer({max: 20});

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(parser, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the "Usage" heading is added before the consuemr badge zone', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({});

    assert.equal(
      injectSections({type: 'html', value: '<!--consumer-badges start -->'}, index, {children: childrenOfParent}),
      index + 2
    );
    assert.deepEqual(childrenOfParent[index], {type: 'heading', depth: 2, children: [{type: 'text', value: 'Usage'}]});
  });

  test('that the "Usage" content is added before the contribution badge zone', () => {
    const usage = any.simpleObject();
    const usageContentTree = any.simpleObject();
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({usage});
    parser.default.withArgs(usage).returns(usageContentTree);

    assert.equal(
      injectSections({type: 'html', value: '<!--contribution-badges start -->'}, index, {children: childrenOfParent}),
      index + 2
    );
    assert.deepEqual(childrenOfParent[index], usageContentTree);
  });

  test('that other html nodes are skipped', () => {
    const injectSections = getSectionInjector({});

    assert.isUndefined(injectSections({type: 'html'}, index, {children: []}));
  });

  test('that other nodes are skipped', () => {
    const injectSections = getSectionInjector({});

    assert.isUndefined(injectSections({type: any.word()}, index, {children: []}));
  });
});
