import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';

import './InputGroup.scss';

/**
 * Groups input components together, emphasizing that they are related.
 */
@Component({ name: 'InputGroup' })
class InputGroup extends Vue {
  render(): VNode {
    return <div class="lp-input-group">{this.$slots.default}</div>;
  }
}

export { InputGroup };
