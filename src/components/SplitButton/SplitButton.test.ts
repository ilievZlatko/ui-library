import { shallowMount, Wrapper } from '@vue/test-utils';
import { Dropdown } from 'leanplum-lib-ui';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';
import { SplitButton } from './SplitButton';

describe(SplitButton, () => {
  let wrapper: Wrapper<SplitButton>;

  const options = [
    { label: 'op1', onClick: jest.fn() },
    { label: 'op2', onClick: jest.fn() },
    { label: 'op3', onClick: jest.fn() }
  ];

  beforeEach(() => {
    wrapper = render({
      options,
      color: SplitButton.Color.PRIMARY
    });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders 2 buttons and a dropdown', () => {
    expect(findButtons().length).toBe(2);
    expect(wrapper.find(Dropdown).exists()).toBe(true);
  });

  it('passes correct props to buttons', () => {
    wrapper.setProps({
      options: [
        { label: '1', icon: Icon.Type.ACTION_APPFUNCTION, disabled: true, disabledReason: 'reason' },
        { label: '2' }
      ]
    });

    const [main, secondary] = findButtons();

    expect(main.props()).toMatchObject({
      text: '1',
      color: SplitButton.Color.PRIMARY,
      icon: Icon.Type.ACTION_APPFUNCTION,
      disabled: true,
      tooltip: 'reason'
    });

    expect(secondary.props()).toMatchObject({
      text: null,
      color: SplitButton.Color.PRIMARY
    });
  });

  it('passes correct props to dropdown button', () => {
    expect(wrapper.find<Dropdown>(Dropdown).props()).toMatchObject({
      options: ['op2', 'op3'].map((label) => ({ label }))
    });
  });

  it('propagates click', () => {
    findButtons()[0].vm.$emit(SplitButton.EVENT_CLICK);
    expect(wrapper.emitted()[SplitButton.EVENT_CLICK]).toBeDefined();
  });

  it('propagates select', () => {
    const item = { label: 'op1', value: 'op1' };
    wrapper.find<Dropdown>(Dropdown).vm.$emit(SplitButton.EVENT_SELECT, item);
    expect(wrapper.emitted()[SplitButton.EVENT_SELECT][0][0]).toMatchObject(item);
  });

  it('disabled secondary button if all dropdown options are disabled', () => {
    wrapper.setProps({
      options: [
        { label: 'po1', disabled: false },
        { label: 'po2', disabled: true }
      ]
    });
    expect(findButtons()[1].vm.disabled).toBe(true);
  });

  describe('loading', () => {
    beforeEach(() => wrapper.setProps({ loading: true }));

    it('renders main button as loading', () => {
      wrapper.setProps({ loading: true });
      const main = findButtons()[0];
      expect(main.props().loading).toBe(true);
    });
  });

  describe('item.onClick', () => {
    it('calls first item.onClick on click', () => {
      const option = options[0];
      option.onClick.mockClear();

      findButtons()[0].vm.$emit('click');
      expect(option.onClick).toHaveBeenCalledTimes(1);
    });

    it(`calls selected item.onClick on select`, () => {
      const option = options[1];
      option.onClick.mockClear();

      wrapper.find(Dropdown).vm.$emit('select', option);
      expect(option.onClick).toHaveBeenCalledTimes(1);
    });
  });

  it('does not render second button & dropdown with only 1 option', () => {
    wrapper.setProps({ options: options.slice(0, 1) });
    expect(wrapper.contains(Dropdown)).toBe(false);
    expect(findButtons()).toHaveLength(1);
  });

  function render(propsData: object): Wrapper<SplitButton> {
    return shallowMount(SplitButton, { propsData });
  }

  function findButtons(): Array<Wrapper<Button>> {
    return wrapper.findAll<Button>(Button).wrappers;
  }
});
