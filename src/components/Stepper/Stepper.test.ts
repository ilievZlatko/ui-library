import { shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Stepper } from './Stepper';

describe(Stepper, () => {
  it('renders the component', () => {
    const wrapper = renderComponent({ steps: ['Step 1', 'Step 2', 'Step 3'] });

    expect(wrapper.isVueInstance()).toBe(true);
    expect(wrapper.contains(Stepper)).toBe(true);
  });

  it('renders all steps', () => {
    const wrapper = renderComponent({ steps: ['Step 1', 'Step 2', 'Step 3'] });

    expect(wrapper.findAll('li').length).toBe(3);
    expect(wrapper.findAll('.step-number').wrappers.map((x) => x.text())).toEqual(['1', '2', '3']);
    expect(wrapper.findAll('.step-label').wrappers.map((x) => x.text())).toEqual(['Step 1', 'Step 2', 'Step 3']);
  });

  it('renders steps as links', async () => {
    const labels = ['Step 1', 'Step 2', 'Step 3'];
    const steps = labels.map((x) => ({ label: x, link: `#${x.replace(' ', '-')}` }));
    const wrapper = renderComponent({ steps });

    const links = wrapper.findAll('.step-label > a');
    expect(links.length).toEqual(3);
    expect(links.wrappers.map((x) => x.text())).toEqual(labels);
  });

  it('sets the first step as active by default', () => {
    const wrapper = renderComponent({ steps: ['Step 1', 'Step 2', 'Step 3'] });

    expect(
      wrapper
        .findAll('li')
        .at(0)
        .classes()
    ).toContain('active');
  });

  it('allows setting the active step', () => {
    const wrapper = renderComponent({ steps: ['Step 1', 'Step 2', 'Step 3'], activeStepIndex: 1 });

    const steps = wrapper.findAll('li');
    expect(steps.at(0).classes()).not.toContain('active');
    expect(steps.at(1).classes()).toContain('active');
  });

  it('allows custom rendeing of step indicators', async () => {
    const steps = ['Step 1', 'Step 2', 'Step 3'];
    const slotSpy = jest.fn(() => new Vue().$createElement('div', { attrs: { class: 'custom-indicator' } }));
    const wrapper = renderComponent({ steps }, { [Stepper.SLOT_STEP_INDICATOR]: slotSpy });

    expect(wrapper.findAll('.step-indicator > .custom-indicator').length).toEqual(3);
    expect(slotSpy).toHaveBeenCalledTimes(3);
    steps.forEach((label, index) => expect(slotSpy).toHaveBeenCalledWith({ step: { label }, index }));
  });

  it('emits step details on link click', () => {
    const labels = ['Step 1', 'Step 2', 'Step 3'];
    const steps = labels.map((x) => ({ label: x, link: `#${x.toLowerCase().replace(' ', '-')}` }));
    const wrapper = renderComponent({ steps });

    wrapper.findAll('.step-label > a').at(1).trigger('click');

    expect(wrapper.emitted(Stepper.EVENT_CLICK)).toBeDefined();
    expect(wrapper.emitted(Stepper.EVENT_CLICK)[0][0]).toEqual({
      step: {
        label: 'Step 2',
        link: '#step-2'
      },
      index: 1
    });
  });

  function renderComponent(propsData?: object, scopedSlots?: Record<string, Function>): Wrapper<Stepper> {
    return shallowMount(Stepper, { propsData, scopedSlots });
  }
});
