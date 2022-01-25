import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './Hint.scss';

type HintPosition = 'bottom' | 'left' | 'right' | 'top';

type HintType = 'normal' | 'error' | 'warning';

// TODO(ignat): Refactor and split into 2 components - Hint and Notification.
@Component({ name: 'Hint' })
class Hint extends Vue {
  protected readonly DEFAULT_TIMEOUT: number = 5000; // 5 seconds

  protected hasActivator: boolean = false;
  protected isVisible: boolean = false;

  protected get classNames(): string {
    const result = ['lp-hint', `lp-hint--${this.type || 'normal'}`];

    if (this.position) {
      if (this.hasActivator) {
        result.push('lp-hint--has-activator');
      } else {
        result.push('lp-hint--has-close');
      }
      result.push(`lp-hint--${this.position}`);
    }

    return result.join(' ');
  }

  @Prop({ type: String, required: false })
  public activatorClass: string | undefined;

  @Prop({ type: String, required: false })
  public message: string | undefined;

  @Prop({ type: String, required: false })
  public position: HintPosition | undefined;

  @Prop({ type: String, required: false })
  public title: string | undefined;

  @Prop({ type: Number, required: false })
  public timeout: number | undefined;

  @Prop({ type: String, required: false })
  public type: HintType | undefined;

  public onClose(): void {
    this.$emit('close');
  }

  public render(): VNode | null {
    this.hasActivator = !!(this.$slots && this.$slots.default);
    if (this.hasActivator) {
      return (
        <div
          class={['lp-hint-activator', this.activatorClass || ''].join(' ')}
          onMouseenter={this.toggleVisibility}
          onMouseleave={this.toggleVisibility}
        >
          {this.$slots && this.$slots.default}
          {this.renderHint()}
        </div>
      );
    } else {
      // There's no activator so the hint should be visible by default.
      this.isVisible = true;
      if (this.timeout !== 0) {
        setTimeout(this.onClose.bind(this), this.timeout || this.DEFAULT_TIMEOUT);
      }

      return this.renderHint();
    }
  }

  private renderHint(): VNode | null {
    if (this.message) {
      return (
        <div class={this.classNames} style={{ visibility: this.isVisible ? 'visible' : 'hidden' }}>
          {this.renderTitle()}
          {this.renderMessage()}
          {this.renderCloseButton()}
        </div>
      );
    }

    return null;
  }

  private renderTitle(): VNode | null {
    if (this.title) {
      return <div class="lp-hint-title">{this.title}</div>;
    }

    return null;
  }

  private renderMessage(): VNode | null {
    if (this.message) {
      return <div class="lp-hint-message">{this.message}</div>;
    }

    return null;
  }

  private renderCloseButton(): VNode | null {
    if (!this.hasActivator) {
      return (
        <button class="lp-hint-close" onClick={this.onClose}>
          &times;
        </button>
      );
    }

    return null;
  }

  private toggleVisibility(e: MouseEvent): void {
    this.isVisible = e.type.toLowerCase().indexOf('enter') !== -1;
  }
}

export { Hint };
