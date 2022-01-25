import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './TypeaheadNote.scss';

@Component({ name: 'TypeaheadNote' })
class TypeaheadNote extends Vue {
  @Prop({ required: true })
  text: string;

  render(): VNode | null {
    return <div class="type-ahead-note">{this.text}</div>;
  }
}

export { TypeaheadNote };
