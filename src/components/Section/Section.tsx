import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { ErrorTooltip } from '../ErrorTooltip/ErrorTooltip';
import { Header } from '../Header/Header';
import { WarningTooltip } from '../WarningTooltip/WarningTooltip';

import './Section.scss';

@Component({ name: 'Section' })
class Section extends Vue {
  static readonly EVENT_ANIMATION_END: string = 'animationEnd';
  static readonly EVENT_CLICK: string = 'click';

  @Prop({ type: String, required: false, default: '' })
  readonly title: string;

  @Prop({ type: String, required: false, default: '' })
  readonly subTitle: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly highlighted: boolean;

  @Prop({ type: String, required: false, default: '' })
  readonly infoTooltip: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly inline: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly bigTitle: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly withSeparator: boolean;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly error: string | Array<string>;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly warning: string | Array<string>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({
    type: String,
    required: false,
    default: 'standard',
    validator(value: Section.Mode): boolean {
      return values(Section.Mode).indexOf(value) > -1;
    }
  })
  readonly mode: Section.Mode;

  $slots: {
    actions: Array<VNode>;
    default: Array<VNode>;
    leftActions: Array<VNode>;
  };

  render(): VNode {
    return (
      <div
        class={cx('lp-section', {
          highlighted: this.highlighted,
          inline: this.inline,
          loading: this.loading,
          warn: this.mode === Section.Mode.WARN || (this.error.length === 0 && this.warning.length !== 0),
          error: this.mode === Section.Mode.ERROR || this.error.length !== 0
        })}
        onAnimationend={this.onAnimationEnd}
        onClick={this.onClick}
      >
        <Header
          class="header"
          title={this.title}
          subTitle={this.subTitle}
          infoTooltip={this.infoTooltip}
          bigTitle={this.bigTitle}
          loading={this.loading}
          withSpacing={!this.inline}
          withSeparator={this.withSeparator}
        >
          <template slot="leftActions">{this.$slots.leftActions}</template>
          <template slot="actions">{this.$slots.actions}</template>
        </Header>
        <div class="content">{!this.loading && this.$slots.default}</div>
        {this.renderTooltip()}
        {/** TODO Deyan: Eventually add a slot for advanced setting here */}
      </div>
    );
  }

  private renderTooltip(): VNode | null {
    if (this.error.length !== 0) {
      return <ErrorTooltip message={this.error} />;
    }

    if (this.warning.length !== 0) {
      return <WarningTooltip message={this.warning} />;
    }

    return null;
  }

  private onAnimationEnd(): void {
    this.$emit(Section.EVENT_ANIMATION_END);
  }

  private onClick(): void {
    this.$emit(Section.EVENT_CLICK);
  }
}

namespace Section {
  export enum Mode {
    STANDARD = 'standard',
    WARN = 'warn',
    ERROR = 'error'
  }
}

export { Section };
