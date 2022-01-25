import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Section } from '../Section/Section';
import { SplitLayout } from './SplitLayout';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({
    type: Boolean,
    required: true,
    default: () => boolean('collapsible', true)
  })
  collapsible: boolean;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="margin: 20px 40px">
        <SplitLayout collapsiblePane="left" leftMin={400} rightMin={400}>
          <Section style="height: 400px;" slot="left" title="Left section">
            <p style="padding: 24px">Left section content</p>
          </Section>
          <Section style="height: 400px;" slot="right" title="Right section">
            <p style="padding: 24px">Right section content</p>
          </Section>
        </SplitLayout>
        <SplitLayout leftMin={400} rightMin={400}>
          <Section style="height: 400px;" slot="left" title="Left section">
            <p style="padding: 24px">Left section content</p>
          </Section>
          <Section style="height: 400px;" slot="right" title="Right section">
            <p style="padding: 24px">Right section content</p>
          </Section>
        </SplitLayout>
        <SplitLayout
          collapsiblePane="right"
          leftMin={400}
          rightMin={400}
          onCollapsedPaneChange={action(SplitLayout.EVENT_COLLAPSED_PANE_CHANGE)}
        >
          <Section style="height: 400px;" slot="left" title="Left section">
            <p style="padding: 24px">Left section content</p>
          </Section>
          <Section style="height: 400px;" slot="right" title="Right section">
            <p style="padding: 24px">Right section content</p>
          </Section>
        </SplitLayout>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.LAYOUT}/SplitLayout`, module)
  .addDecorator(withKnobs)
  .add('Default', () => DefaultStory);
