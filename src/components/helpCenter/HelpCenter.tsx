import { Modal } from 'leanplum-lib-ui';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

const linkToDocs: string = 'https://docs.leanplum.com';
const linkToSupportCenter: string = 'https://support.leanplum.com';
const linkToSiteStatus: string = 'http://status.leanplum.com';

import './HelpCenter.scss';

@Component({ name: 'HelpCenter' })
class HelpCenter extends Vue {
  @Prop({ required: false, default: true })
  withModal: boolean;

  render(): VNode {
    if (this.withModal) {
      return (
        <Modal
          className="help-center"
          title="3 Ways to Get Help"
          width="680px"
          onClose={this.onClose}
          fadeClose={true}
          escClose={true}
          closeButton={true}
          bigTitle={true}
        >
          {this.renderContent()}
        </Modal>
      );
    }

    return (
      <div class="help-center">
        <div class="title-box">
          <p class="title">3 Ways to Get Help</p>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  private renderContent(): Array<VNode> {
    return [
      <div class="section">
        <p class="title">1. Leanplum Help Center</p>
        <p>
          <span>Visit </span>
          <a href={linkToDocs} rel="noopener referrer" target="_blank">
            {linkToDocs}
          </a>
          <span> to review helpful User Guides, Developer docs and Changelogs.</span>
        </p>
      </div>,
      <div class="section">
        <p class="title">2. Submit a Ticket</p>
        <p>
          <span>To log a support ticket, go to </span>
          <a href={linkToSupportCenter} rel="noopener referrer" target="_blank">
            {linkToSupportCenter}
          </a>
          <span> and click Submit a request.</span>
        </p>
      </div>,
      <div class="section">
        <p class="title">3. Leanplum Site Status</p>
        <p>
          <span>Visit </span>
          <a href={linkToSiteStatus} rel="noopener referrer" target="_blank">
            {linkToSiteStatus}
          </a>
          <span> for Leanplum's performance metrics, planned maintainance dates, and incident reports.</span>
        </p>
      </div>
    ];
  }

  private onClose(): void {
    this.$emit('close');
  }
}

export { HelpCenter };
