import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Stargate } from './Stargate';
import { StargateTarget } from './StargateTarget';

@Component({ name: 'CustomTestingHarness' })
class CustomTestingHarness extends Vue {
  @Prop({ required: false, default: false })
  opened: boolean;

  render(): VNode {
    return (
      <div>
        <Stargate onBodyKeyDown={() => this.$emit('outerKeyDown')}>
          <div>
            <span>Test</span>
            {this.opened && (
              <Stargate onBodyKeyDown={() => this.$emit('innerKeyDown')}>
                <div>Test</div>
              </Stargate>
            )}
          </div>
        </Stargate>
        <StargateTarget />
      </div>
    );
  }
}

describe(Stargate, (): void => {
  let wrapper: Wrapper<CustomTestingHarness>;

  function renderComponent(): Wrapper<CustomTestingHarness> {
    return mount(CustomTestingHarness);
  }

  beforeEach(() => {
    wrapper = renderComponent();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('emits keydown to the outer stargate when inner is not opened', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    expect(wrapper.emitted().outerKeyDown).toBeDefined();
    expect(wrapper.emitted().innerKeyDown).not.toBeDefined();
  });

  it('emits keydown to the inner stargate when opened', () => {
    wrapper.setProps({ opened: true });

    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    expect(wrapper.emitted().outerKeyDown).not.toBeDefined();
    expect(wrapper.emitted().innerKeyDown).toBeDefined();
  });
});
