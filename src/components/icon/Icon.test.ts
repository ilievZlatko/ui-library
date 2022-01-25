import { shallowMount, Slots, Wrapper } from '@vue/test-utils';
import { Icon } from './Icon';

describe(Icon, () => {
  it('renders if valid props are passed', () => {
    assertNoError({
      type: Icon.Type.COPY
    });
    assertNoError({
      type: Icon.Type.COPY,
      size: 30
    });
    assertNoError({
      type: Icon.Type.COPY,
      size: {
        width: 32,
        height: 64
      }
    });
    assertNoError({
      type: Icon.Type.COPY,
      stopPropagation: false
    });
    assertNoError({
      type: Icon.Type.COPY,
      tooltip: '123'
    });

    function assertNoError(props: Icon.Props): void {
      const spy = jest.spyOn(console, 'error');

      expect(spy.mock.calls).toHaveLength(0);

      renderComponent(props);

      expect(spy.mock.calls).toHaveLength(0);

      spy.mockClear();
    }
  });

  it('throws if invalid props are passed', () => {
    assertError(
      {
        type: '1234'
      },
      '[Vue warn]: Invalid prop: custom validator check failed for prop "type".'
    );
    assertError(
      {
        type: Icon.Type.COPY,
        tooltip: 123
      },
      '[Vue warn]: Invalid prop: type check failed for prop "tooltip". Expected String, Object, got Number with value 123.'
    );

    // tslint:disable-next-line:no-any
    function assertError(props: any, errorMessage: string): void {
      // tslint:disable-next-line: no-empty
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });

      expect(spy.mock.calls).toHaveLength(0);

      renderComponent(props);

      expect(spy.mock.calls).toHaveLength(1);
      expect(spy.mock.calls[0][0]).toMatch(errorMessage);

      spy.mockClear();
    }
  });

  it('renders tooltip as raw HTML', () => {
    const wrapper = renderComponent(
      {
        type: Icon.Type.HELP
      },
      {
        tooltip: '<b>Title</b><p class="test-html-tooltip">Test</p>'
      }
    );

    expect(wrapper.contains('.test-html-tooltip')).toBe(true);
  });

  it('emits `click` event on icon click', () => {
    const wrapper = renderComponent({ type: Icon.Type.HELP });

    wrapper.find('.lp-icon').trigger('click');

    expect(wrapper.emitted(Icon.EVENT_CLICK)).toBeDefined();
  });

  it('emits no `click` event when not clickable', () => {
    const wrapper = renderComponent({ type: Icon.Type.HELP, clickable: false });

    wrapper.find('.lp-icon').trigger('click');

    expect(wrapper.emitted(Icon.EVENT_CLICK)).toBeUndefined();
  });
});

function renderComponent(propsData: Icon.Props, slots?: Slots): Wrapper<Icon> {
  return shallowMount(Icon, { propsData, slots });
}
