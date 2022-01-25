import { mount, Wrapper } from '@vue/test-utils';
import { CreateElement, VNode } from 'vue';
import { Feedback } from './Feedback';

describe(
  Feedback,
  (): void => {
    let wrapper: Wrapper<Feedback>;

    context('with defaults', () => {
      beforeEach(() => {
        wrapper = mount(Feedback, {});
      });

      it('does not render title', (): void => {
        expect(wrapper.find('p.title').exists()).toBe(false);
      });

      it('does not render message', (): void => {
        expect(wrapper.find('p.message').exists()).toBe(false);
      });

      it('does not render arrow', (): void => {
        expect(wrapper.find('.arrow').exists()).toBe(false);
      });
    });

    context('with data', () => {
      const title = 'Title';
      const message = 'Message';
      const type = Feedback.Type.ERROR;

      beforeEach(() => {
        wrapper = mount(Feedback, {
          propsData: {
            title,
            message,
            type,
            showArrow: true
          }
        });
      });

      it('renders title', (): void => {
        expect(wrapper.find('p.title').exists()).toBe(true);
      });

      it('renders arrow', (): void => {
        expect(wrapper.find('.arrow').exists()).toBe(true);
      });

      it('renders message', (): void => {
        expect(wrapper.find('p.message').exists()).toBe(true);
      });

      it('renders correct class depending on types', (): void => {
        wrapper.setProps({
          type: Feedback.Type.ERROR
        });
        expect(wrapper.find('.lp-feedback').classes()).toContain('error');
      });

      it('renders slot content', (): void => {
        const wrapper: Wrapper<Feedback> = mount(Feedback, {
          slots: {
            default: {
              render(h: CreateElement): VNode {
                return <div class="foo" />;
              }
            }
          },
          propsData: {
            title,
            message,
            type
          }
        });
        expect(wrapper.find('.foo').exists()).toBe(true);
      });
    });
  }
);
