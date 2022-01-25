import { shallowMount, Slots, Wrapper } from '@vue/test-utils';
import { Button, OverflowableText } from 'leanplum-lib-ui';
import { SingleColumnLayout } from './SingleColumnLayout';

describe(SingleColumnLayout, (): void => {
  let wrapper: Wrapper<SingleColumnLayout>;

  function renderComponent(props?: object, slots?: Slots): Wrapper<SingleColumnLayout> {
    return shallowMount(SingleColumnLayout, {
      propsData: {
        title: 'Test title',
        ...props
      },
      slots
    });
  }

  it('renders', () => {
    wrapper = renderComponent();

    expect(wrapper.exists()).toBe(true);
  });

  it('renders title', () => {
    wrapper = renderComponent({ title: 'Foo' });

    expect(wrapper.find('.page-title').props('text')).toBe('Foo');
  });

  it('renders subtitle', () => {
    wrapper = renderComponent({ subtitle: 'Foo Bar' });

    expect(wrapper.find('.page-subtitle').props('text')).toBe('Foo Bar');
  });

  it('passes title className', () => {
    wrapper = renderComponent({ titleClassName: 'test' });

    expect(wrapper.find<OverflowableText>(OverflowableText).classes()).toContain('test');
  });

  describe('actions', () => {
    it('renders expected classes by default', () => {
      wrapper = renderComponent();

      expect(wrapper.find('.page-actions').exists()).toBe(true);
    });
  });

  describe('back button', () => {
    const backLink = { to: 'test', text: 'Back' };

    beforeEach(() => {
      wrapper = renderComponent({ backLink });
    });

    it('renders back button', () => {
      expect(wrapper.find(Button).exists()).toBe(true);
      expect(wrapper.find(Button).props().tooltip).toBe(backLink.text);
      expect(wrapper.find(Button).props().to).toBe(backLink.to);
    });

    it('emits "back" event when clicking on back link', () => {
      wrapper.find(Button).vm.$emit('click');
      expect(wrapper.emitted().back).toBeDefined();
    });
  });

  describe('slots', () => {
    beforeEach(() => {
      wrapper = renderComponent(
        {},
        {
          actions: '<div id="actions"></div>',
          default: '<div id="body"></div>',
          infoPanel: '<div id="info-panel"></div>',
          titleSuffix: '<div id="title-suffix"></div>'
        }
      );
    });

    it('renders "actions" slot', () => {
      expect(wrapper.find('.page-actions').exists()).toBe(true);
      expect(wrapper.find('#actions').exists()).toBe(true);
    });

    it('renders "default" slot', () => {
      expect(wrapper.find('#body').exists()).toBe(true);
    });

    it('renders "infoPanel" slot', () => {
      expect(wrapper.find('.info-panel').exists()).toBe(true);
      expect(wrapper.find('#info-panel').exists()).toBe(true);
    });

    it('renders "titleSuffix" slot', () => {
      expect(wrapper.find('.page-title-suffix').exists()).toBe(true);
      expect(wrapper.find('#title-suffix').exists()).toBe(true);
    });
  });
});
