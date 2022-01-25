import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * Mixin that adds a hook for when an element enters/exits the viewport
 * Note: observableElement must be specified
 */
@Component({ name: 'ObserveVisibility' })
export class ObserveVisibility extends Vue {
  static observer: IntersectionObserver = new IntersectionObserver(ObserveVisibility.intersectionObserverCallback, {
    root: document.querySelector('body'),
    threshold: 0
  });

  static callbacks: Array<{element: HTMLElement, callback: (e: IntersectionObserverEntry) => void}> = [];

  static intersectionObserverCallback(entries: Array<IntersectionObserverEntry>): void {
    entries.forEach((e) => {
      const match = ObserveVisibility.callbacks.find((cb) => cb.element === e.target);
      if (match) {
        match.callback(e);
      }
    });
  }

  static registerObservableElement(element: HTMLElement, callback: (e: IntersectionObserverEntry) => void): void {
    ObserveVisibility.observer.observe(element);
    ObserveVisibility.callbacks.push({
      element,
      callback
    });
  }

  static unregisterObservableElement(element: HTMLElement): void {
    ObserveVisibility.callbacks = ObserveVisibility.callbacks.filter((cb) => cb.element !== element);
    ObserveVisibility.observer.unobserve(element);
  }

  $refs: {
    observableElement: HTMLInputElement;
  };

  onVisibilityChange(matchingEntry: IntersectionObserverEntry): void {
    throw new Error('Method not implemented.');
  }

  mounted(): void {
    ObserveVisibility.registerObservableElement(this.$refs.observableElement, this.onVisibilityChange);
  }

  beforeDestroy(): void {
    ObserveVisibility.unregisterObservableElement(this.$refs.observableElement);
  }
}
