import parse from 'mdast-util-from-markdown';
import find from 'unist-util-find';
import findAllAfter from 'unist-util-find-all-after';
import findBetween from 'unist-util-find-all-between';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

function decideEndMarker(sectionName, usage, contributing) {
  if ('Table of Contents' === sectionName && usage) {
    return {type: 'heading', depth: 2, children: [{type: 'text', value: 'Usage'}]};
  }

  if ('Usage' === sectionName && contributing) {
    return {type: 'heading', depth: 2, children: [{type: 'text', value: 'Contributing'}]};
  }

  if ('Contributing' === sectionName && contributing) {
    return {type: 'definition'};
  }

  return {
    type: 'html',
    value: `<!--${'Usage' === sectionName ? 'contribution' : 'consumer'}-badges start -->`
  };
}

function findAllInSection(readmeTree, sectionName, test, usage, contributing) {
  return findBetween(
    readmeTree,
    {
      type: 'heading',
      depth: 2,
      children: [{
        type: 'text',
        value: sectionName
      }]
    },
    decideEndMarker(sectionName, usage, contributing),
    test
  );
}

Given('the existing README has no {string} heading', async function (sectionName) {
  this[`${sectionName.toLowerCase()}-heading`] = null;
});

Given('the existing README has an existing {string} section', async function (sectionName) {
  this[`${sectionName.toLowerCase()}-heading`] = sectionName;
  this[`${sectionName.toLowerCase()}-existing-content`] = any.sentence();
});

Given('content is provided for the {string} section', async function (sectionName) {
  this[sectionName.toLowerCase()] = any.sentence();
});

Then('there is a {string} heading', async function (sectionName) {
  const readmeTree = parse(this.resultingContent);

  const matchingSectionHeadings = findAllAfter(readmeTree, 1, {type: 'heading', depth: 2})
    .filter(sectionHeading => sectionName === sectionHeading.children[0].value);

  assert.equal(matchingSectionHeadings.length, 1);

  const htmlElements = findAllInSection(readmeTree, sectionName, 'html', this.usage, this.contributing);

  if ('Usage' === sectionName) {
    assert.equal(htmlElements[0].value, '<!--consumer-badges start -->');
  } else if ('Contributing' === sectionName) {
    assert.equal(htmlElements[0].value, '<!--contribution-badges start -->');
  }
});

Then('there is no {string} heading', async function (sectionName) {
  const readmeTree = parse(this.resultingContent);

  assert.isUndefined(find(readmeTree, {type: 'heading', depth: 2, children: [{type: 'text', value: sectionName}]}));
});

Then('the {string} content is populated', async function (sectionName) {
  const readmeTree = parse(this.resultingContent);

  const paragraphs = findAllInSection(readmeTree, sectionName, 'paragraph', this.usage, this.contributing);

  assert.equal(paragraphs[0].children[0].value, this[sectionName.toLowerCase()]);
});

Then('the {string} content is unchanged', async function (sectionName) {
  const readmeTree = parse(this.resultingContent);

  const paragraphs = findAllInSection(readmeTree, sectionName, 'paragraph', this.usage, this.contributing);

  assert.equal(paragraphs[0].children[0].value, this[`${sectionName.toLowerCase()}-existing-content`]);
});
