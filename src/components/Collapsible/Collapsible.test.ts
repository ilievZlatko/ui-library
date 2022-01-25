import { mount, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { Collapsible } from './Collapsible';

describe(Collapsible, () => {
  const dummyHeight = 300;

  // tslint:disable-next-line: typedef
  const clientHeightImpl = jest.fn(function(this: HTMLDivElement) {
    return parseInt((this.children[0] as HTMLDivElement).style.height!, 10);
  });

  const heightSpy = jest.spyOn(HTMLDivElement.prototype, 'clientHeight', 'get').mockImplementation(clientHeightImpl);
  const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    callback(0);

    return 0;
  });

  afterAll(() => {
    heightSpy.mockReset();
    rafSpy.mockReset();
  });

  afterEach(() => {
    clientHeightImpl.mockClear();
  });

  it('renders', () => {
    const wrapper = renderComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders custom title', () => {
    const wrapper = renderComponent({ title: 'Test' });
    expect(wrapper.find('.lp-collapsible-title').text()).toContain('Test');
  });

  it('renders custom icon', () => {
    const wrapper = renderComponent({ icon: Icon.Type.INFO });
    expect(wrapper.find('.user-icon').exists()).toBe(true);
  });

  it('renders action slot', () => {
    const wrapper = renderComponent();
    expect(wrapper.find('.test-action').exists()).toBe(true);
  });

  it("renders content when collapsed with content's height set to 0", () => {
    const wrapper = renderComponent();
    expect(wrapper.find('.lp-collapsible').element.style.height).toBe(`${Collapsible.TITLE_HEIGHT}px`);
  });

  it("renders content when expanded by default with content's height set to auto", () => {
    const wrapper = renderComponent({ title: 'Test', expanded: true });
    expect(wrapper.find('.lp-collapsible').element.style.height).toBe('auto');
  });

  it('sets appropriate styles when active is applied', () => {
    const wrapper = renderComponent({ active: true });
    expect(wrapper.classes()).toContain('active');
  });

  it('sets appropriate styles when embedded is applied', () => {
    const wrapper = renderComponent({ embedded: true });
    expect(wrapper.classes()).toContain('embedded');
  });

  it('toggles collapsed state on clicking title', () => {
    const wrapper = renderComponent();

    wrapper.find('.lp-collapsible-title').trigger('click');

    expect(wrapper.classes()).toContain('expanded');
    expect(wrapper.find('.lp-collapsible').element.style.height).toBe(`${Collapsible.TITLE_HEIGHT + dummyHeight}px`);
  });

  it('toggles collapsed state on expanded property changed', () => {
    const wrapper = renderComponent({ expanded: false });

    expect(wrapper.find('.expanded').exists()).toBe(false);

    wrapper.setProps({ expanded: true });

    expect(wrapper.find('.expanded').exists()).toBe(true);
  });

  it('emits toggle event on clicking title', () => {
    const wrapper = renderComponent();

    expect(wrapper.emitted(Collapsible.EVENT_TOGGLE)).not.toBeDefined();

    wrapper.find('.lp-collapsible-title').trigger('click');

    expect(wrapper.emitted(Collapsible.EVENT_TOGGLE)).toBeDefined();
  });

  it('calculates max-height on toggle', () => {
    const wrapper = renderComponent();

    wrapper.find('.lp-collapsible-title').trigger('click');
    expect(wrapper.find('.lp-collapsible').element.style.height).toBe(`${Collapsible.TITLE_HEIGHT + dummyHeight}px`);

    wrapper.find('.lp-collapsible-title').trigger('click');
    expect(wrapper.find('.lp-collapsible').element.style.height).toBe(`${Collapsible.TITLE_HEIGHT}px`);

    expect(clientHeightImpl).toBeCalledTimes(2);
  });

  function renderComponent(propsData: Collapsible.Props = {}): Wrapper<Collapsible> {
    return mount(Collapsible, {
      propsData,
      slots: {
        action: `<div class="test-action">Action</div>`,
        default: `<div style="height: ${dummyHeight}px"></div>`
      }
    });
  }
});
