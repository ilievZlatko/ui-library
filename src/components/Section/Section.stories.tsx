import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Section } from './Section';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({ type: String, required: false, default: () => text('title', 'Title') })
  public readonly title: string;

  @Prop({ type: String, required: false, default: () => text('subTitle', 'Some descriptive text goes here') })
  public readonly subTitle: string;

  @Prop({ type: Boolean, required: false, default: () => boolean('highlighted', false) })
  public readonly highlighted: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('inline', false) })
  public readonly inline: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('loading', false) })
  public readonly loading: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('bigTitle', false) })
  public readonly bigTitle: boolean;

  @Prop({ type: String, required: false, default: () => text('error', '') })
  public readonly error: string;

  @Prop({ type: String, required: false, default: () => text('warning', '') })
  public readonly warning: string;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('mode', Section.Mode, Section.Mode.STANDARD),
    validator(value: Section.Mode): boolean {
      return values(Section.Mode).indexOf(value) > -1;
    }
  })
  public readonly mode: Section.Mode;

  @Prop({ type: String, required: false, default: () => text('actions', 'actions go here') })
  public readonly actions: string;

  @Prop({ type: String, required: false, default: () => text('content', 'Content goes here') })
  public readonly content: string;

  render(): VNode {
    return (
      <div style="display: flex; background-color: #F6F9FB">
        <Section
          style="margin: 40px auto; width: 90%;"
          title={this.title}
          subTitle={this.subTitle}
          error={this.error}
          warning={this.warning}
          highlighted={this.highlighted}
          inline={this.inline}
          bigTitle={this.bigTitle}
          loading={this.loading}
          mode={this.mode}
        >
          <div slot="actions">{this.actions}</div>
          <div style="margin: 24px;">{this.content}</div>
        </Section>
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.LAYOUT}/Section`, module)
  .addDecorator(withKnobs)
  .add('Default', () => DefaultStory);
