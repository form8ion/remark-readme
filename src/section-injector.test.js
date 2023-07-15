import parse from 'mdast-util-from-markdown';

import {afterEach, describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import getSectionInjector from './section-injector';

vi.mock('mdast-util-from-markdown');

describe('section injector', () => {
  const index = any.integer({min: 5, max: 20});
  const toc = any.simpleObject();
  const usage = any.simpleObject();
  const contributing = any.simpleObject();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add the "Table of Contents" heading and content after the status badge zone', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index + 2, max: index + 20});
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({toc});
    when(parse).calledWith(toc).mockReturnValue(tocContentTree);

    expect(injectSections(node, index, {children: childrenOfParent})).toEqual(index + 3);
    expect(childrenOfParent[index]).toEqual(node);
    expect(childrenOfParent[index + 1]).toEqual({
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Table of Contents'}]
    });
    expect(childrenOfParent[index + 2]).toEqual(tocContentTree);
  });

  it('should not add the "Table of Contents" heading if it already exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index + 1}),
      {type: 'heading', children: [{value: 'Table of Contents'}]},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({toc});
    when(parse).calledWith(toc).mockReturnValue(tocContentTree);

    expect(injectSections(node, index, {children: childrenOfParent})).toBe(undefined);
  });

  it('should add the "Table of Contents" heading and content when the "Usage" section exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index + 1}),
      {type: 'heading', children: [{value: 'Usage'}]},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({toc});
    when(parse).calledWith(toc).mockReturnValue(tocContentTree);

    expect(injectSections(node, index, {children: childrenOfParent})).toEqual(index + 3);
    expect(childrenOfParent[index]).toEqual(node);
    expect(childrenOfParent[index + 1]).toEqual({
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Table of Contents'}]
    });
    expect(childrenOfParent[index + 2]).toEqual(tocContentTree);
  });

  it('should not add the "Table of Contents" section when content is not provided', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const node = {type: 'html', value: '<!--status-badges end -->'};
    const tocContentTree = any.simpleObject();
    const injectSections = getSectionInjector({});
    when(parse).calledWith(toc).mockReturnValue(tocContentTree);

    expect(injectSections(node, index, {children: childrenOfParent})).toBe(undefined);
  });

  it('should add the "Usage" heading before the consumer badge zone', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({usage});

    expect(injectSections({type: 'html', value: '<!--consumer-badges start -->'}, index, {children: childrenOfParent}))
      .toEqual(index + 2);
    expect(childrenOfParent[index]).toEqual({type: 'heading', depth: 2, children: [{type: 'text', value: 'Usage'}]});
  });

  it('should not add the "Usage" heading if content is not defined', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({});

    expect(injectSections(
      {type: 'html', value: '<!--consumer-badges start -->'},
      index,
      {children: childrenOfParent}
    )).toBe(undefined);
  });

  it('should not add the "Usage" heading if it already exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index - 1}),
      {type: 'heading'},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const injectSections = getSectionInjector({usage});

    expect(injectSections(
      {type: 'html', value: '<!--consumer-badges start -->'},
      index,
      {children: childrenOfParent}
    )).toBe(undefined);
  });

  it('should add the "Usage" content before the contribution badge zone', () => {
    const usageContentTree = any.simpleObject();
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({usage});
    when(parse).calledWith(usage).mockReturnValue(usageContentTree);

    expect(
      injectSections({type: 'html', value: '<!--contribution-badges start -->'}, index, {children: childrenOfParent})
    ).toEqual(index + 2);
    expect(childrenOfParent[index]).toEqual(usageContentTree);
  });

  it('should not add the "Usage" content if not defined', () => {
    const usageContentTree = any.simpleObject();
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({});
    when(parse).calledWith(usage).mockReturnValue(usageContentTree);

    expect(injectSections(
      {type: 'html', value: '<!--contribution-badges start -->'},
      index,
      {children: childrenOfParent}
    )).toBe(undefined);
  });

  it('should add the "Contributing" heading before the consumer badge zone', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({contributing});

    expect(
      injectSections({type: 'html', value: '<!--contribution-badges start -->'}, index, {children: childrenOfParent})
    ).toEqual(index + 2);
    expect(childrenOfParent[index]).toEqual({
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Contributing'}]
    });
  });

  it('should not add the "Contributing" heading if it already exists', () => {
    const childrenOfParent = [
      ...any.listOf(any.simpleObject, {size: index - 1}),
      {type: 'heading'},
      ...any.listOf(any.simpleObject, {min: index, max: index + 20})
    ];
    const injectSections = getSectionInjector({contributing});

    expect(injectSections(
      {type: 'html', value: '<!--contribution-badges start -->'},
      index,
      {children: childrenOfParent}
    )).toBe(undefined);
  });

  it('should not add the "Contributing" heading if content is not defined', () => {
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({});

    expect(injectSections(
      {type: 'html', value: '<!--contribution-badges start -->'},
      index,
      {children: childrenOfParent}
    )).toBe(undefined);
  });

  it('should add the "Contributing" heading and "Usage" content in the proper locations if both are provided', () => {
    const usageContentTree = any.simpleObject();
    const childrenOfParent = any.listOf(any.simpleObject, {min: index, max: index + 20});
    const injectSections = getSectionInjector({usage, contributing});
    when(parse).calledWith(usage).mockReturnValue(usageContentTree);

    expect(
      injectSections({type: 'html', value: '<!--contribution-badges start -->'}, index, {children: childrenOfParent})
    ).toEqual(index + 4);
    expect(childrenOfParent[index]).toEqual(usageContentTree);
    expect(childrenOfParent[index + 1]).toEqual({
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Contributing'}]
    });
  });

  it('should skip other html nodes', () => {
    const injectSections = getSectionInjector({});

    expect(injectSections({type: 'html'}, index, {children: []})).toBe(undefined);
  });

  it('should skip other nodes', () => {
    const injectSections = getSectionInjector({});

    expect(injectSections({type: any.word()}, index, {children: []})).toBe(undefined);
  });
});
