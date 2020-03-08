import {StyleProp, StyleSheet} from 'react-native';
import {LineLayerStyle, SymbolLayerStyle} from '@react-native-mapbox-gl/maps';

export const STYLES = StyleSheet.create({
  mapView: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  loginView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const MARKER_STYLES: {
  [name: string]: StyleProp<SymbolLayerStyle | LineLayerStyle>;
} = {
  kioskIcon: {
    iconImage: require('../assets/pin_icon.png'),
    iconAllowOverlap: true,
    iconSize: 0.1,
    iconOffset: [0, -200],
  },
};
