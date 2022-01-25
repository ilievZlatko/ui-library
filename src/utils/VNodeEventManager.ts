import { VNode } from 'vue';

interface VNodeEventInfo {
  eventName: string;
  nodes: Array<VNode>;
  listener: EventListener | EventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

export class VNodeEventManager {
  private handlers: Array<VNodeEventInfo> = [];

  add(
    nodes: Array<VNode> | undefined,
    eventName: string,
    listener: EventListener | EventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (nodes) {
      nodes.forEach((node) => node.elm?.addEventListener(eventName, listener, options));
      this.handlers.push({ eventName, nodes, listener, options });
    }
  }

  removeAll(): void {
    this.handlers.forEach(({ eventName, nodes, listener, options }) => {
      nodes.forEach((node) => node.elm?.removeEventListener(eventName, listener, options));
    });
    this.handlers = [];
  }
}
