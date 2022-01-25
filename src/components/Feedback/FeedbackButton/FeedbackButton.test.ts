import { mount, RouterLinkStub, Wrapper } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Vue from 'vue';
import { Location } from 'vue-router';
import { FeedbackButton } from './FeedbackButton';

describe(FeedbackButton, () => {
  const ROUTE: Location = { name: 'some_route' };
  const URL = 'https://www.example.com';

  describe('tag', () => {
    it('renders as a button when no link props are passed', () => {
      const wrapper = renderComponent({ text: 'Learn more' });

      expect(wrapper.find(FeedbackButton).element.tagName.toLowerCase()).toEqual(FeedbackButton.Tag.BUTTON);
    });

    it('renders as an anchor when "href" is provided', async () => {
      const wrapper = renderComponent({ text: 'Learn more', href: URL });
      const attrs = ['href', 'target', 'rel'];

      expect(wrapper.find(FeedbackButton).element.tagName.toLowerCase()).toEqual(FeedbackButton.Tag.ANCHOR);
      expect(getAttributes(wrapper.find(FeedbackButton), attrs)).toEqual([URL]);

      // When we set openInNewTab to true.
      wrapper.setProps({ openInNewTab: true });
      await flushPromises();

      // Then it should have target and rel options set.
      expect(getAttributes(wrapper.find(FeedbackButton), attrs)).toEqual([URL, '_blank', 'noreferrer noopener']);
    });

    it('renders as a router link when "to" is provided', () => {
      const wrapper = renderComponent({ text: 'Learn more', to: ROUTE });

      expect(wrapper.find(RouterLinkStub).props().to).toEqual(ROUTE);
    });

    it('renders as an anchor when "to" and "href" are both provided', () => {
      const wrapper = renderComponent({ text: 'Learn more', to: ROUTE, href: URL });

      expect(wrapper.find(RouterLinkStub).exists()).toBeFalsy();
      expect(getAttributes(wrapper.find('a'), ['href'])).toEqual([URL]);
    });

    function getAttributes(wrapperEl: Wrapper<Vue>, attrs: Array<string>): Array<string | null> {
      return attrs.map((attr) => wrapperEl.element.getAttribute(attr)).filter((attr) => attr !== null);
    }
  });

  describe('class names', () => {
    it('renders with correct class names', () => {
      expect(renderAndReturnClassNames({})).toEqual(['feedback-button', 'enabled']);
      expect(renderAndReturnClassNames({ disabled: true })).toContain('disabled');
      expect(renderAndReturnClassNames({ halfWidth: true })).toContain('half-width');
      expect(renderAndReturnClassNames({ secondary: true })).toContain('secondary');
    });

    function renderAndReturnClassNames(props: FeedbackButton.Props): Array<string> {
      return renderComponent(props).classes();
    }
  });

  describe('events', () => {
    it('emits click only when enabled', async () => {
      expect(await renderAndClick({ href: URL, preventDefault: true })).toBeDefined();
      expect(await renderAndClick({ halfWidth: true })).toBeDefined();
      expect(await renderAndClick({ disabled: true })).toBeUndefined();
    });

    // tslint:disable-next-line:no-any
    async function renderAndClick(props: FeedbackButton.Props): Promise<Array<Array<any>>> {
      const wrapper = renderComponent(props);

      wrapper.find(FeedbackButton).trigger('click');
      await flushPromises();

      return wrapper.emitted().click;
    }
  });

  function renderComponent(propsData: FeedbackButton.Props): Wrapper<FeedbackButton> {
    return mount(FeedbackButton, {
      propsData,
      attachToDocument: true,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      }
    });
  }
});
