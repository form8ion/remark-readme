import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as parser from '../thirdparty-wrappers/mdast-util-from-markdown';
import getSectionInjector from './section-injector';

suite('section injector', () => {
  let sandbox;
  const index = any.integer({min: 5, max: 20});
  const toc = any.simpleObject();
  const usage = any.simpleObject();
  const contributing = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(parser, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the "Table of Contents" heading and content are added after the status badge zone', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index + 2, max: index + 20});
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({toc});
    parser.default.withArgs(toc).returns(tocContentTree);

    assert.equal(injectSections(node, index, {children: childrenOfParent}), index + 3);
    assert.deepEqual(childrenOfParent[index], node);
    assert.deepEqual(
      childrenOfParent[index + 1],
      {type: 'heading', depth: 2, children: [{type: 'text', value: 'Table of Contents'}]}
    );
    assert.deepEqual(childrenOfParent[index + 2], tocContentTree);
  });

  test('that the "Table of Contents" heading is not added if it already exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index + 1}),
      {type: 'heading', children: [{value: 'Table of Contents'}]},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({toc});
    parser.default.withArgs(toc).returns(tocContentTree);

    assert.isUndefined(injectSections(node, index, {children: childrenOfParent}));
  });

  test('that the "Table of Contents" heading and content are added when the "Usage" section exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index + 1}),
      {type: 'heading', children: [{value: 'Usage'}]},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({toc});
    parser.default.withArgs(toc).returns(tocContentTree);

    assert.equal(injectSections(node, index, {children: childrenOfParent}), index + 3);
    assert.deepEqual(childrenOfParent[index], node);
    assert.deepEqual(
      childrenOfParent[index + 1],
      {type: 'heading', depth: 2, children: [{type: 'text', value: 'Table of Contents'}]}
    );
    assert.deepEqual(childrenOfParent[index + 2], tocContentTree);
  });

  test('that the "Table of Contents" heading is not added if content is not provided', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({});
    parser.default.withArgs(toc).returns(tocContentTree);

    assert.isUndefined(injectSections(node, index, {children: childrenOfParent}));
  });

  test('that the "Usage" heading is added before the consumer badge zone', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({usage});

    assert.equal(
      injectSections({type: 'html', value: '<!--consumer-badges start -->'}, index, {children: childrenOfParent}),
      index + 2
    );
    assert.deepEqual(childrenOfParent[index], {type: 'heading', depth: 2, children: [{type: 'text', value: 'Usage'}]});
  });

  test('that the "Usage" heading is not added if content is not defined', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({});

    assert.isUndefined(injectSections(
      {type: 'html', value: '<!--consumer-badges start -->'},
      index,
      {children: childrenOfParent}
    ));
  });

  test('that the "Usage" heading is not added if it already exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index - 1}),
      {type: 'heading'},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const injectSections = getSectionInjector({usage});

    assert.isUndefined(injectSections(
      {type: 'html', value: '<!--consumer-badges start -->'},
      index,
      {children: childrenOfParent}
    ));
  });

  test('that the "Usage" content is added before the contribution badge zone', () => {
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

  test('that the "Usage" content is not added if content is not defined', () => {
    const usageContentTree = any.simpleObject();
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({});
    parser.default.withArgs(usage).returns(usageContentTree);

    assert.isUndefined(injectSections(
      {type: 'html', value: '<!--contribution-badges start -->'},
      index,
      {children: childrenOfParent}
    ));
  });

  test('that the "Contributing" heading is added before the consumer badge zone', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({contributing});

    assert.equal(
      injectSections({type: 'html', value: '<!--contribution-badges start -->'}, index, {children: childrenOfParent}),
      index + 2
    );
    assert.deepEqual(
      childrenOfParent[index],
      {type: 'heading', depth: 2, children: [{type: 'text', value: 'Contributing'}]}
    );
  });

  test('that the "Contributing" heading is not added if it already exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index - 1}),
      {type: 'heading'},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const injectSections = getSectionInjector({contributing});

    assert.isUndefined(injectSections(
      {type: 'html', value: '<!--contribution-badges start -->'},
      index,
      {children: childrenOfParent}
    ));
  });

  test('that the "Contributing" heading is not added if content is not defined', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({});

    assert.isUndefined(injectSections(
      {type: 'html', value: '<!--contribution-badges start -->'},
      index,
      {children: childrenOfParent}
    ));
  });

  test('that "Usage" content & "Contributing" heading are added in the proper locations when both are provided', () => {
    const usageContentTree = any.simpleObject();
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({usage, contributing});
    parser.default.withArgs(usage).returns(usageContentTree);

    assert.equal(
      injectSections({type: 'html', value: '<!--contribution-badges start -->'}, index, {children: childrenOfParent}),
      index + 4
    );
    assert.deepEqual(childrenOfParent[index], usageContentTree);
    assert.deepEqual(
      childrenOfParent[index + 1],
      {type: 'heading', depth: 2, children: [{type: 'text', value: 'Contributing'}]}
    );
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
