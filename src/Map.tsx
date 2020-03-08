import React, {useEffect, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {STYLES} from './styles';
import {MAPBOX_TOKEN} from '../private';
import {KioskMarker} from './components/markers';
import Panel from './components/Panel';
import Scanner from './components/Scanner';
import {Alert} from 'react-native';
import {updateBagsAvail} from './firestore';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function Map() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [kioskID, setKioskID] = useState(null);
  const [codeScanned, setCodeScanned] = useState(false);
  useEffect(() => {
    const onCodeDetect = async (value: number) => {
      await updateBagsAvail(kioskID, value);
      setCodeScanned(false);
      setScannerOpen(false);
      setPanelOpen(true);
    };
    if (codeScanned) {
      Alert.alert('Would you like to', '', [
        {text: 'Take a Bag', onPress: () => onCodeDetect(-1)},
        {text: 'Return a Bag', onPress: () => onCodeDetect(1)},
        {text: 'Donate a Bag', onPress: () => onCodeDetect(1)},
      ]);
    }
  }, [codeScanned, kioskID]);
  return (
    <MapboxGL.MapView style={STYLES.mapView}>
      <MapboxGL.Camera followUserLocation={true} animationDuration={100} />
      <MapboxGL.UserLocation visible={true} />
      <KioskMarker
        onTap={id => {
          setPanelOpen(true);
          setKioskID(id);
        }}
      />
      <Panel
        panelOpen={panelOpen}
        kioskID={kioskID}
        onScan={() => {
          setPanelOpen(false);
          setScannerOpen(true);
        }}
      />
      <Scanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={id => {
          if (id === kioskID) {
            setCodeScanned(true);
          } else {
            Alert.alert('You are at the wrong kiosk!');
          }
        }}
      />
    </MapboxGL.MapView>
  );
}
