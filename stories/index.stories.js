import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { LoudInputs } from '../src/LoudInputs.js';
import '../loud-inputs.js';

storiesOf('loud-inputs', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(LoudInputs))
  .add(
    'Alternative Title',
    () => html`
      <loud-inputs>
        <label>Check to play sound: <input type="checkbox"/></label>
      </loud-inputs>
    `,
  );
