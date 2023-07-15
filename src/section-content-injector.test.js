import parse from 'mdast-util-from-markdown';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import sectionContentInjectorFactory from './section-content-injector';

vi.mock('mdast-util-from-markdown');

describe('section content injector', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should append the content to the section range', () => {
    const content = any.sentence();
    const start = any.simpleObject();
    const nodes = any.listOf(any.simpleObject);
    const end = any.simpleObject();
    const contentTree = any.simpleObject();
    when(parse).calledWith(content).mockReturnValue(contentTree);

    expect(sectionContentInjectorFactory(content)(start, nodes, end))
      .toEqual([start, {type: 'root', children: [...nodes, contentTree]}, end]);
  });
});
