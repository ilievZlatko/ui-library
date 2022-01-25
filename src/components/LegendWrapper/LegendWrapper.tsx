import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { ErrorTooltip } from '../ErrorTooltip/ErrorTooltip';
import { Tooltip } from '../Tooltip/Tooltip';
import { WarningTooltip } from '../WarningTooltip/WarningTooltip';

import './LegendWrapper.scss';

// tslint:disable:jsdoc-format
/**
 * Defines the base frame, style and related animated transitions for the
 * standard input components of the dashboard.
 *
 * Can render in 2 different modes: default and expanded. In the default
 * mode displays a provided label only. In expanded mode an additional
 * component is displayed under the label. The component is provided as contents:
```
<LegendWrapper>
  <div>custom content</div>
</LegendWrapper>
 ```
 *
 * @event focus: Fired when the component receives the focus.
 *
 * @author Deyan Gunchev
 */
@Component({ name: 'LegendWrapper' })
class LegendWrapper extends Vue {
  static readonly EVENT_FOCUS = 'focus';
  static readonly ERROR_ICON_SIZE: number = 16;

  /**
   * The label to display.
   *
   * Shows in the center when not expanded, and above the content when expanded.
   */
  @Prop({ type: String, required: false, default: null })
  label: string | null;

  /**
   * Controls the expanded state of the component.
   * Set to `true` to expand.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly expanded: boolean;

  /**
   * Flag to tell if the input is disabled or not. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  /**
   * Flag to tell if the input is readonly or not. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly readonly: boolean;

  /**
   * Flag to tell if there should be border around the input. It's false by default.
   */
  @Prop({ required: false, default: false })
  readonly outline: boolean;

  /**
   * Flag to tell if the input is required to have a value. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly required: boolean;

  /**
   * Error string or array of errors. If set, the input will be rendered in an errored state. Empty by default.
   */
  @Prop({ type: [String, Array], required: false, default: '' })
  readonly error: string | Array<string>;

  /**
   * Warning string or array of warnings. If set, the input will be rendered in warning state unless error,
   * which takes precedence. Empty by default.
   */
  @Prop({ type: [String, Array], required: false, default: '' })
  readonly warning: string | Array<string>;

  @Prop({ type: Boolean, required: false, default: true })
  readonly showHighlightOnWarning: boolean;

  render(): VNode {
    return (
      <div
        class={cx('lp-legend-wrapper', {
          'lp-enabled': !this.disabled,
          'lp-disabled': this.disabled,
          outline: this.outline,
          'no-label': !this.label,
          'lp-expanded': this.expanded,
          'lp-error': Boolean(this.error?.length),
          'lp-warning': Boolean(!this.error?.length && this.warning?.length && this.showHighlightOnWarning),
          'lp-readonly': this.readonly
        })}
        tabindex="-1"
        onFocus={this.onFocus}
      >
        {this.label && (
          <div class="lp-legend-wrapper-label">
            {this.label}
            {this.required ? this.renderRequired() : null}
            <div class="after" onClick={this.onClickAfter}>
              <div class="slot hover">{this.$slots[LegendWrapper.Slot.LABEL_HOVER]}</div>
              {this.expanded ? <div class="slot active">{this.$slots[LegendWrapper.Slot.LABEL_ACTIVE]}</div> : null}
              <div class="slot always">{this.$slots[LegendWrapper.Slot.LABEL]}</div>
            </div>
          </div>
        )}
        <div class="lp-legend-wrapper-content">{this.$slots.default}</div>
        {this.error?.length ? (
          <ErrorTooltip message={this.error} />
        ) : this.warning?.length ? (
          <WarningTooltip message={this.warning} />
        ) : null}
      </div>
    );
  }

  private renderRequired(): VNode {
    return (
      <Tooltip message="This field is required" placement={Tooltip.Placement.TOP_START} offset={12}>
        <div class="required-wrapper">
          <div class="required" />
        </div>
      </Tooltip>
    );
  }

  private onClickAfter(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
  }

  private onFocus(): void {
    this.$emit(LegendWrapper.EVENT_FOCUS);
  }
}

namespace LegendWrapper {
  export enum Slot {
    LABEL = 'label',
    LABEL_HOVER = 'labelHover',
    LABEL_ACTIVE = 'labelActive',
    BEFORE = 'before',
    AFTER = 'after'
  }
}

export { LegendWrapper };
