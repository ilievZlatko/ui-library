import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './NotificationContent.scss';

@Component({ name: 'NotificationContent' })
class NotificationContent extends Vue {
  @Prop({ type: [String, Array], required: false, default: '' })
  message: string | Array<string>;

  private get messages(): Array<string> {
    return typeof this.message === 'string' ? [this.message] : this.message;
  }

  render(): VNode {
    return (
      <div class="lp-notification-content">
        {this.messages.length === 1 ? (
          <div class="lp-notification-content-message">{this.messages[0]}</div>
        ) : (
          <ul class="notification-content-list">
            {this.messages.map((m) => (
              <li>{m}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export { NotificationContent };
