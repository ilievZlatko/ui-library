import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Badge } from '../Badge/Badge';
import { Icon } from '../icon/Icon';
import { TabStrip } from './TabStrip';

@Component({ name: 'Harness' })
class Harness extends Vue {
  @Prop({ required: true })
  active: number;

  @Prop({ required: false })
  headersOverride: Array<TabStrip.Header>;

  defaultHeaders: Array<TabStrip.Header> = [
    { title: 'Tab #1' },
    { title: 'Tab #2' },
    { title: 'Tab #3' },
    { title: 'Tab #4' }
  ];

  render(): VNode {
    return (
      <div>
        <TabStrip
          active={this.active}
          headers={this.headersOverride || this.defaultHeaders}
          onTabChange={this.onTabChange}
        >
          {this.defaultHeaders.map(({ title }) => <p>{title} content</p>)}
        </TabStrip>
      </div>
    );
  }

  onTabChange(index: number): void {
    if (index !== this.active) {
      this.$emit('tabChange', index);
    }
  }
}

describe(TabStrip, () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    // tslint:disable-next-line:no-empty
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('renders titles correctly without error', (): void => {
    const wrapper: Wrapper<Harness> = renderComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();

    const tabTitles: WrapperArray<Vue> = wrapper.findAll('.lp-tab-strip-title > span');
    (wrapper.find(TabStrip).vm.$props.headers.map((header: TabStrip.Header) => header.title) as Array<string>).forEach(
      (title: string, index: number): void => {
        expect(tabTitles.at(index).element.innerHTML).toBe(title);
      }
    );
  });

  it('renders icons', () => {
    const wrapper: Wrapper<Harness> = renderComponent(0, [
      { title: 'Title 1', icon: Icon.Type.SEARCH },
      { title: 'Title 1', icon: Icon.Type.SEARCH }
    ]);
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.findAll('.lp-icon').length).toEqual(2);
  });

  it('renders subtitles', () => {
    const wrapper: Wrapper<Harness> = renderComponent(0, [
      { title: 'Title 1', subtitle: 'subtitle' },
      { title: 'Title 1', subtitle: 'subtitle' }
    ]);
    expect(wrapper.isVueInstance()).toBeTruthy();
    const subtitles = wrapper.findAll('.lp-tab-strip-subtitle > span');
    expect(subtitles.at(0).element.innerHTML).toBe('subtitle');
    expect(subtitles.at(1).element.innerHTML).toBe('subtitle');
  });

  it('renders badges', () => {
    const wrapper: Wrapper<Harness> = renderComponent(0, [
      { title: 'Title 1', badge: 'badge1' },
      { title: 'Title 1', badge: 'badge2' }
    ]);

    const badges = wrapper.findAll(Badge);
    expect(badges.length).toBe(2);
    expect(badges.at(0).text()).toContain('badge1');
    expect(badges.at(1).text()).toContain('badge2');
  });

  it('renders the active / inactive state correctly', () => {
    const activeIndex: number = 1;
    const wrapper = renderComponent(activeIndex);

    wrapper.findAll('.lp-tab-strip-header').wrappers.forEach((titleWrapper, index) => {
      if (activeIndex === index) {
        expect(titleWrapper.classes()).toContain('active');
      } else {
        expect(titleWrapper.classes()).not.toContain('active');
      }
    });
  });

  it("emits 'tabChange' event correctly", async () => {
    const wrapper: Wrapper<Harness> = renderComponent();

    // when active tab is clicked
    wrapper
      .findAll('.lp-tab-strip-title')
      .at(0)
      .trigger('click');

    // then should emit nothing
    expect(wrapper.emitted().tabChange).toBe(undefined);

    // AND when inactive tab is clicked
    const clickedTabIndex = 1;
    wrapper
      .findAll('.lp-tab-strip-title')
      .at(clickedTabIndex)
      .trigger('click');

    // then should emit 'tabChange' event
    expect(wrapper.emitted().tabChange[0][0]).toBe(clickedTabIndex);
  });

  it('throws a validator error if number of tiles mismatches number of slots', () => {
    renderComponent(undefined, [{ title: 'Tab #1' }, { title: 'Tab #2' }]);

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toMatch('Mismatched number of headers and number of slots');
  });

  function renderComponent(active: number = 0, headersOverride?: Array<TabStrip.Header>): Wrapper<Harness> {
    return mount(Harness, {
      propsData: { active, headersOverride }
    });
  }
});
