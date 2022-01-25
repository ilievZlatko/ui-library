import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Location } from 'vue-router';

import { Icon } from '../icon/Icon';

import './Breadcrumbs.scss';

@Component({ name: 'Breadcrumbs' })
class Breadcrumbs<T> extends Vue {
  @Prop({ required: true })
  readonly items: Array<Breadcrumbs.Item<T>>;

  render(): VNode {
    return (
      <div class="breadcrumbs">
        {this.items
          .slice(0, -1)
          .map((item) => [
            item.value ? this.renderWithValue(item) : this.renderWithLocation(item),
            <Icon clickable={false} type={Icon.Type.CHEVRON_RIGHT_SMALL} />
          ])}
        <div class="item-last">{this.items[this.items.length - 1].label}</div>
      </div>
    );
  }

  private renderWithValue(item: Breadcrumbs.Item<T>): VNode {
    return (
      <div
        class="item"
        onClick={() => {
          this.$emit('select', item);
        }}
      >
        {item.label}
      </div>
    );
  }

  private renderWithLocation(item: Breadcrumbs.Item<T>): VNode {
    return (
      <router-link class="item" to={item.location}>
        {item.label}
      </router-link>
    );
  }
}

namespace Breadcrumbs {
  export interface Item<T> {
    label: string;
    value?: T;
    location?: Location;
  }
}

export { Breadcrumbs };
