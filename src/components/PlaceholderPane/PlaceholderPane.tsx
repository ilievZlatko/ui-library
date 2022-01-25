import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';

import './PlaceholderPane.scss';

@Component({ name: 'PlaceholderPane' })
class PlaceholderPane extends Vue {
  static readonly EVENT_CLICK = 'click';

  private get placeholderAction(): VNode | Array<VNode> | null {
    if (this.$slots.action) {
      return this.$slots.action;
    }

    if (!this.actionText) {
      return null;
    }

    return (
      <Button
        class="placeholder-pane-action"
        text={this.actionText}
        disabled={this.actionDisabled}
        color={Button.Color.PRIMARY}
        onClick={this.onActionClicked}
        to={this.actionLink}
        stopPropagation={true}
      />
    );
  }

  private get placeholderIcon(): VNode | Array<VNode> | null {
    if (this.$slots.icon) {
      return this.$slots.icon;
    }

    if (!this.icon) {
      return null;
    }

    return <Icon class="placeholder-pane-icon" size={36} type={this.icon} clickable={false} />;
  }

  @Prop({ type: String, required: true })
  readonly text: string;

  @Prop({ type: String, required: true })
  readonly subText: string;

  @Prop({ type: String, required: false })
  readonly icon: Icon.Type;

  @Prop({ type: String, required: false, default: null })
  readonly actionText: string | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly actionDisabled: boolean;

  @Prop({ type: [Object, String], required: false, default: null })
  readonly actionLink: RawLocation | null;

  readonly $slots: {
    icon: Array<VNode>;
    action: Array<VNode>;
  };

  render(): VNode {
    return (
      <div class="lp-placeholder-pane">
        {this.placeholderIcon}
        <div class="placeholder-pane-text">{this.text}</div>
        <div class="placeholder-pane-sub-text">{this.subText}</div>
        {this.placeholderAction}
      </div>
    );
  }

  private onActionClicked(): void {
    if (this.actionText !== undefined) {
      this.$emit(PlaceholderPane.EVENT_CLICK);
    }
  }
}

export { PlaceholderPane };
