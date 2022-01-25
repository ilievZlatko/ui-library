import { shallowMount, Wrapper } from '@vue/test-utils';
import { DevicePreview } from './DevicePreview';

describe(DevicePreview, () => {
  let wrapper: Wrapper<DevicePreview>;

  describe('portrait orientation', () => {
    beforeEach(() => {
      wrapper = shallowMount(DevicePreview, {});
    });

    it('renders correctly', () => {
      expect(wrapper.contains(DevicePreview)).toBe(true);
    });

    it('has the default width and height', () => {
      expect(wrapper.props('width')).toEqual(400);
      expect(wrapper.props('height')).toEqual(800);
      expect(wrapper.find('.device-preview-frame').attributes().style).toContain('width: 400px; height: 800px;');
    });

    it('should have default orientation set to portrait', () => {
      expect(wrapper.props('orientation')).toEqual('portrait');
    });
  });

  describe('landscape orientation', () => {
    beforeEach(() => {
      wrapper = shallowMount(DevicePreview, {
        propsData: {
          orientation: 'landscape'
        }
      });
    });

    it('has the default width and height', () => {
      expect(wrapper.props('width')).toEqual(400);
      expect(wrapper.props('height')).toEqual(800);
      expect(wrapper.find('.device-preview-frame').attributes().style).toContain('width: 800px; height: 400px;');
    });

    it('should have orientation set to landscape', () => {
      expect(wrapper.props('orientation')).toEqual('landscape');
    });
  });
});
