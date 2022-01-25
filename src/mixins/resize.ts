import debounce from 'lodash/debounce';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * Mixin that adds a debounced onResize hook
 */
@Component({ name: 'Resize' })
export class Resize extends Vue {
  debouncedResize: () => void;

  /* tslint:disable-next-line:no-empty */
  onResize(): void {}

  resizeDebounce: number = 50;
  immediateResize: boolean = true;

  created(): void {
    this.debouncedResize = debounce(this.onResize, this.resizeDebounce);
  }

  mounted(): void {
    window.addEventListener('resize', this.debouncedResize);
    if (this.immediateResize) {
      this.$nextTick(() => this.onResize());
    }
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.debouncedResize);
  }
}
