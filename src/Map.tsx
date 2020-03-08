import React, {useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {STYLES} from './styles';
import {MAPBOX_TOKEN} from '../private';
import {KioskMarker} from './components/markers';
import Panel from './components/Panel';
import Scanner from './components/Scanner';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useKioskData} from './custom-hooks';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function Map() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [kioskID, setKioskID] = useState(null);
  const kioskData = useKioskData(kioskID);
  const onCodeDetect = async (value: number) => {
    if (kioskID && kioskData) {
      setScannerOpen(false);
      await firestore()
        .collection('kiosks')
        .doc(kioskID)
        .set({bags_avail: kioskData.bags_avail + value}, {merge: true});
      setPanelOpen(true);
    }
  };
  return (
    <>
      <MapboxGL.MapView style={STYLES.mapView}>
        <MapboxGL.Camera followUserLocation={true} animationDuration={100} />
        <MapboxGL.UserLocation visible={true} />
        <KioskMarker
          onTap={id => {
            setPanelOpen(true);
            setKioskID(id);
          }}
        />
      </MapboxGL.MapView>
      <Panel
        panelOpen={panelOpen}
        kioskID={kioskID}
        onScan={() => {
          setPanelOpen(false);
          setScannerOpen(true);
        }}
      />
      {scannerOpen && (
        <Scanner
          onClose={() => setScannerOpen(false)}
          onScan={id => {
            if (id === kioskID) {
              setScannerOpen(false);
              Alert.alert('Would you like to', '', [
                {text: 'Take a Bag', onPress: () => onCodeDetect(-1)},
                {text: 'Return a Bag', onPress: () => onCodeDetect(1)},
                {text: 'Donate a Bag', onPress: () => onCodeDetect(1)},
              ]);
            } else {
              Alert.alert('You are at the wrong kiosk!');
            }
          }}
        />
      )}
    </>
  );
}
