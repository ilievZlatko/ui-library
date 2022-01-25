import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { withReadme } from 'storybook-readme';
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { PlaceholderPane } from './PlaceholderPane';
import PlaceholderPaneReadme from './PlaceholderPane.md';

@Component({ name: 'PlaceholderPaneKnobStory' })
class PlaceholderPaneKnobStory extends Vue {
  onClick: Function = action('onClick');

  @Prop({ type: String, required: true, default: () => text('text', 'Placeholder text') })
  readonly text: string;

  @Prop({
    type: String,
    required: true,
    default: () => text('subText', 'Sub text giving a more detailed explanation.')
  })
  readonly subText: string;

  @Prop({ type: String, required: false, default: () => selectKnob('icon', Icon.Type, Icon.Type.SEARCH, true) })
  readonly icon: Icon.Type | null;

  @Prop({ type: String, required: false, default: () => text('actionText', 'Optional Action') })
  readonly actionText: string | null;

  render(): VNode {
    return (
      <PlaceholderPane
        text={this.text}
        subText={this.subText}
        icon={this.icon}
        actionText={this.actionText}
        onClick={this.onClick}
      />
    );
  }
}

storiesOf(`${StorybookSection.LAYOUT}/PlaceholderPane`, module)
  .addDecorator(withReadme(PlaceholderPaneReadme))
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => PlaceholderPaneKnobStory);
