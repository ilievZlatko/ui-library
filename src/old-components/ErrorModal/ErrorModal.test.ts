import { mount, Wrapper } from '@vue/test-utils';
import { ErrorModal } from './ErrorModal';

describe(ErrorModal, () => {
  let errorModal: Wrapper<ErrorModal>;

  beforeEach(() => {
    errorModal = mount(ErrorModal, {
      propsData: {
        showError: false
      }
    });
  });

  it('renders', () => {
    expect(errorModal.contains(ErrorModal)).toBe(true);
  });

  it('does not render any text', () => {
    expect(errorModal.html()).not.toContain(ErrorModal.DEFAULT_TITLE);
    expect(errorModal.html()).not.toContain(ErrorModal.DEFAULT_TEXT);
  });

  context('when showError is true', () => {
    beforeEach(() => {
      errorModal.setProps({
        showError: true
      });
    });

    it('renders default title and text', () => {
      expect(errorModal.html()).toContain(ErrorModal.DEFAULT_TITLE);
      expect(errorModal.html()).toContain(ErrorModal.DEFAULT_TEXT);
    });

    it('emits close event when close button is clicked', () => {
      errorModal.find('.close').trigger('click');
      expect(errorModal.emitted().close).toBeTruthy();
    });

    context('when custom title is provided', () => {
      const customTitle = 'custom title';
      beforeEach(() => {
        errorModal.setProps({
          title: customTitle
        });
      });

      it('does not render default title', () => {
        expect(errorModal.html()).not.toContain(ErrorModal.DEFAULT_TITLE);
      });

      it('renders custom title', () => {
        expect(errorModal.html()).toContain(customTitle);
      });
    });

    context('when custom text is provided', () => {
      const customText = 'custom text';
      beforeEach(() => {
        errorModal.setProps({
          text: customText
        });
      });

      it('does not render default text', () => {
        expect(errorModal.html()).not.toContain(ErrorModal.DEFAULT_TEXT);
      });

      it('renders custom text', () => {
        expect(errorModal.html()).toContain(customText);
      });
    });
  });
});
