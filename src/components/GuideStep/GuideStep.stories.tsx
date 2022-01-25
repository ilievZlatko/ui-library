import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { WrappedTextInput } from '../WrappedTextInput/WrappedTextInput';
import { GuideStep } from './GuideStep';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="width: 600px;">
        <div style="width: 600px;">
          <GuideStep indexIcon={1} title="Step 1" subTitle="The first step">
            <div>Step 1 content</div>
          </GuideStep>
          <GuideStep indexIcon={2} title="Step 2" subTitle="The second step">
            <WrappedTextInput label="Name" placeholder="Fred Flintstone" expanded={true}/>
          </GuideStep>
          <GuideStep indexIcon={3} title="Step 3" subTitle="Without content"/>
          <GuideStep indexIcon={Icon.Type.INFO} title="Info" subTitle="Info step"/>
        </div>

        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.INDICATOR}/GuideStep`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultStory);
