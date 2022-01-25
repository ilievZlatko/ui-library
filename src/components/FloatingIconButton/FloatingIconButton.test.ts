import { mount, Wrapper } from '@vue/test-utils';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';
import { FloatingIconButton } from './FloatingIconButton';

describe(FloatingIconButton, () => {
  it('renders text', (): void => {
    const wrapper = renderComponent({ text: 'Test' });

    expect(wrapper.find('.text').text()).toEqual('Test');
  });

  it('passes color and appearance to nested button', (): void => {
    const color = Button.Color.SUCCESS;
    const appearance = Button.Appearance.OUTLINE;
    const wrapper = renderComponent({
      text: 'Test',
      color,
      appearance
    });
    const button = wrapper.find(Button);

    expect(button.props('text')).toBeFalsy();
    expect(button.props('color')).toEqual(color);
    expect(button.props('appearance')).toEqual(appearance);
  });

  it('passes icon to nested icon', () => {
    const defaultIcon = renderComponent({ text: 'Test' }).find(Icon);
    expect(defaultIcon.props('type')).toEqual(Icon.Type.PLUS);

    const userIcon = renderComponent({ text: 'Test', icon: Icon.Type.USER }).find(Icon);
    expect(userIcon.props('type')).toEqual(Icon.Type.USER);
  });

  it('triggers click event', () => {
    const wrapper = renderComponent({ text: 'Test' });

    wrapper.find('div').trigger('click');

    expect(wrapper.emitted(Button.EVENT_CLICK)).toBeTruthy();
  });

  function renderComponent(propsData: Button.Props): Wrapper<FloatingIconButton> {
    return mount(FloatingIconButton, {
      propsData
    });
  }
});
