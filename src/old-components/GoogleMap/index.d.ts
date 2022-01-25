declare module 'load-google-maps-api' {
  export interface GoogleMapsLoaderOptions {
    key: string;
  }

  declare function loadGoogleMapsApi(options: GoogleMapsLoaderOptions): Promise<void>;

  export default loadGoogleMapsApi;
}
