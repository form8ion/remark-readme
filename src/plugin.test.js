import childrenModifier from 'unist-util-modify-children';
import headingRange from 'mdast-util-heading-range';

import any from '@travi/any';
import {afterEach, beforeEach, vi, describe, it, expect} from 'vitest';
import {when} from 'jest-when';

import sectionInjector from './section-injector';
import sectionContentInjector from './section-content-injector';
import plugin from './plugin';

vi.mock('unist-util-modify-children');
vi.mock('mdast-util-heading-range');
vi.mock('./section-injector');
vi.mock('./section-content-injector');

describe('plugin', () => {
  let node;
  const injector = any.simpleObject();

  beforeEach(() => {
    node = {...any.simpleObject(), children: []};
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should inject the "Usage" section header when not present', () => {
    const documentation = {usage: any.sentence()};
    const modifier = vi.fn();
    when(sectionInjector).calledWith(documentation).mockReturnValue(injector);
    when(childrenModifier).calledWith(injector).mockReturnValue(modifier);

    plugin(documentation)(node);

    expect(modifier).toHaveBeenCalledWith(node);
    expect(headingRange).not.toHaveBeenCalled();
  });

  it('should inject the "Table of Contents" section header when not present', () => {
    const documentation = {toc: any.sentence()};
    const modifier = vi.fn();
    when(sectionInjector).calledWith(documentation).mockReturnValue(injector);
    when(childrenModifier).calledWith(injector).mockReturnValue(modifier);

    plugin(documentation)(node);

    expect(modifier).toHaveBeenCalledWith(node);
    expect(headingRange).not.toHaveBeenCalled();
  });

  it('should inject the "Contributing" section header when not present', () => {
    const contributingContent = any.sentence();
    const documentation = {contributing: contributingContent};
    const modifier = vi.fn();
    const contentInjector = vi.fn();
    when(sectionInjector).calledWith(documentation).mockReturnValue(injector);
    when(sectionContentInjector).calledWith(contributingContent).mockReturnValue(contentInjector);
    when(childrenModifier).calledWith(injector).mockReturnValue(modifier);

    plugin(documentation)(node);

    expect(modifier).toHaveBeenCalledWith(node);
    expect(headingRange).toHaveBeenCalledWith(
      node,
      {test: 'Contributing', ignoreFinalDefinitions: true},
      contentInjector
    );
  });

  it('should not update the document when no usage, toc, or contributing content is provided', () => {
    const documentation = {};
    const modifier = vi.fn();
    when(sectionInjector).calledWith(documentation).mockReturnValue(injector);
    when(childrenModifier).calledWith(injector).mockReturnValue(modifier);

    plugin(documentation)(node);

    expect(modifier).not.toHaveBeenCalled();
  });
});
