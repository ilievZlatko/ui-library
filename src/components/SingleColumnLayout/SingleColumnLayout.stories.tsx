import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { InfoPanel } from '../InfoPanel/InfoPanel';
import { Link } from '../Link/Link';
import { SingleColumnLayout } from './SingleColumnLayout';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  static SAMPLE_TEXT: string = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    ut labore et dolore magna aliqua.
  `;
  private backLink: Link.Props = { text: 'Back Link', to: {} };

  @Prop({ type: Boolean, required: true, default: () => text('title', 'This is an example page title') })
  title: boolean;

  @Prop({ type: Boolean, required: false, default: () => text('subtitle', `Subtitle: ${DefaultStory.SAMPLE_TEXT}`) })
  subtitle: boolean;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <SingleColumnLayout title={this.title} subtitle={this.subtitle} backLink={this.backLink}>
          <div slot="titleSuffix" style="border: 1px dashed silver; color: silver; padding: 0 8px;">
            title suffix area
          </div>
          <div slot="actions">
            <Button text="Action" color={Button.Color.PRIMARY} />
          </div>
          <InfoPanel slot="infoPanel" message="info panel slot" />
          <div style="background-color: white; height: 500px">content area</div>
        </SingleColumnLayout>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.LAYOUT}/SingleColumnLayout`, module)
  .addDecorator(withKnobs)
  .add('Default', () => DefaultStory);
