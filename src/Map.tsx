import React, {useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {STYLES} from './styles';
import {MAPBOX_TOKEN} from '../private';
import {KioskMarker} from './components/markers';
import Panel from './components/Panel';
import Scanner from './components/Scanner';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function Map() {
  const [panelData, setPanelData] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [kioskID, setKioskID] = useState(null);
  return (
    <MapboxGL.MapView style={STYLES.mapView} onPress={() => setPanelData(null)}>
      <MapboxGL.Camera followUserLocation={true} animationDuration={100} />
      <MapboxGL.UserLocation visible={true} />
      <KioskMarker onTap={data => setPanelData(data)} />
      <Panel
        panelOpen={!!panelData}
        data={panelData}
        onScan={() => setScannerOpen(true)}
      />
      <Scanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={id => setKioskID(id)}
      />
    </MapboxGL.MapView>
  );
}
