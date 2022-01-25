import { shallowMount, Wrapper } from '@vue/test-utils';
import { Modal } from '../Modal/Modal';
import { Toast } from './Toast';

describe(Toast, () => {
  let wrapper: Wrapper<Toast>;

  beforeEach(() => {
    wrapper = shallowMount(Toast, {
      propsData: {
        message: 'test'
      }
    });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders text', () => {
    expect(wrapper.html()).toContain('test');
  });

  it('propagates close', () => {
    wrapper.find(Modal).vm.$emit('close');
    expect(wrapper.emitted().close).toMatchObject([[]]);
  });

  it('emits close after timeout', async () => {
    await new Promise((r) => setTimeout(r, Toast.OPENED_TIMEOUT));
    expect(wrapper.emitted().close).toMatchObject([[]]);
  });
});
