// tslint:disable:import-blacklist
import { PortalTarget } from 'portal-vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StargateConstants } from './StargateConstants';

import './StargateTarget.scss';

@Component({ name: 'StargateTarget' })
class StargateTarget extends Vue {

  @Prop({ type: String, required: false, default: '' })
  readonly name: string;

  render(): VNode {
    return (
      <PortalTarget
        class="lp-portal-target"
        name={this.name || StargateConstants.TARGET_A}
        multiple={true}
      />
    );
  }

}

export { StargateTarget };
