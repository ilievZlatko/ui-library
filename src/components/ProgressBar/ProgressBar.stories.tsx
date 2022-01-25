import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ProgressBar } from './ProgressBar';

const style = 'width: 150px; margin: 24px 0;';

@Component({ name: 'ProgressBarStory' })
class ProgressBarStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <p>Default:</p>
        <ProgressBar value={5} style={style} />
        <ProgressBar value={35} style={style} />
        <ProgressBar value={100} style={style} />
        <p>With secondary value:</p>
        <ProgressBar value={5} secondaryValue={25} style={style} />
        <ProgressBar value={35} secondaryValue={25} style={style} />
        <ProgressBar value={75} secondaryValue={25} style={style} />
      </div>
    );
  }
}

storiesOf('ProgressBar', module)
  .add('Default', () => ProgressBarStory);
