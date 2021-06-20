import any from '@travi/any';
import sinon from 'sinon';
import plugin from './plugin';

suite('plugin', () => {
  let sandbox, node;

  setup(() => {
    sandbox = sinon.createSandbox();

    // sandbox.stub();

    node = {...any.simpleObject(), children: []};
  });

  teardown(() => sandbox.restore());

  test('that the "Usage" section header is injected when not present', () => {
    const transformer = plugin({usage: any.sentence()});

    transformer(node);
  });
});
