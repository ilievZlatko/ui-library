import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../../utils/cx';
import { Button } from '../../Button/Button';
import { OverflowableText } from '../../OverflowableText/OverflowableText';
import { Tooltip } from '../../Tooltip/Tooltip';
import { MegaMenu } from '../MegaMenu';

import './ItemGroup.scss';

@Component({ name: 'ItemGroup' })
class ItemGroup<T> extends Vue {
  static readonly EVENT_SELECT = 'select';

  @Prop({ required: true, type: Object })
  readonly group: MegaMenu.Group<T>;

  render(): VNode | null {
    if (this.visibleItems.length === 0 || this.group.hidden) {
      return null;
    }

    return (
      <div class="menu-item-group-wrapper">
        <div class="group-header">
          {this.group.title && <h3>{this.group.title}</h3>}
          {this.group.subtitle && <h4>{this.group.subtitle}</h4>}
          {this.group.additionalRenderer?.()}
        </div>
        <div class="menu-item-group">
          <ul>{this.visibleItems.map(this.renderItem)}</ul>
        </div>
        {this.group.action && <Button text={this.group.action.label} onClick={this.group.action.onClick} />}
      </div>
    );
  }

  private get visibleItems(): Array<MegaMenu.Item<T>> {
    return this.group.items.filter((item) => !item.hidden);
  }

  private renderItem(item: MegaMenu.Item<T>): VNode {
    const onClick = (e: MouseEvent): void => {
      if (item.disabled) {
        return;
      }

      e.stopPropagation();
      this.onSelect(item.value);
    };

    return (
      <li class={cx({ disabled: item.disabled })} style={`width: ${100 / (this.group.columns ?? 1)}%;`}>
        <a class={cx('menu-item-link', item.className)} tabindex="0" onClick={onClick}>
          <div class="menu-item">
            <OverflowableText text={item.label} tooltip={item.tooltip} />
            {item.additionalRenderer?.()}
          </div>
          {item.description && <div class="menu-item-description">{item.description}</div>}
        </a>
      </li>
    );
  }

  private onSelect(value: T): void {
    this.$emit(ItemGroup.EVENT_SELECT, value);
  }
}

export { ItemGroup };
