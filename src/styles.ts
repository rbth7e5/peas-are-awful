import {Dimensions, StyleProp, StyleSheet} from 'react-native';
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
  panel: {
    position: 'absolute',
    bottom: 40,
    height: 180,
    zIndex: 2,
  },
  panelWrapper: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 8,
    marginLeft: 16,
    marginRight: 16,
    width: Dimensions.get('window').width - 32,
    flex: 1,
    padding: 16,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'grey',
    marginTop: 8,
  },
  panelLimit: {
    marginTop: 8,
    height: 32,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
  },
  panelProgress: {
    height: 32,
    backgroundColor: '#a6e3ca',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  panelButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  panelButton: {
    backgroundColor: '#0d3d3b',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  panelButtonText: {
    fontSize: 16,
    color: 'white',
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
