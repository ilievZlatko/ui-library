import { KeyboardConstants, stopPropagation, Throttled } from 'leanplum-lib-common';
import isEmpty from 'lodash/isEmpty';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';
import { Stargate } from '../Stargate/Stargate';

import './Modal.scss';

@Component({ name: 'Modal' })
class Modal extends Vue {
  static get hasOpenedModals(): boolean {
    return Stargate.openedInstances.filter((x) => x.$parent instanceof Modal).length > 0;
  }

  @Prop({ required: false, default: false })
  readonly simple: boolean;

  @Prop({ required: false, default: null })
  readonly title: string | null;

  @Prop({ required: false, default: '480px' })
  readonly width: string;

  @Prop({ required: false, default: '' })
  readonly className: string;

  @Prop({ required: false, default: '120px' })
  readonly minHeight: string;

  @Prop({ required: false, default: true })
  readonly fadeClose: boolean;

  @Prop({ required: false, default: false })
  readonly escClose: boolean;

  @Prop({ required: false, default: false })
  readonly closeButton: boolean;

  @Prop({ type: String, required: false, default: 'hidden' })
  readonly spinner: Modal.Spinner;

  @Prop({ required: false, default: false })
  readonly fullScreen: boolean;

  @Prop({ required: false, default: false })
  readonly alignTop: boolean;

  @Prop({ required: false, default: false })
  readonly bigTitle: boolean;

  private hasScrolled: boolean = false;
  private hasScrolledToEnd: boolean = true;

  $refs: {
    content: HTMLDivElement;
  };

  $slots: {
    default: Array<VNode>;
    footer: Array<VNode>;
  };

  mounted(): void {
    if (document.documentElement) {
      document.documentElement.classList.add('modal-open');
    }
  }

  beforeDestroy(): void {
    if (document.documentElement) {
      document.documentElement.classList.remove('modal-open');
    }
  }

  render(): VNode {
    return (
      <Stargate onBodyKeyDown={this.onBodyKeyDown}>
        <transition appear={true} onAppear={this.computeScrollState}>
          <div
            class={cx('lp-modal', this.className, { 'full-screen': this.fullScreen, 'align-top': this.alignTop })}
            onClick={this.onOverlayClick}
          >
            <div class="wrapper">{this.simple ? this.$slots.default : this.renderContent()}</div>
          </div>
        </transition>
      </Stargate>
    );
  }

  private renderContent(): VNode {
    return (
      <div
        class={cx('content', this.spinnerClass)}
        style={this.sizingStyles}
        onClick={stopPropagation}
        onScroll={this.computeScrollState}
        ref="content"
      >
        {this.hasHeader && (
          <div class={cx('header', { scrolled: this.hasScrolled })}>
            <p class={cx('title', { big: this.bigTitle })}>{this.title}</p>
            {this.closeButton && <Icon class="cross" size={32} type={Icon.Type.CLEAR} onClick={this.onClickCross} />}
          </div>
        )}
        <div class="body">{this.$slots.default}</div>
        {this.hasSpinner && (
          <div class="spinner-container" data-testid="modal-spinner">
            <div class="spinner" />
          </div>
        )}
        {this.hasFooter() ? (
          <div class={cx('footer', { scrolled: !this.hasScrolledToEnd })}>{this.$slots.footer}</div>
        ) : (
          <div class="footer-accommodation" />
        )}
      </div>
    );
  }

  private get hasHeader(): boolean {
    return this.closeButton || Boolean(this.title);
  }

  private hasFooter(): boolean {
    return !isEmpty(this.$slots.footer);
  }

  private get sizingStyles(): Partial<CSSStyleDeclaration> {
    const style: Partial<CSSStyleDeclaration> = {
      minWidth: this.width,
      width: this.width
    };

    if (this.minHeight !== null) {
      style.minHeight = this.minHeight;
    }

    return style;
  }

  private get hasSpinner(): boolean {
    return this.hasOverlaySpinner || this.hasContentReplacingSpinner;
  }

  private get spinnerClass(): string {
    return cx({
      'overlay-spinner': this.hasOverlaySpinner,
      'content-replacing-spinner': this.hasContentReplacingSpinner
    });
  }

  private get hasOverlaySpinner(): boolean {
    return this.spinner === Modal.Spinner.OVERLAY;
  }

  private get hasContentReplacingSpinner(): boolean {
    return this.spinner === Modal.Spinner.REPLACE_CONTENT;
  }

  private onOverlayClick(): void {
    if (this.fadeClose) {
      this.emitClose();
    }
  }

  private onClickCross(): void {
    if (this.closeButton) {
      this.emitClose();
    }
  }

  // Close on pressing ESC key (only if prop escClose is enabled)
  private onBodyKeyDown(event: KeyboardEvent): void {
    if (this.escClose && event.key === KeyboardConstants.ESC_KEY) {
      event.stopImmediatePropagation();
      this.emitClose();
    }
  }

  private emitClose(): void {
    if (!this.hasSpinner) {
      this.$emit('close');
    }
  }

  @Throttled(100)
  private computeScrollState(): void {
    const target = this.$refs.content;

    if (!target) {
      return;
    }

    this.hasScrolled = target.scrollTop > 0;
    this.hasScrolledToEnd = target.scrollTop + target.clientHeight === target.scrollHeight;
  }
}

namespace Modal {
  export enum Spinner {
    // (Default) Do not show any spinner
    HIDDEN = 'hidden',
    // Cover the entire Modal's content (with a light background) and show the spinner in the center
    OVERLAY = 'overlay',
    // Hide the 'body' and 'footer' divs, and replace them with a
    // spinner div that uses the 'width' and 'minHeight' prop values
    REPLACE_CONTENT = 'replace-content'
  }

  export interface Props {
    title: string | null;
    width?: string;
    minHeight?: string;
    fadeClose?: boolean;
    escClose?: boolean;
    closeButton?: boolean;
    spinner?: Modal.Spinner;
    fullScreen?: boolean;
    alignTop?: boolean;
    bigTitle?: boolean;
  }
}

export { Modal };
