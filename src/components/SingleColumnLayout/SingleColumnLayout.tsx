import { cx, Icon, Link, OverflowableText } from 'leanplum-lib-ui';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Spacing } from '../../utils/styles';
import { Button } from '../Button/Button';
import { Separator } from '../Separator/Separator';

import './SingleColumnLayout.scss';

@Component({ name: 'SingleColumnLayout' })
class SingleColumnLayout extends Vue {
  private static readonly SCROLL_TOP_OFFSET: number = 0;

  @Prop({ type: String, required: true })
  readonly title: string;

  @Prop({ type: String, required: false, default: null })
  readonly titleClassName: string | null;

  @Prop({ type: String, required: false, default: '' })
  readonly subtitle: string;

  @Prop({ type: Object, required: false, default: null })
  readonly backLink: Link.Props;

  @Prop({ type: Boolean, required: false, default: true })
  readonly scrollable: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly fullscreen: boolean;

  readonly $slots: {
    actions: Array<VNode>;
    default: Array<VNode>;
    infoPanel?: Array<VNode>;
    titleSuffix?: Array<VNode>;
  };

  private isPageScrolled: boolean = false;

  render(): VNode {
    return (
      <div
        class={cx('page-container', { scrollable: this.scrollable, fullscreen: this.fullscreen })}
        onScroll={this.onScroll}
      >
        <div class={cx('header-wrapper', { scrolled: this.isPageScrolled })}>
          <div class="header-content">
            <div class="header-main-row">
              {this.backLink && [
                <Button
                  class="header-back-button"
                  appearance={Button.Appearance.OUTLINE}
                  icon={Icon.Type.ARROW_LEFT}
                  tooltip={this.backLink.text}
                  to={this.backLink.to}
                  onClick={this.emitBack}
                />,
                <Separator spacing={Spacing.LARGE}/>
              ]}
              <OverflowableText class={cx('page-title', this.titleClassName)} text={this.title} />
              {this.$slots.titleSuffix && <div class="page-title-suffix">{this.$slots.titleSuffix}</div>}
              {this.$slots.infoPanel && <section class="info-panel">{this.$slots.infoPanel}</section>}
              <section class={this.getActionsClasses()}>{this.$slots.actions}</section>
            </div>
            {this.subtitle && <OverflowableText class="page-subtitle" text={this.subtitle} />}
          </div>
        </div>
        <div class="page-content">{this.$slots.default}</div>
      </div>
    );
  }

  private getActionsClasses(): string {
    return cx('page-actions', {
      'with-left-margin': !this.$slots.infoPanel
    });
  }

  private onScroll(event: UIEvent): void {
    const target = event.target as HTMLDivElement;
    this.isPageScrolled = target.scrollTop > SingleColumnLayout.SCROLL_TOP_OFFSET;
  }

  private emitBack(event: Event): void {
    this.$emit('back', event);
  }
}

export { SingleColumnLayout };
