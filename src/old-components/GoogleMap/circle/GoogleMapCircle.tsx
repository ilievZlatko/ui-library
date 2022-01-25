import { Container } from 'inversify';
import { ApiKeysProvider } from 'leanplum-lib-common';
import { Button, Icon } from 'leanplum-lib-ui';
import loadGoogleMapsApi from 'load-google-maps-api';
import debounce from 'lodash/debounce';
import Vue, { VNode } from 'vue';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator';

import './GoogleMapCircle.scss';

@Component({ name: 'GoogleMapCircle' })
class GoogleMapCircle extends Vue {
  private static readonly ZOOM_STEP: number = 1;
  private static readonly RADIUS_CHANGE_DELAY: number = 300;
  private static readonly CENTER_CHANGE_DELAY: number = 300;

  @Inject() container: Container;

  @Prop({ type: Object, required: true })
  map: google.maps.Map;

  @Prop({ type: Object, required: true })
  center: google.maps.LatLngLiteral;

  @Prop({ type: Number, required: true })
  radius: number;

  @Prop({ required: false, default: false })
  disabled: boolean;

  private googleMapsLoaded: boolean = false;
  private instance: google.maps.Circle | null = null;

  @Watch('googleMapsLoaded')
  onChangeGoogleMapsLoaded(): void {
    this.initialize();
  }

  @Watch('radius')
  onChangeRadius(): void {
    if (this.instance) {
      this.instance.setRadius(this.radius);
    }
  }

  @Watch('center')
  onChangeCenter(): void {
    if (this.instance) {
      this.instance.setCenter(this.center);
    }
  }

  async created(): Promise<void> {
    const apiKey = this.container.get(ApiKeysProvider).getGoogleMapsApiKey();
    if (apiKey) {
      await loadGoogleMapsApi({ key: apiKey });
      this.googleMapsLoaded = true;
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
  render(): VNode | null {
    if (this.disabled) {
      return null;
    }

    return (
      <div class="google-map-circle-toolbar">
        <Button
          class="control"
          appearance={Button.Appearance.OUTLINE}
          icon={Icon.Type.ZOOM_IN}
          tooltip="Zoom In"
          onClick={this.zoomIn}
        />
        <Button
          class="control"
          appearance={Button.Appearance.OUTLINE}
          icon={Icon.Type.ZOOM_OUT}
          tooltip="Zoom Out"
          onClick={this.zoomOut}
        />
        <Button
          class="control"
          appearance={Button.Appearance.OUTLINE}
          icon={Icon.Type.MOVE_CIRCLE_TO_MAP}
          tooltip="Move your region to the map's center"
          onClick={this.moveCircleToMap}
        />
        <Button
          class="control"
          appearance={Button.Appearance.OUTLINE}
          icon={Icon.Type.MOVE_MAP_TO_CIRCLE}
          tooltip="Pan the map back to your region"
          onClick={this.moveMapToCircle}
        />
      </div>
    );
  }

  private initialize(): void {
    if (this.googleMapsLoaded && !this.instance) {
      this.instance = new google.maps.Circle({
        map: this.map,
        strokeColor: '#F874A4',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#F874A4',
        fillOpacity: 0.2,
        draggable: !this.disabled,
        editable: !this.disabled,
        center: this.center,
        radius: this.radius
      });

      google.maps.event.addListener(
        this.instance,
        'radius_changed',
        debounce(() => {
          if (this.instance && !this.disabled) {
            const radius = Math.floor(this.instance.getRadius());

            if (radius !== this.radius) {
              this.$emit('changeRadius', radius);
            }
          }
        }, GoogleMapCircle.RADIUS_CHANGE_DELAY)
      );

      google.maps.event.addListener(
        this.instance,
        'center_changed',
        debounce(() => {
          if (this.instance && !this.disabled) {
            const center = this.instance.getCenter();

            if (!center.equals(new google.maps.LatLng(this.center.lat, this.center.lng))) {
              this.$emit('changeCenter', { lat: center.lat(), lng: center.lng() } as google.maps.LatLngLiteral);
            }
          }
        }, GoogleMapCircle.CENTER_CHANGE_DELAY)
      );

      this.map.fitBounds(this.instance.getBounds());
      this.$emit('fitBounds', this.map.getCenter().toJSON());
    }
  }

  private moveCircleToMap(): void {
    this.$emit('moveCircleToMap');
  }

  private moveMapToCircle(): void {
    this.$emit('moveMapToCircle');
  }

  private zoomIn(): void {
    this.map?.setZoom(this.map.getZoom() + GoogleMapCircle.ZOOM_STEP);
  }

  private zoomOut(): void {
    this.map?.setZoom(this.map.getZoom() - GoogleMapCircle.ZOOM_STEP);
  }
}

export { GoogleMapCircle };
