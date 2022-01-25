import { Dictionary } from 'leanplum-lib-common';
import isNumber from 'lodash/isNumber';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Tooltip } from '../Tooltip/Tooltip';

import './Icon.scss';

// For every new icon SVG that's added to the 'icons/' folder, add an entry to `enum Type` and `TYPE_SVG_MAP`
const TYPE_SVG_MAP: Dictionary<string> = {
  actionAppfunction: require('./icons_v2/new/action-appfunction.svg'),
  actionAppinbox: require('./icons_v2/new/action-appinbox.svg'),
  actionEmail: require('./icons_v2/new/action-email.svg'),
  actionExit: require('./icons_v2/new/action-exit.svg'),
  actionInapp: require('./icons_v2/new/action-inapp.svg'),
  actionPush: require('./icons_v2/new/action-push.svg'),
  actionVariable: require('./icons_v2/new/action-variable.svg'),
  actionWebhook: require('./icons_v2/new/action-webhook.svg'),
  actionUrl: require('./icons_v2/new/action-url.svg'),
  actionRating: require('./icons_v2/new/action-rating.svg'),
  alert: require('./icons_v2/new/alert.svg'),
  alertActive: require('./icons_v2/new/alert-active.svg'),
  androidLogo: require('./icons_v2/new/android-logo.svg'),
  appleLogo: require('./icons_v2/new/apple-logo.svg'),
  appVersion: require('./icons_v2/new/app-version.svg'),
  arrowUp: require('./icons_v2/new/arrow-up.svg'),
  arrowDown: require('./icons_v2/new/arrow-down.svg'),
  arrowLeft: require('./icons_v2/new/arrow-left.svg'),
  arrowRight: require('./icons_v2/new/arrow-right.svg'),
  attributes: require('./icons_v2/new/user-attributes.svg'),
  barChart: require('./icons_v2/new/bar-absolute.svg'),
  boolean: require('./icons_v2/new/boolean.svg'),
  drive: require('./icons_v2/new/drive.svg'),
  calendar: require('./icons_v2/new/calendar.svg'),
  campaigns: require('./icons_v2/new/campaigns.svg'),
  caretDown: require('./icons_v2/new/caret-down-12.svg'),
  caretDownSmall: require('./icons_v2/new/caret-down-8.svg'),
  caretRight: require('./icons_v2/new/caret-right-12.svg'),
  caretRightSmall: require('./icons_v2/new/caret-right-8.svg'),
  characterAlpha: require('./icons_v2/new/character_alpha.svg'),
  characterNumeric: require('./icons_v2/new/character_numeric.svg'),
  checkMedium: require('./icons_v2/new/check-12.svg'),
  checkmark: require('./icons_v2/new/checkmark.svg'),
  chevronDown: require('./icons_v2/new/chevron-down.svg'),
  chevronDownSmall: require('./icons_v2/new/chevron-down-10.svg'),
  chevronLeft: require('./icons_v2/new/chevron-left.svg'),
  chevronRight: require('./icons_v2/new/chevron-right.svg'),
  chevronRightSmall: require('./icons_v2/new/chevron-right-10.svg'),
  chevronUp: require('./icons_v2/new/chevron-up.svg'),
  circle: require('./icons_v2/new/circle.svg'),
  clear: require('./icons_v2/new/close-12.svg'),
  clearFilled: require('./icons_v2/new/clear-filled.svg'),
  clearFilledMedium: require('./icons_v2/new/clear-filled-12.svg'),
  clock: require('./icons_v2/new/clock.svg'),
  close: require('./icons_v2/new/close-8.svg'),
  confidenceIntervalsAmplitude: require('./icons_v2/new/confidence-intervals-amplitude.svg'),
  copy: require('./icons_v2/new/copy.svg'),
  delete: require('./icons_v2/new/trash.svg'),
  deviceAndroid: require('./icons_v2/new/device-phone-android.svg'),
  deviceApple: require('./icons_v2/new/device-phone-apple.svg'),
  deviceMonitor: require('./icons_v2/new/device-monitor.svg'),
  devicePhone: require('./icons_v2/new/device-phone.svg'),
  deviceTablet: require('./icons_v2/new/device-tablet.svg'),
  doughnutChart: require('./icons_v2/new/doughnut-chart.svg'),
  download: require('./icons_v2/new/download.svg'),
  dragHandle: require('./icons_v2/new/drag-handle.svg'),
  edit: require('./icons_v2/new/edit.svg'),
  email: require('./icons_v2/new/email.svg'),
  engage: require('./icons_v2/new/engage.svg'),
  eventLimits: require('./icons_v2/new/event-limits.svg'),
  exclamationCircle: require('./icons_v2/new/exclamation-circle.svg'),
  exclamationMedium: require('./icons_v2/new/exclamation-12.svg'),
  exclamation: require('./icons_v2/new/exclamation.svg'),
  expand: require('./icons_v2/new/expand.svg'),
  filter: require('./icons_v2/new/filter.svg'),
  geofence: require('./icons_v2/new/geofence.svg'),
  grid: require('./icons_v2/new/table.svg'),
  group: require('./icons_v2/new/group.svg'),
  helpMedium: require('./icons_v2/new/help-12.svg'),
  help: require('./icons_v2/new/help.svg'),
  helpCenter: require('./icons_v2/new/help-center.svg'),
  handTap: require('./icons_v2/new/hand-tap.svg'),
  info: require('./icons_v2/new/info.svg'),
  ibeacon: require('./icons_v2/new/ibeacon.svg'),
  insertValue: require('./icons_v2/new/insert-value.svg'),
  lab: require('./icons_v2/new/abtest.svg'),
  list: require('./icons_v2/new/list.svg'),
  listWithDetails: require('./icons_v2/new/list_with_details.svg'),
  link: require('./icons_v2/new/link.svg'),
  location: require('./icons_v2/new/location.svg'),
  lock: require('./icons_v2/new/locked-12.svg'),
  lightning: require('./icons_v2/new/lightning.svg'),
  lightbulb: require('./icons_v2/new/lightbulb.svg'),
  magnet: require('./icons_v2/new/magnet.svg'),
  messages: require('./icons_v2/new/messages.svg'),
  monetize: require('./icons_v2/new/monetize.svg'),
  moreSolid: require('./icons_v2/new/more-solid.svg'),
  moreOutline: require('./icons_v2/new/more-outline.svg'),
  moreSolidHorizontal: require('./icons_v2/new/more-solid-horizontal.svg'),
  moreOutlineHorizontal: require('./icons_v2/new/more-outline-horizontal.svg'),
  moveCircleToMap: require('./icons_v2/new/move-circle-to-map.svg'),
  moveMapToCircle: require('./icons_v2/new/move-map-to-circle.svg'),
  notify: require('./icons_v2/new/notify.svg'),
  onboard: require('./icons_v2/new/onboard.svg'),
  openInNew: require('./icons_v2/new/open-in-new.svg'),
  pause: require('./icons_v2/new/pause.svg'),
  picture: require('./icons_v2/new/picture.svg'),
  pie: require('./icons_v2/new/pie.svg'),
  plus: require('./icons_v2/new/plus-10.svg'),
  preview: require('./icons_v2/new/preview.svg'),
  redo: require('./icons_v2/new/redo.svg'),
  revert: require('./icons_v2/new/revert.svg'),
  search: require('./icons_v2/new/zoom.svg'),
  send: require('./icons_v2/new/send.svg'),
  settings: require('./icons_v2/new/settings.svg'),
  sorting: require('./icons_v2/new/sorting.svg'),
  statusIndicator: require('./icons_v2/new/status-indicator.svg'),
  sync: require('./icons_v2/new/sync.svg'),
  timewatch: require('./icons_v2/new/stopwatch.svg'),
  undo: require('./icons_v2/new/undo.svg'),
  unlink: require('./icons_v2/new/unlink.svg'),
  upload: require('./icons_v2/new/upload.svg'),
  userAttributes: require('./icons_v2/new/user-attributes-fingerprint.svg'),
  user: require('./icons_v2/new/user.svg'),
  users: require('./icons_v2/new/users.svg'),
  zoomIn: require('./icons_v2/new/zoom-in.svg'),
  zoomOut: require('./icons_v2/new/zoom-out.svg')
};

@Component({ name: 'Icon' })
class Icon extends Vue implements Icon.Props {
  static readonly EVENT_CLICK = 'click';
  static readonly DEFAULT_SIZE_NUM: number = 20;
  static readonly TOOLTIP_OFFSET: number = 8;

  @Prop({
    required: true,
    type: String,
    validator(value: string): boolean {
      return TYPE_SVG_MAP[value] !== undefined;
    }
  })
  readonly type: Icon.Type;

  @Prop({
    required: false,
    type: String,
    default(): Icon.Circle {
      return Icon.Circle.NONE;
    }
  })
  readonly circle: Icon.Circle;

  @Prop({
    required: false,
    type: [Object, Number],
    default(): Icon.Size {
      return Icon.DEFAULT_SIZE_NUM;
    }
  })
  readonly size: Icon.Size | number;

  @Prop({ required: false, type: Number, default: null })
  readonly padding: number | null;

  @Prop({ type: [String, Object], required: false, default: null })
  readonly tooltip: string | null;

  @Prop({
    type: String,
    required: false,
    default(): AnchoredPopup.Placement {
      return AnchoredPopup.Placement.TOP;
    }
  })
  readonly tooltipPlacement: AnchoredPopup.Placement;

  @Prop({ type: Boolean, required: false, default: false })
  readonly stopPropagation: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly clickable: boolean;

  $slots: {
    tooltip: Array<VNode>;
  };

  render(): VNode {
    return (
      <i
        class={cx('lp-icon', {
          clickable: this.clickable,
          circle: this.circle !== Icon.Circle.NONE,
          [this.circle]: this.circle !== Icon.Circle.NONE
        })}
        style={this.containerStyle}
        onClick={this.onClick}
      >
        {this.renderTooltip()}
      </i>
    );
  }

  private renderTooltip(): VNode {
    const svg = <i class="icon-svg-container" domPropsInnerHTML={this.svg} />;
    const tooltip = this.$slots.tooltip || this.tooltip;

    if (tooltip) {
      return (
        <Tooltip placement={this.tooltipPlacement} offset={Icon.TOOLTIP_OFFSET}>
          {svg}
          <p slot="content">{tooltip}</p>
        </Tooltip>
      );
    }

    return svg;
  }

  private get width(): number {
    if (isNumber(this.size)) {
      return this.size;
    }

    return this.size.width;
  }

  private get height(): number {
    if (isNumber(this.size)) {
      return this.size;
    }

    return this.size.height;
  }

  private get containerStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
      ...(this.padding !== null && { padding: `${this.padding}px` })
    };
  }

  private get svg(): string {
    return TYPE_SVG_MAP[this.type] || '';
  }

  private onClick(event?: Event): void {
    if (event) {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      if (this.clickable) {
        this.$emit(Icon.EVENT_CLICK);
      }
    }
  }
}

namespace Icon {
  export interface Props {
    type: Type;
    size?: Size;
    tooltip?: string | null;
    tooltipPlacement?: AnchoredPopup.Placement;
    circle?: Icon.Circle;
    clickable?: boolean;
    stopPropagation?: boolean;
  }

  export type Size = number | { width: number; height: number; };

  // For every new icon SVG that's added to the 'icons/' folder, add an entry to `enum Type` and `TYPE_SVG_MAP`
  export enum Type {
    ACTION_APPFUNCTION = 'actionAppfunction',
    ACTION_APPINBOX = 'actionAppinbox',
    ACTION_EMAIL = 'actionEmail',
    ACTION_EXIT = 'actionExit',
    ACTION_INAPP = 'actionInapp',
    ACTION_PUSH = 'actionPush',
    ACTION_RATING = 'actionRating',
    ACTION_URL = 'actionUrl',
    ACTION_VARIABLE = 'actionVariable',
    ACTION_WEBHOOK = 'actionWebhook',
    ALERT = 'alert',
    ALERT_ACTIVE = 'alertActive',
    ANDROID_LOGO = 'androidLogo',
    APPLE_LOGO = 'appleLogo',
    APP_VERSION = 'appVersion',
    ARROW_UP = 'arrowUp',
    ARROW_DOWN = 'arrowDown',
    ARROW_LEFT = 'arrowLeft',
    ARROW_RIGHT = 'arrowRight',
    ATTRIBUTES = 'attributes',
    BAR_CHART = 'barChart',
    BOOLEAN = 'boolean',
    DRIVE = 'drive',
    CALENDAR = 'calendar',
    CAMPAIGNS = 'campaigns',
    CARET_DOWN = 'caretDown',
    CARET_DOWN_SMALL = 'caretDownSmall',
    CARET_RIGHT = 'caretRight',
    CARET_RIGHT_SMALL = 'caretRightSmall',
    CHARACTER_ALPHA = 'characterAlpha',
    CHARACTER_NUMERIC = 'characterNumeric',
    CHECK_MEDIUM = 'checkMedium',
    CHECKMARK = 'checkmark',
    CHEVRON_DOWN = 'chevronDown',
    CHEVRON_DOWN_SMALL = 'chevronDownSmall',
    CHEVRON_LEFT = 'chevronLeft',
    CHEVRON_RIGHT = 'chevronRight',
    CHEVRON_RIGHT_SMALL = 'chevronRightSmall',
    CHEVRON_UP = 'chevronUp',
    CIRCLE = 'circle',
    CLEAR = 'clear',
    CLEAR_FILLED = 'clearFilled',
    CLEAR_FILLED_MEDIUM = 'clearFilledMedium',
    CLOCK = 'clock',
    CLOSE = 'close',
    CONFIDENCE_INTERVALS_AMPLITUDE = 'confidenceIntervalsAmplitude',
    COPY = 'copy',
    DELETE = 'delete',
    DEVICE_ANDROID = 'deviceAndroid',
    DEVICE_APPLE = 'deviceApple',
    DEVICE_MONITOR = 'deviceMonitor',
    DEVICE_PHONE = 'devicePhone',
    DEVICE_TABLET = 'deviceTablet',
    DOUGHNUT_CHART = 'doughnutChart',
    DOWNLOAD = 'download',
    DRAG_HANDLE = 'dragHandle',
    EDIT = 'edit',
    EMAIL = 'email',
    ENGAGE = 'engage',
    EVENT_LIMITS = 'eventLimits',
    EXCLAMATION_CIRCLE = 'exclamationCircle',
    EXCLAMATION_MEDIUM = 'exclamationMedium',
    EXCLAMATION = 'exclamation',
    EXPAND = 'expand',
    FILTER = 'filter',
    GEOFENCE = 'geofence',
    GRID = 'grid',
    GROUP = 'group',
    HELP_MEDIUM = 'helpMedium',
    HELP = 'help',
    HELP_CENTER = 'helpCenter',
    HAND_TAP = 'handTap',
    IBEACON = 'ibeacon',
    INFO = 'info',
    INSERT_VALUE = 'insertValue',
    LAB = 'lab',
    LINK = 'link',
    LIST = 'list',
    LIST_WITH_DETAILS = 'listWithDetails',
    LOCATION = 'location',
    LOCK = 'lock',
    LIGHTNING = 'lightning',
    LIGHTBULB = 'lightbulb',
    MAGNET = 'magnet',
    MESSAGES = 'messages',
    MONETIZE = 'monetize',
    MORE_SOLID = 'moreSolid',
    MORE_SOLID_HORIZONTAL = 'moreSolidHorizontal',
    MORE_OUTLINE = 'moreOutline',
    MORE_OUTLINE_HORIZONTAL = 'moreOutlineHorizontal',
    MOVE_CIRCLE_TO_MAP = 'moveCircleToMap',
    MOVE_MAP_TO_CIRCLE = 'moveMapToCircle',
    NOTIFY = 'notify',
    ONBOARD = 'onboard',
    OPEN_IN_NEW = 'openInNew',
    PAUSE = 'pause',
    PICTURE = 'picture',
    PIE_CHART = 'pie',
    PLUS = 'plus',
    PREVIEW = 'preview',
    REDO = 'redo',
    REVERT = 'revert',
    SEARCH = 'search',
    SEND = 'send',
    SETTINGS = 'settings',
    SORTING = 'sorting',
    STATUS_INDICATOR = 'statusIndicator',
    SYNC = 'sync',
    TIMEWATCH = 'timewatch',
    UNDO = 'undo',
    UNLINK = 'unlink',
    UPLOAD = 'upload',
    USER_ATTRIBUTES = 'userAttributes',
    USER = 'user',
    USERS = 'users',
    ZOOM_IN = 'zoomIn',
    ZOOM_OUT = 'zoomOut'
  }

  export enum Circle {
    NONE = 'none',
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger',
    SUCCESS = 'success',
    LIGHT = 'light',
    HELP = 'help'
  }
}

export { Icon };
