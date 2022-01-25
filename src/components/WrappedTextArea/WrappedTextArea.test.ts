import { mount, Wrapper } from '@vue/test-utils';
import { KeyboardConstants } from 'leanplum-lib-common';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';
import { WrappedTextArea } from './WrappedTextArea';

const LABEL: string = 'test label';
const VALUE: string = 'test value';

describe(WrappedTextArea, () => {
  let wrapper: Wrapper<WrappedTextArea>;

  context('in default state', () => {
    beforeEach(() => {
      wrapper = mount(WrappedTextArea, {
        propsData: {
          label: LABEL
        }
      });
    });

    it('renders without error', () => {
      expect(wrapper.contains(WrappedTextArea)).toBeTruthy();
    });

    it('renders label', () => {
      expect(wrapper.html()).toContain(LABEL);
      expect(wrapper.find(LegendWrapper).html()).toContain(LABEL);
      expect(wrapper.find(LegendWrapper).props().label).toEqual(LABEL);
    });

    it('renders collapsed', () => {
      const legendWrapper = wrapper.find<LegendWrapper>(LegendWrapper);
      expect(legendWrapper.vm.expanded).toBe(false);
    });

    it('updates expanded state when a new value prop is passed', () => {
      const legendWrapper = wrapper.find<LegendWrapper>(LegendWrapper).vm;
      expect(legendWrapper.expanded).toBe(false);

      wrapper.setProps({ value: 'foo' });
      expect(legendWrapper.expanded).toBe(true);
    });
  });

  context('with value', () => {
    beforeEach(() => {
      wrapper = mount(WrappedTextArea, {
        propsData: {
          label: LABEL,
          value: VALUE
        }
      });
    });

    it('renders expanded', async () => {
      expect(wrapper.find(LegendWrapper).props().expanded).toEqual(true);
    });

    it("emits 'input' event on keyup", () => {
      wrapper.find('.lp-wrapped-text-area-field').trigger('keyup');
      expect(wrapper.emitted().input).toEqual([[VALUE]]);
    });

    it("emits 'submit' event on ENTER", () => {
      wrapper.find('.lp-wrapped-text-area-field').trigger('keyup', { key: KeyboardConstants.ENTER_KEY });
      expect(wrapper.emitted().submit).toEqual([[VALUE]]);
    });
  });

  it('marks input as readonly if the readonly prop is passed', () => {
    wrapper = mount(WrappedTextArea, {
      propsData: {
        label: LABEL,
        readonly: true
      }
    });

    const textAreaField = wrapper.find('.lp-wrapped-text-area-field');
    expect(textAreaField.attributes().readonly).toEqual('readonly');
  });

  context('with errors', () => {
    beforeEach(() => {
      wrapper = mount(WrappedTextArea, {
        propsData: {
          label: LABEL,
          error: 'i have an error'
        }
      });
    });

    it('renders error icon', () => {
      expect(wrapper.find('.lp-error-icon')).toBeDefined();
    });

    it('renders error', () => {
      expect(wrapper.find(LegendWrapper).props().error).toEqual('i have an error');
    });
  });
});
