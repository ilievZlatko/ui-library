import { mount, RouterLinkStub, Wrapper } from '@vue/test-utils';
import { Badge } from '../Badge/Badge';
import { Icon } from '../icon/Icon';
import { Button } from './Button';

describe('Button', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    // tslint:disable-next-line:no-empty
    spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('renders without error', (): void => {
    const wrapper = renderComponent({ text: 'Test' });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('throws if neither text or icon are specified', () => {
    expect(() => renderComponent({})).toThrow();
  });

  it('throws a validator error for invalid type', () => {
    // Using 'as any' to forcefully pass an invalid type.
    // tslint:disable-next-line:no-any
    renderComponent({ text: 'Hello', type: 'foo' } as any);

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toMatch(/Invalid prop: custom validator check failed for prop \"type\"/);
  });

  it('throws a validator error for invalid color', () => {
    // Using 'as any' to forcefully pass an invalid color.
    // tslint:disable-next-line:no-any
    renderComponent({ text: 'Hello', color: 'brown' } as any);

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toMatch(/Invalid prop: custom validator check failed for prop \"color\"/);
  });

  it('renders the correct class names', () => {
    expect(
      renderComponent({
        color: Button.Color.PRIMARY,
        appearance: Button.Appearance.NORMAL,
        disabled: false,
        text: '_'
      }).classes()
    ).toMatchObject(['lp-button', 'color-primary', 'normal', 'enabled']);

    expect(
      renderComponent({
        color: Button.Color.PRIMARY,
        appearance: Button.Appearance.NORMAL,
        disabled: true,
        text: '_'
      }).classes()
    ).toMatchObject(['lp-button', 'color-primary', 'normal', 'disabled']);

    expect(
      renderComponent({
        color: Button.Color.PRIMARY,
        appearance: Button.Appearance.OUTLINE,
        disabled: false,
        text: '_'
      }).classes()
    ).toMatchObject(['lp-button', 'color-primary', 'outline', 'enabled']);

    expect(
      renderComponent({
        color: Button.Color.PRIMARY,
        appearance: Button.Appearance.OUTLINE,
        disabled: true,
        text: '_'
      }).classes()
    ).toMatchObject(['lp-button', 'color-primary', 'outline', 'disabled']);

    expect(
      renderComponent({
        color: Button.Color.PRIMARY,
        appearance: Button.Appearance.LIGHTEN,
        disabled: false,
        text: '_'
      }).classes()
    ).toMatchObject(['lp-button', 'color-primary', 'lighten', 'enabled']);

    expect(
      renderComponent({
        color: Button.Color.PRIMARY,
        appearance: Button.Appearance.LIGHTEN,
        disabled: true,
        text: '_'
      }).classes()
    ).toMatchObject(['lp-button', 'color-primary', 'lighten', 'disabled']);

    expect(
      renderComponent({ color: Button.Color.PRIMARY, disabled: false, text: '_', loading: true }).classes()
    ).toMatchObject(['lp-button', 'color-primary', 'normal', 'enabled', 'loading']);
  });

  it('renders the correct button type', () => {
    expect(
      renderComponent({ type: Button.Type.BUTTON, text: 'Test' })
        .find('button')
        .attributes('type')
    ).toEqual('button');
    expect(
      renderComponent({ type: Button.Type.SUBMIT, text: 'Test' })
        .find('button')
        .attributes('type')
    ).toEqual('submit');
    expect(
      renderComponent({ type: Button.Type.FILE, text: 'Test' })
        .find('button')
        .attributes('type')
    ).toEqual('button');
  });

  it('does not render file input by default', () => {
    expect(
      renderComponent({ type: Button.Type.BUTTON, text: 'Test' })
        .find('.btn-file-input')
        .exists()
    ).toBeFalsy();
    expect(
      renderComponent({ type: Button.Type.SUBMIT, text: 'Test' })
        .find('.btn-file-input')
        .exists()
    ).toBeFalsy();
  });

  describe('file mode', () => {
    it('renders file input', () => {
      const wrapper = renderComponent({ text: 'Test', type: Button.Type.FILE });

      expect(wrapper.find('.btn-file-input').exists()).toBeTruthy();
    });

    it('renders disabled file input when the button is disabled', () => {
      const wrapper = renderComponent({ text: 'Test', type: Button.Type.FILE, disabled: true });

      expect(wrapper.find('.btn-file-input').attributes('disabled')).toBeTruthy();
    });

    it('emits event on file selection', () => {
      const file: Partial<File> = { name: 'foo.txt', size: 123 };
      const wrapper = renderComponent({ text: 'Test', type: Button.Type.FILE });

      wrapper.setMethods({ getSelectedFile: () => file });
      wrapper.find('.btn-file-input').trigger('change');

      expect(wrapper.emitted(Button.EVENT_FILE)).toBeTruthy();
      expect(wrapper.emitted(Button.EVENT_FILE)[0][0]).toBe(file);
    });
  });

  describe('icon-only', () => {
    it('renders as icon when only icon is specified', () => {
      expect(renderComponent({ icon: Icon.Type.INFO }).classes('icon-only')).toBeTruthy();
    });

    it('does not render as icon with text', () => {
      expect(renderComponent({ icon: Icon.Type.INFO, text: 'Test' }).classes('icon-only')).toBeFalsy();
    });
  });

  describe('icon placement', () => {
    it('renders correctly by default', () => {
      const wrapper = renderComponent({ text: 'Test', badge: '123', icon: Icon.Type.INFO });
      const [badge, icon, text] = wrapper.findAll('.lp-btn-content > *').wrappers;

      expect(badge.classes('lp-badge')).toBe(true);
      expect(icon.classes('icon')).toBe(true);
      expect(text.classes('text')).toBe(true);
    });

    it('renders correctly when reversed', () => {
      const wrapper = renderComponent({
        text: 'Test',
        badge: '123',
        icon: Icon.Type.INFO,
        iconPlacement: Button.IconPlacement.RIGHT
      });
      const [badge, text, icon] = wrapper.findAll('.lp-btn-content > *').wrappers;

      expect(badge.classes('lp-badge')).toBe(true);
      expect(icon.classes('icon')).toBe(true);
      expect(text.classes('text')).toBe(true);
      expect(wrapper.find('.lp-btn-content').classes('reverse')).toBeTruthy();
    });
  });

  describe('indicator', () => {
    const wrapper = renderComponent({ text: 'Test', dotIndicator: Button.Color.WARNING });

    it('renders', () => {
      expect(wrapper.contains('.btn-dot-indicator')).toBe(true);
    });

    it('applies color class', () => {
      expect(wrapper.find('.btn-dot-indicator').classes()).toContain('indicator-warning');
    });
  });

  describe('loading', () => {
    const wrapper = renderComponent({ text: 'Test', loading: true });

    it('renders loading spinner', () => {
      expect(wrapper.find('button').contains('.loading-spinner')).toBeTruthy();
    });

    it('adds "loading" class', () => {
      expect(wrapper.find('button').classes('loading')).toBeTruthy();
    });

    it('disables button while loading', () => {
      expect(wrapper.find('button').attributes('disabled')).toBe('disabled');
    });
  });

  describe('disabled', () => {
    const wrapper = renderComponent({ text: 'Test', disabled: true });

    it('adds "disabled" attribute', () => {
      expect(wrapper.find('button').attributes('disabled')).toBe('disabled');
    });

    it('adds "disabled" class', () => {
      expect(wrapper.find('button').classes('disabled')).toBeTruthy();
    });

    it('removes "enabled" class', () => {
      expect(wrapper.find('button').classes('enabled')).toBeFalsy();
    });
  });

  describe('to', () => {
    it('renders link', () => {
      const to = { name: 'location' };
      const wrapper = renderComponent({ text: 'Test', to });
      expect(wrapper.find(RouterLinkStub).props().to).toMatchObject(to);
    });

    it('renders button if disabled', () => {
      const to = { name: 'location' };
      const wrapper = renderComponent({ text: 'Test', to, disabled: true });
      expect(wrapper.contains('button')).toBe(true);
      expect(wrapper.contains(RouterLinkStub)).toBe(false);
    });
  });

  it('shows badge', () => {
    const wrapper = renderComponent({ text: 'Test', badge: '3' });
    expect(wrapper.contains(Badge)).toBe(true);
  });

  function renderComponent(propsData: Button.Props): Wrapper<Button> {
    return mount(Button, {
      propsData,
      stubs: { 'router-link': RouterLinkStub }
    });
  }
});
