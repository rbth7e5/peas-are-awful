import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {STYLES} from './styles';

export default function Map() {
  return <MapboxGL.MapView style={STYLES.mapView} />;
}
