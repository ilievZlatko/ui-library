import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { Icon } from '../icon/Icon';

import './Link.scss';

@Component({ name: 'Link' })
class Link extends Vue implements Link.Props {
  @Prop({ type: [Object, String], required: true })
  readonly to: RawLocation;

  @Prop({ type: String, required: true })
  readonly text: string;

  @Prop({ type: String, required: false, default: null })
  readonly icon: Icon.Type | null;

  render(): VNode {
    return (
      <router-link to={this.to}>
        {/*
          router-link does not support preventDefault
          https://github.com/vuejs/vue-router/issues/916
        */}
        <div class="lp-link" onClick={this.onClick}>
          {this.icon && <Icon type={this.icon} />}
          {this.text}
        </div>
      </router-link>
    );
  }

  private onClick(event: Event): void {
    this.$emit('click', event);
  }
}

namespace Link {
  export interface Props {
    readonly to: RawLocation;
    readonly text: string;
    readonly icon?: Icon.Type | null;
  }
}

export { Link };
