import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Header } from './Header';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({ type: String, required: false, default: () => text('title', 'Header Standalone Title') })
  public readonly title: string;

  @Prop({ type: String, required: false, default: () => text('subTitle', 'Some descriptive text goes here') })
  public readonly subTitle: string;

  @Prop({ type: String, required: false, default: () => text('infoTooltip', '') })
  public readonly infoTooltip: string;

  @Prop({ type: Boolean, required: false, default: () => boolean('bigTitle', true) })
  public readonly bigTitle: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('boldTitle', true) })
  public readonly boldTitle: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('withSpacing', true) })
  public readonly withSpacing: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('withSeparator', true) })
  public readonly withSeparator: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('loading', false) })
  public readonly loading: boolean;

  @Prop({ type: String, required: false, default: () => text('leftActions', '') })
  public readonly leftActions: string;

  @Prop({ type: String, required: false, default: () => text('actions', '[actions]') })
  public readonly actions: string;

  render(): VNode {
    return (
      <div>
        <Header
          style="margin: 40px auto; width: 450px; background-color: white;"
          title={this.title}
          subTitle={this.subTitle}
          infoTooltip={this.infoTooltip}
          loading={this.loading}
          bigTitle={this.bigTitle}
          boldTitle={this.boldTitle}
          withSpacing={this.withSpacing}
          withSeparator={this.withSeparator}
        >
          <div slot="leftActions">{this.leftActions}</div>
          <div slot="actions">{this.actions}</div>
        </Header>
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`Header`, module)
  .addDecorator(withKnobs)
  .add('Default', () => DefaultStory);
