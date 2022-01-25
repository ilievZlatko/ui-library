import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './ErrorModal.scss';

@Component({ name: 'ErrorModal' })
class ErrorModal extends Vue {
  static readonly DEFAULT_TITLE = 'Something went wrong... 😞';
  static readonly DEFAULT_TEXT =
    "We're terribly sorry about that. If the page is not responding, please refresh the page.";

  @Prop({ required: true })
  showError: boolean;

  @Prop({ required: false, default: ErrorModal.DEFAULT_TITLE })
  title: string;

  @Prop({ required: false, default: ErrorModal.DEFAULT_TEXT })
  text: string;

  render(): VNode {
    return (
      <div class="error-container">
        <transition>
          {this.showError && (
            <div class="error">
              <div class="close" onClick={() => this.$emit('close')}>
                ×
              </div>
              <div class="content">
                <p class="title">{this.title}</p>
                <p class="text">{this.text}</p>
              </div>
            </div>
          )}
        </transition>
      </div>
    );
  }
}

export { ErrorModal };
