import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}

    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {
      props?: any;
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }

    interface ElementAttributesProperty {
      $props?: any;
    }

    // Allows to use HTML attributes on custom components,
    // see: https://stackoverflow.com/a/53017665
    // tslint:disable-next-line:interface-over-type-literal
    type LibraryManagedAttributes<C, P> = {
      [name: string]: any;
    };
  }
}
