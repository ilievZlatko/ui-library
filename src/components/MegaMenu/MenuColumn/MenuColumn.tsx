import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ItemGroup } from '../ItemGroup/ItemGroup';
import { MegaMenu } from '../MegaMenu';

import './MenuColumn.scss';

@Component({ name: 'MenuColumn' })
class MenuColumn<T> extends Vue {
  static readonly EVENT_SELECT = 'select';

  @Prop({ required: true, type: Object })
  readonly column: MegaMenu.Column<T>;

  private get isColumnEmpty(): boolean {
    return this.column.groups.every((group) => group.hidden || group.items.length === 0);
  }

  render(): VNode | null {
    if (this.isColumnEmpty) {
      return null;
    }

    return (
      <div class="menu-column">
        {this.column.groups.map((group) => (
          <ItemGroup group={group} onSelect={this.onSelect} />
        ))}
      </div>
    );
  }

  private onSelect(value: T): void {
    this.$emit(MenuColumn.EVENT_SELECT, value);
  }
}

export { MenuColumn };
