import { mount, shallowMount, Wrapper } from '@vue/test-utils';
import { KeyboardConstants } from 'leanplum-lib-common';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';
import { WrappedTextInput } from './WrappedTextInput';

const LABEL: string = 'test label';
const VALUE: string = 'test value';

describe(WrappedTextInput, () => {
  let wrapper: Wrapper<WrappedTextInput>;

  context('in default state', () => {
    beforeEach(() => {
      wrapper = mount(WrappedTextInput, {
        propsData: {
          label: LABEL
        }
      });
    });

    it('renders without error', () => {
      expect(wrapper.contains(WrappedTextInput)).toBeTruthy();
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
      wrapper = mount(WrappedTextInput, {
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
      wrapper.find('.lp-wrapped-text-input-field').trigger('keyup');
      expect(wrapper.emitted().input).toEqual([[VALUE]]);
    });

    it("emits 'submit' event on ENTER", () => {
      wrapper.find('.lp-wrapped-text-input-field').trigger('keyup', { key: KeyboardConstants.ENTER_KEY });
      expect(wrapper.emitted().submit).toEqual([[VALUE]]);
    });
  });

  it('marks input as readonly if the readonly prop is passed', () => {
    wrapper = mount(WrappedTextInput, {
      propsData: {
        label: LABEL,
        readonly: true
      }
    });

    const inputField = wrapper.find('.lp-wrapped-text-input-field');
    expect(inputField.attributes().readonly).toEqual('readonly');
  });

  context('propagates errors and warnings', () => {
    it('propagates error', () => {
      const error = 'i have an error';
      wrapper = shallowMount(WrappedTextInput, { propsData: { error } });

      expect(wrapper.find(LegendWrapper).props().error).toEqual(error);
    });

    it('propagates warning', () => {
      const warning = 'i have a warning';
      wrapper = shallowMount(WrappedTextInput, { propsData: { warning } });

      expect(wrapper.find(LegendWrapper).props().warning).toEqual(warning);
    });
  });

  it('renders a password field if type=password', () => {
    const wrapper = mount(WrappedTextInput, {
      propsData: {
        type: WrappedTextInput.Type.PASSWORD
      }
    });

    expect(wrapper.find('.lp-wrapped-text-input-field').attributes('type')).toEqual('password');
  });
});
