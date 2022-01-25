import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({ name: 'ErrorPropagatingComponent' })
class ErrorPropagatingComponent extends Vue {
  setError(error: Error, text?: string | null): void {
    this.$emit('error', error, text);
  }
}

export { ErrorPropagatingComponent };
