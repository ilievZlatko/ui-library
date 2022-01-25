import Long from 'long';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { Tooltip } from '../Tooltip/Tooltip';

import './PropertyList.scss';

@Component({ name: 'PropertyList' })
class PropertyList extends Vue {
  private static readonly COLLAPSED_PROPERTIES_COUNT: number = 4;

  private collapsed: boolean = false;

  private get visiblePropertyKeys(): Array<string> {
    return this.collapsible && this.collapsed
      ? Object.keys(this.properties).slice(0, PropertyList.COLLAPSED_PROPERTIES_COUNT)
      : Object.keys(this.properties);
  }

  @Prop({ type: Object, required: true })
  readonly properties: { [key: string]: string | number | Long | { text: string; tooltip: string } };

  @Prop({ type: String, required: false, default: '' })
  readonly title: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly collapsible: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly useSingleColumn: boolean;

  @Watch('collapisble', { immediate: true })
  onCollapsibleChanged(): void {
    // If the component is collapsible, it is collapsed by default.
    if (this.collapsible) {
      this.collapsed = true;
    }
  }

  render(): VNode {
    return (
      <div class="lp-property-list">
        {this.title && <div class="lp-property-list-header">{this.title}</div>}
        <div class={cx('lp-property-list-grid', { 'single-column': this.useSingleColumn })}>
          {this.visiblePropertyKeys.map((key: string) => [
            <div class="lp-property-list-label">{key}</div>,
            this.renderValue(key)
          ])}
          {this.renderCollapseLink()}
        </div>
      </div>
    );
  }

  private renderCollapseLink(): VNode | null {
    if (PropertyList.COLLAPSED_PROPERTIES_COUNT < Object.keys(this.properties).length && this.collapsible) {
      return <a onClick={this.toggleExpand}>{this.collapsed ? 'See all' : 'See less'}</a>;
    } else {
      return null;
    }
  }

  private renderValue(key: string): VNode {
    const value = this.properties[key];

    if (typeof value === 'string' || typeof value === 'number' || value instanceof Long) {
      return <OverflowableText text={value} />;
    }

    return (
      <Tooltip message={value.tooltip} placement={Tooltip.Placement.BOTTOM}>
        <div>{value.text}</div>
      </Tooltip>
    );
  }

  private toggleExpand(): void {
    this.collapsed = !this.collapsed;
  }
}

export { PropertyList };
