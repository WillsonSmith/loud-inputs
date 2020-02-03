import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { LoudInputs } from '../src/LoudInputs.js';
import '../loud-inputs.js';

storiesOf('loud-inputs', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(LoudInputs))
  .add(
    'Alternative Title',
    () => html`
      <loud-inputs .title=${'Something else'}></loud-inputs>
    `,
  );
