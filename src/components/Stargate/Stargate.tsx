// tslint:disable:import-blacklist
import { Wormhole } from 'portal-vue';
import Vue, { VNode } from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { StargateConstants } from './StargateConstants';

@Component({ name: 'Stargate' })
class Stargate extends Vue {
  // All currently open popups are tracked by the order of mounting in the DOM,
  // so that keyboard events can be sent only to the one on top.
  private static readonly opened: Array<Stargate> = [];
  private static baseId: number = 1;

  @Inject({ default: '' })
  readonly stargateTarget: string;

  static get openedInstances(): ReadonlyArray<Readonly<Stargate>> {
    return Stargate.opened;
  }

  private source: string = `stargate_${Stargate.baseId++}`;

  private get target(): string {
    return this.stargateTarget || StargateConstants.TARGET_A;
  }

  mounted(): void {
    Stargate.opened.push(this);

    this.sendContentToTarget();
  }

  updated(): void {
    this.sendContentToTarget();
  }

  beforeDestroy(): void {
    Stargate.opened.splice(Stargate.opened.indexOf(this), 1);

    this.close();
  }

  render(): VNode | undefined {
    return this.$slots.anchor?.[0];
  }

  private sendContentToTarget(): void {
    if (this.$slots.default) {
      const from = this.source;
      const to = this.target;
      const passengers = this.$slots.default;

      Wormhole.open({ from, to, passengers });
    } else {
      this.close();
    }
  }

  private close(): void {
    Wormhole.close({ from: this.source, to: this.target });
  }
}

document.addEventListener('keydown', (event) => {
  // notify the top opened popup only.
  const lastOpenStargate = Stargate.openedInstances
    .slice()
    .reverse()
    .find((x) => x.$slots.default);

  lastOpenStargate?.$emit('bodyKeyDown', event);
});

export { Stargate };
