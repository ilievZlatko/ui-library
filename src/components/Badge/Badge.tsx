import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './Badge.scss';

@Component({ name: 'Badge' })
class Badge extends Vue {
  @Prop({ required: true, type: [String, Number] })
  readonly text: string | number;

  @Prop({ type: String, required: false, default: () => Badge.Color.PRIMARY })
  readonly color: Badge.Color;

  render(): VNode {
    return <span class={`lp-badge ${this.color}`}>{this.text}</span>;
  }
}

namespace Badge {
  export enum Color {
    PRIMARY = 'primary',
    PRIMARY_LIGHT = 'primary-light',
    GREY = 'grey',
    GREY_LIGHT = 'grey-light',
    BLACK = 'black',
    BLACK_LIGHT = 'black-light',
    GREEN = 'green',
    GREEN_LIGHT = 'green-light',
    RED = 'red',
    RED_LIGHT = 'red-light',
    PLUM = 'plum',
    PLUM_LIGHT = 'plum-light',
    ORANGE = 'orange',
    ORANGE_LIGHT = 'orange-light',
    CYAN = 'cyan',
    CYAN_LIGHT = 'cyan-light',
    YELLOW = 'yellow',
    YELLOW_LIGHT = 'yellow-light'
  }
}

export { Badge };
