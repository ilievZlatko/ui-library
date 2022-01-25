import { shallowMount, Wrapper } from '@vue/test-utils';
import zipWith from 'lodash/zipWith';
import { Icon } from '../icon/Icon';
import { ButtonGroup } from './ButtonGroup';

describe(ButtonGroup, () => {
  let wrapper: Wrapper<ButtonGroup<string>>;

  const icons = [Icon.Type.CHARACTER_ALPHA, Icon.Type.CHARACTER_NUMERIC];

  const options = Array(10)
    .fill(null)
    .map((x, i) => ({ label: `label-${i + 1}`, value: `value-${i + 1}`, icon: icons[i % 10] }));

  beforeEach(() => {
    wrapper = shallowMount<ButtonGroup<string>>(ButtonGroup, {
      propsData: {
        options,
        selected: options[0]
      }
    });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders options', () => {
    zipWith(wrapper.findAll(`.${ButtonGroup.CLASS_PANEL}`).wrappers, options, (panel, option) => {
      expect(panel.text()).toBe(option.label);
    });
  });

  it.only('renders icons', () => {
    const icon = wrapper
      .findAll(`.${ButtonGroup.CLASS_PANEL}`)
      .at(0)
      .find(Icon);

    expect(icon.exists()).toBe(true);
    expect(icon.props('type')).toEqual(Icon.Type.CHARACTER_ALPHA);
  });

  it('applies selected styles to appropriate element', () => {
    expect(
      wrapper
        .findAll(`.${ButtonGroup.CLASS_PANEL}`)
        .at(0)
        .classes()
    ).toContain('selected');
  });

  it(`emits ${ButtonGroup.EVENT_CHANGE} on click`, () => {
    wrapper
      .findAll(`.${ButtonGroup.CLASS_PANEL}`)
      .at(5)
      .trigger('click');
    expect(wrapper.emitted(ButtonGroup.EVENT_CHANGE)).toMatchObject([[options[5]]]);
  });

  it(`does not emit ${ButtonGroup.EVENT_CHANGE} on click when disabled`, () => {
    wrapper.setProps({ disabled: true });
    wrapper
      .findAll(`.${ButtonGroup.CLASS_PANEL}`)
      .at(5)
      .trigger('click');
    expect(wrapper.emitted(ButtonGroup.EVENT_CHANGE)).toBeUndefined();
  });
});
