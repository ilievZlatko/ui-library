import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { KeyboardConstants } from 'leanplum-lib-common';
import PortalVue from 'portal-vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TextInput } from '../TextInput/TextInput';
import { Tooltip } from '../Tooltip/Tooltip';
import { Dropdown } from './Dropdown';

@Component({ name: 'PopupHarness' })
class PopupHarness extends Vue {
  @Prop({ type: Array, required: true })
  readonly options: Array<Dropdown.Item> | Array<string>;

  @Prop({ type: String, required: true })
  readonly filter: string;

  @Prop({ type: Boolean, required: true })
  readonly alignWidths: string;

  @Prop({ type: String, required: false, default: AnchoredPopup.Placement.BOTTOM_START })
  readonly popupPlacement: AnchoredPopup.Placement;

  @Prop({ type: [Object, String], required: false, default: null })
  readonly selectedItem: Dropdown.Item | string | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly enableSearch: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly closeOnMouseLeave: boolean;

  render(): VNode {
    return (
      <div>
        <Dropdown
          options={this.options}
          closeOnMouseLeave={this.closeOnMouseLeave}
          filter={this.filter}
          alignWidths={this.alignWidths}
          popupPlacement={this.popupPlacement}
          selectedItem={this.selectedItem}
          enableSearch={this.enableSearch}
          onSelect={this.onSelect}
        >
          {this.$slots.default ? this.$slots.default : <Icon type={Icon.Type.CLOSE} />}
          {this.$slots.header ? <template slot="header">{this.$slots.header}</template> : null}
        </Dropdown>
        <StargateTarget />
      </div>
    );
  }

  protected onSelect(value: Dropdown.Item | string): void {
    this.$emit('select', value);
  }
}

describe(Dropdown, (): void => {
  let wrapper: Wrapper<PopupHarness>;

  function renderComponent(
    props: {
      alignWidths?: boolean;
      filter?: string;
      options?: Array<Dropdown.Item | Dropdown.HeaderSeparator> | Array<string>;
      selectedItem?: string;
      popupPlacement?: AnchoredPopup.Placement;
      loading?: boolean;
      closeOnMouseLeave?: boolean;
      enableSearch?: boolean;
    } = {},
    slots: {} = {}
  ): void {
    const localVue = createLocalVue();
    localVue.use(PortalVue);

    wrapper = mount(PopupHarness, {
      slots,
      propsData: {
        alignWidths: false,
        filter: '',
        options: [],
        enableSearch: true,
        ...props
      },
      attachToDocument: true,
      localVue
    });
  }

  afterEach(() => wrapper.destroy());

  describe('default', () => {
    beforeEach(() => renderComponent());

    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('opens the popup when the options list is empty and a key is pressed', () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);

      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(true);
    });

    it('passes no align widths param', async () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.alignWidths).toBe(false);
    });

    it('passes default popup placement', async () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.placement).toBe(AnchoredPopup.Placement.BOTTOM_START);
    });
  });

  describe('with search enabled', () => {
    beforeEach(() => renderComponent({ enableSearch: true, options: ['1', '2', '3'] }));

    it('renders search input', async () => {
      await openDropdown();

      expect(wrapper.contains(TextInput)).toBe(true);
    });

    it('filters items on search', async () => {
      await openDropdown();

      wrapper.find<TextInput>(TextInput).vm.$emit('input', '1');
      expect(wrapper.findAll('.dropdown-item').length).toBe(1);
    });
  });

  describe('with align widths', () => {
    beforeEach(() => renderComponent({ alignWidths: true }));

    it('passes the align widths param', async () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.alignWidths).toBe(true);
    });
  });

  describe('with custom popup placement', () => {
    beforeEach(() => renderComponent({ popupPlacement: AnchoredPopup.Placement.TOP }));

    it('passes the custom popup placement', async () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.placement).toBe(AnchoredPopup.Placement.TOP);
    });
  });

  describe('with string options', () => {
    const OPTIONS = ['alpha', 'beta', 'gamma', 'delta'];

    beforeEach(() => renderComponent({ options: OPTIONS }));

    it('selects first item when opened with keyboard', async () => {
      const anchor = wrapper.find('.lp-icon');
      anchor.trigger('focusin');
      // Dropdown should always emit 'select' on ENTER key if it is opened.
      // No extra keys should be required (up, down, etc.)
      await wrapper.vm.$nextTick();
      anchor.trigger('keyup', { key: KeyboardConstants.ENTER_KEY });
      await wrapper.vm.$nextTick();

      const eventInfo = wrapper.find<Dropdown>(Dropdown).emitted('select');
      expect(eventInfo).toBeDefined();
      expect(eventInfo[0][0]).toBe('alpha');
    });

    it('selects last item when navigated beyond end of list', async () => {
      const anchor = wrapper.find('.lp-icon');
      for (let i = 0; i <= OPTIONS.length + 1; i++) {
        anchor.trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      }
      await wrapper.vm.$nextTick();
      anchor.trigger('keyup', { key: KeyboardConstants.ENTER_KEY });
      await wrapper.vm.$nextTick();

      const eventInfo = wrapper.find<Dropdown>(Dropdown).emitted('select');
      expect(eventInfo).toBeDefined();
      expect(eventInfo[0][0]).toBe('delta');
    });

    it('selects item on mouse down', async () => {
      await openDropdown();

      wrapper
        .findAll('.dropdown-item')
        .filter((x) => x.text() === 'gamma')
        .at(0)
        .trigger('mousedown');

      const eventInfo = wrapper.find<Dropdown>(Dropdown).emitted('select');
      expect(eventInfo).toBeDefined();
      expect(eventInfo[0][0]).toBe('gamma');
    });

    it('marks the specified item as selected', async () => {
      await openDropdown();
      wrapper.setProps({ selectedItem: 'beta' });
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.dropdown-item.selected').text()).toEqual('beta');
    });

    it('emits the correct value on select', async () => {
      await openDropdown();
      wrapper.setProps({ selectedItem: 'beta' });
      await wrapper.vm.$nextTick();
      wrapper.find('.lp-icon').trigger('keyup', { key: KeyboardConstants.ENTER_KEY });
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('select')).toEqual([['beta']]);
    });

    it('opens the popup when a key is pressed', () => {
      wrapper.vm.$el.querySelector = jest.fn().mockReturnValue({ scrollIntoView: jest.fn() });
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);

      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(true);
    });

    it('opens the popup when the anchor is focused', () => {
      wrapper.vm.$el.querySelector = jest.fn().mockReturnValue({ scrollIntoView: jest.fn() });
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);

      wrapper.find('.lp-icon').trigger('focusin');

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(true);
    });

    it('opens the popup when the anchor is clicked', () => {
      wrapper.vm.$el.querySelector = jest.fn().mockReturnValue({ scrollIntoView: jest.fn() });
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);

      wrapper.find('.lp-icon').trigger('click');

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(true);
    });

    it('closes the popup when the escape key is pressed', () => {
      wrapper.vm.$el.querySelector = jest.fn().mockReturnValue({ scrollIntoView: jest.fn() });
      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(true);

      wrapper.find('.lp-icon').trigger('keyup', { key: KeyboardConstants.ESC_KEY });

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
    });

    it('applies filter to options', async () => {
      expect(wrapper.find<Dropdown>(Dropdown).vm.visibleOptions.length).toBe(4);

      wrapper.setProps({ filter: 'abcd' });
      await wrapper.vm.$nextTick();

      expect(wrapper.find<Dropdown>(Dropdown).vm.visibleOptions.length).toBe(0);
    });
  });

  describe('with preselected item', () => {
    const OPTIONS = ['alpha', 'beta', 'gamma', 'delta'];

    beforeEach(() => renderComponent({ options: OPTIONS, selectedItem: 'gamma' }));

    it('marks the specified item as selected', async () => {
      await openDropdown();

      expect(wrapper.find('.dropdown-item.selected').text()).toEqual('gamma');
    });
  });

  describe('with object options', () => {
    const OPTIONS = [
      {
        label: 'alpha',
        value: 'A'
      },
      {
        label: 'beta',
        value: 'B1'
      },
      {
        label: 'beta',
        value: 'B2'
      },
      {
        label: 'beta',
        value: 'B3'
      }
    ];

    beforeEach(() => renderComponent({ options: OPTIONS }));

    it('emits the correct value on select', async () => {
      wrapper.find('.lp-icon').trigger('focusin');
      await wrapper.vm.$nextTick();
      wrapper.setProps({ selectedItem: { value: 'B2' } });
      await wrapper.vm.$nextTick();
      wrapper.find('.lp-icon').trigger('keyup', { key: KeyboardConstants.ENTER_KEY });
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('select')).toEqual([[OPTIONS[2]]]);
    });
  });

  describe('with slots and object options', () => {
    beforeEach(() =>
      renderComponent(
        {
          options: [{ label: 'test' }]
        },
        {
          default: '<div class="default-slot-item">test</div>',
          header: '<div class="header-slot-item">test</div>'
        }
      )
    );

    it('renders default slot', () => {
      expect(wrapper.find('.default-slot-item').exists()).toBe(true);
    });

    it('renders header slot', async () => {
      wrapper.find('.default-slot-item').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.header-slot-item').exists()).toBe(true);
    });
  });

  describe('with icons', () => {
    beforeEach(() =>
      renderComponent({
        options: [
          { label: 'plus', icon: Icon.Type.PLUS },
          { label: 'undo', icon: Icon.Type.UNDO }
        ]
      })
    );

    it('renders icons', async () => {
      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();
      expect(wrapper.find(Icon).exists()).toBe(true);
    });
  });

  describe('disabled item', () => {
    beforeEach(() => {
      renderComponent({ options: [{ label: 'test', disabled: true, disabledReason: 'test2' }] });
    });

    it('does not emit disable item', async () => {
      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();
      wrapper.find('li').trigger('click');
      expect(wrapper.emitted().select).toBeUndefined();
    });

    it('renders disabled reason', async () => {
      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();
      // First tooltip is in the search input field in the dropdown.
      expect(wrapper.findAll<Tooltip>(Tooltip).at(1).vm.message).toBe('test2');
    });
  });

  describe('custom renderer', () => {
    it('renders using custom renderer if passed', async () => {
      renderComponent({
        options: [
          { label: 'test', customRenderer: () => new Vue().$createElement('div', { attrs: { id: 'testcontent' } }) }
        ]
      });
      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();
      expect(wrapper.contains('#testcontent')).toBe(true);
    });
  });

  describe('closeOnMouseLeave', () => {
    beforeEach(() => {
      renderComponent({
        closeOnMouseLeave: true,
        options: [
          { label: 'plus', icon: Icon.Type.PLUS },
          { label: 'undo', icon: Icon.Type.UNDO }
        ]
      });

      return openDropdown();
    });

    it('closes on anchor leave', () => {
      wrapper.find(AnchoredPopup).vm.$emit(AnchoredPopup.EVENT_ANCHOR_LEAVE);
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
    });

    it('closes on popup leave', () => {
      wrapper.find('.lp-dropdown-popup').trigger('mouseleave');
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
    });
  });

  describe('header separator', () => {
    beforeEach(async () => {
      renderComponent({
        options: [
          { header: 'header', subheader: 'subheader' },
          { label: 'test' },
          { header: 'header2', subheader: 'subheader2' },
          { label: 'test2' },
          { header: 'header3', subheader: 'subheader3' }
        ]
      });

      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();
    });

    it('renders headers', () => {
      const {
        wrappers: [h1, h2, h3]
      } = wrapper.findAll('.dropdown-header');

      expect(h1.text()).toBe('header');
      expect(h2.text()).toBe('header2');
      expect(h3.text()).toBe('header3');
    });

    it('renders subheaders', () => {
      const {
        wrappers: [h1, h2, h3]
      } = wrapper.findAll('.dropdown-subheader');

      expect(h1.text()).toBe('subheader');
      expect(h2.text()).toBe('subheader2');
      expect(h3.text()).toBe('subheader3');
    });

    it('focuses first non header item', () => {
      const {
        wrappers: [h1, i1, ...rest]
      } = wrapper.findAll('li');

      expect(i1.classes()).toContain('focused');

      for (const option of [h1, ...rest]) {
        expect(option.classes()).not.toContain('focused');
      }
    });

    it('skips headers when navigating with keyboard', async () => {
      const {
        wrappers: [h1, i1, h2, i2, h3]
      } = wrapper.findAll('li');

      expect(i1.classes()).toContain('focused');

      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_UP_KEY });
      await wrapper.vm.$nextTick();

      // Should not change
      expect(i1.classes()).toContain('focused');
      expect(h1.classes()).not.toContain('focused');

      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();

      expect(i1.classes()).not.toContain('focused');
      expect(h2.classes()).not.toContain('focused');
      expect(i2.classes()).toContain('focused');

      wrapper.find('.lp-icon').trigger('keydown', { key: KeyboardConstants.ARROW_DOWN_KEY });
      await wrapper.vm.$nextTick();

      // Should not change
      expect(i2.classes()).toContain('focused');
      expect(h3.classes()).not.toContain('focused');
    });

    it('keeps focused index on options update if its an item', () => {
      const {
        wrappers: [, i1]
      } = wrapper.findAll('li');

      expect(i1.classes()).toContain('focused');

      wrapper.setProps({ options: [{ label: 'test' }, { label: 'test' }] });

      const {
        wrappers: [i21, i22]
      } = wrapper.findAll('li');

      expect(i21.classes()).not.toContain('focused');
      expect(i22.classes()).toContain('focused');
    });

    it('updates focused index on options update if its an header to first item', () => {
      const {
        wrappers: [, i1]
      } = wrapper.findAll('li');

      expect(i1.classes()).toContain('focused');

      wrapper.setProps({ options: [{ label: 'test' }, { header: 'test' }] });

      const {
        wrappers: [i21, i22]
      } = wrapper.findAll('li');

      expect(i21.classes()).toContain('focused');
      expect(i22.classes()).not.toContain('focused');
    });
  });

  function openDropdown(): Promise<void> {
    wrapper.find('.lp-icon').trigger('focusin');

    return wrapper.vm.$nextTick();
  }
});
