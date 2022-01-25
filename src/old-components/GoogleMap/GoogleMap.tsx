import { ApiKeysProvider, ContainerInject } from 'leanplum-lib-common';
import loadGoogleMapsApi from 'load-google-maps-api';
import debounce from 'lodash/debounce';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { ScopedSlotChildren } from 'vue/types/vnode';

import './GoogleMap.scss';

@Component({ name: 'GoogleMap' })
class GoogleMap extends Vue {
  private static readonly CENTER_CHANGE_DELAY: number = 300;
  static readonly EVENT_CHANGE_CENTER = 'changeCenter';

  @ContainerInject(ApiKeysProvider)
  private readonly apiKeysProvider: ApiKeysProvider;

  @Prop({ required: false })
  readonly height: string;

  @Prop({ required: false, type: Object, default: null })
  readonly center: google.maps.LatLngLiteral | null;

  @Prop({ required: false, type: String, default: null })
  readonly address: string;

  @Prop({ required: false, default: 10 })
  readonly zoom: number;

  @Prop({ required: false, default: false })
  readonly disabled: boolean;

  $refs: {
    map: HTMLDivElement;
  };

  $scopedSlots: {
    mapComponents: (mapInstance: google.maps.Map) => ScopedSlotChildren;
  };

  private googleMapsLoaded: boolean = false;
  private instance: google.maps.Map | null = null;

  /**
   * Map center computed either from center prop or from address prop.
   */
  private mapCenter: google.maps.LatLng;

  private get containerStyle(): Partial<CSSStyleDeclaration> | undefined {
    return this.height ? { height: this.height } : undefined;
  }

  @Watch('googleMapsLoaded')
  onChangeGoogleMapsLoaded(): void {
    this.initialize();
  }

  @Watch('zoom')
  onChangeZoom(): void {
    if (this.instance) {
      this.instance.setZoom(this.zoom);
    }
  }

  @Watch('address')
  async onChangeAddress(): Promise<void> {
    if (this.instance && this.address) {
      this.mapCenter = await this.getMapCenterFromAddress();
      this.instance.setCenter(this.mapCenter);
    }
  }

  @Watch('center')
  onChangeCenter(): void {
    if (this.instance && this.center) {
      this.mapCenter = new google.maps.LatLng(this.center!.lat, this.center!.lng);
      this.instance.setCenter(this.mapCenter);
    }
  }

  async created(): Promise<void> {
    const apiKey = this.apiKeysProvider.getGoogleMapsApiKey();
    if (apiKey) {
      await loadGoogleMapsApi({ key: apiKey });
    }

    if (this.address) {
      try {
        this.mapCenter = await this.getMapCenterFromAddress();
        this.googleMapsLoaded = true;
      } catch {
        console.error('Unable to find location from address');
      }
    } else if (this.center) {
      this.mapCenter = new google.maps.LatLng(this.center.lat, this.center.lng);
      this.googleMapsLoaded = true;
    } else {
      console.error('You must provide an address or a center point.');
    }
  }

  mounted(): void {
    this.initialize();
  }

  beforeDestroy(): void {
    if (this.instance) {
      this.instance.unbindAll();
      this.instance = null;
    }
  }

  render(): VNode {
    return (
      <div class="google-map-container" style={this.containerStyle}>
        <div class="map-element" ref="map" />
        {this.instance && this.$scopedSlots.mapComponents && this.$scopedSlots.mapComponents(this.instance)}
      </div>
    );
  }

  private initialize(): void {
    if (this.googleMapsLoaded && this.$refs.map && !this.instance) {
      this.instance = new google.maps.Map(this.$refs.map, {
        center: this.mapCenter,
        zoom: this.zoom,
        draggable: !this.disabled,
        draggableCursor: this.disabled ? 'default' : 'grab',
        streetViewControl: false,
        overviewMapControl: false,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        disableDefaultUI: true
      });

      google.maps.event.addListener(
        this.instance,
        'center_changed',
        debounce(() => {
          if (this.instance && !this.disabled) {
            const center = this.instance.getCenter();

            if (!center.equals(this.mapCenter)) {
              this.$emit(GoogleMap.EVENT_CHANGE_CENTER, {
                lat: center.lat(),
                lng: center.lng()
              });
            }
          }
        }, GoogleMap.CENTER_CHANGE_DELAY)
      );
    }
  }

  private getMapCenterFromAddress(): Promise<google.maps.LatLng> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: this.address }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK) {
          reject('Unable to find location');

          return;
        }

        const location = results[0].geometry.location;
        resolve(new google.maps.LatLng(location.lat(), location.lng()));
      });
    });
  }
}

export { GoogleMap };
