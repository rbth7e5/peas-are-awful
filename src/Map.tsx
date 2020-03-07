import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {STYLES} from './styles';
import {MAPBOX_TOKEN} from '../private';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function Map() {
  return (
    <MapboxGL.MapView style={STYLES.mapView}>
      <MapboxGL.Camera followUserLocation={true} />
      <MapboxGL.UserLocation visible={true} />
    </MapboxGL.MapView>
  );
}
