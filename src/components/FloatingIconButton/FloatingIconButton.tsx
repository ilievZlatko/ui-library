import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';

import './FloatingIconButton.scss';

@Component({ name: 'FloatingIconButton' })
class FloatingIconButton extends Vue {
  @Prop({ type: String, required: false, default: null })
  readonly text: string | null;

  @Prop({
    type: String,
    required: false,
    default: 'light',
    validator(value: Button.Color): boolean {
      return values(Button.Color).indexOf(value) > -1;
    }
  })
  readonly color: Button.Color;

  @Prop({
    type: String,
    required: false,
    default: 'normal',
    validator(value: Button.Appearance): boolean {
      return values(Button.Appearance).indexOf(value) > -1;
    }
  })
  readonly appearance: Button.Appearance;

  @Prop({ type: String, required: false, default: Icon.Type.PLUS })
  readonly icon: Icon.Type;

  render(): VNode {
    return (
      <div class="lp-fib" onClick={this.onClick}>
        <Button
          icon={this.icon}
          appearance={this.appearance}
          color={this.color}
          aria-label={this.text}
        />
        <span class="text" aria-hidden="true">
          {this.text}
        </span>
      </div>
    );
  }

  private onClick(): void {
    this.$emit(Button.EVENT_CLICK);
  }
}

export { FloatingIconButton };
