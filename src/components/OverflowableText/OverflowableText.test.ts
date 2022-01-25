import { shallowMount, Wrapper } from '@vue/test-utils';
import { Tooltip } from 'leanplum-lib-ui';
import { VNode } from 'vue/types/umd';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { OverflowableText } from './OverflowableText';

describe(OverflowableText, () => {
  let wrapper: Wrapper<OverflowableText>;

  function render(text: string, tooltip: string = ''): Wrapper<OverflowableText> {
    return shallowMount(OverflowableText, {
      propsData: {
        text,
        tooltip
      },
      sync: false
    });
  }

  function resizeTo(scrollWidthValue: number, clientWidthValue: number): void {
    const textElement = wrapper.vm.$refs.title;

    // Mock overflow
    Object.defineProperties(textElement, {
      scrollWidth: {
        value: scrollWidthValue
      },
      clientWidth: {
        value: clientWidthValue
      }
    });

    window.dispatchEvent(new Event('resize'));
  }

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => (cb(0), 0));

  beforeEach(() => wrapper = render('test'));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders text', () => {
    expect(wrapper.text()).toBe('test');
  });

  it('renders Tooltip when it overflows', (done) => {
    resizeTo(20, 10);

    // mock debounce
    setTimeout(() => {
      expect(wrapper.find<Tooltip>(Tooltip).exists()).toBe(true);
      expect(wrapper.find<Tooltip>(Tooltip).vm.message).toBe('test');
      done();
    }, 100);
  });

  describe('tooltip', () => {
    beforeEach(() => wrapper = render('test', 'testTooltip'));

    it('renders only custom tooltip when there is no overflow', (done) => {
      resizeTo(20, 30);

      // mock debounce
      setTimeout(() => {
        expect(wrapper.find<Tooltip>(Tooltip).exists()).toBe(true);
        expect(wrapper.find<Tooltip>(Tooltip).vm.message).toBe('testTooltip');
        done();
      }, 100);
    });

    it('renders custom tooltip and overflow text when there is overflow', (done) => {
      resizeTo(20, 10);

      // mock debounce
      setTimeout(() => {
        expect(wrapper.find<Tooltip>(Tooltip).exists()).toBe(true);
        const messageVNode = wrapper.find<Tooltip>(Tooltip).vm.message as unknown as VNode;
        expect(messageVNode.children?.[0].children?.[0].text).toBe('test');
        expect(messageVNode.children?.[2].children?.[0].text).toBe('testTooltip');
        done();
      }, 100);
    });

    describe('tooltipPlacement', () => {
      it('defaults to top', () => {
        expect(wrapper.find<Tooltip>(Tooltip).vm.placement).toBe(AnchoredPopup.Placement.TOP);
      });

      it('passes custom tooltipPlacement from prop', async () => {
        wrapper.setProps({ tooltipPlacement: AnchoredPopup.Placement.BOTTOM });
        await wrapper.vm.$nextTick();
        expect(wrapper.find<Tooltip>(Tooltip).vm.placement).toBe(AnchoredPopup.Placement.BOTTOM);
      });
    });
  });
});
