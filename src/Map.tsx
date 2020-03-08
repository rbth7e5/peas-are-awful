import React, {useContext, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {STYLES} from './styles';
import {MAPBOX_TOKEN} from '../private';
import {KioskMarker} from './components/markers';
import Panel from './components/Panel';
import Scanner from './components/Scanner';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useKioskData} from './custom-hooks';
import {UserContext} from '../App';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function Map() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [kioskID, setKioskID] = useState(null);
  const kioskData = useKioskData(kioskID);
  const user = useContext(UserContext);

  const onCodeDetect = async (value: number, actionType: string) => {
    if (kioskID && kioskData) {
      setScannerOpen(false);
      await firestore()
        .collection('kiosks')
        .doc(kioskID)
        .set({bags_avail: kioskData.bags_avail + value}, {merge: true});
      const currentHook =
        value === 1 ? kioskData.bags_avail + 1 : kioskData.bags_avail;
      const action = value === 1 ? 'Hook up' : 'Retrieve';
      const updateStats = async ({borrow, donate, holding}) => {
        if (user && user.uid) {
          await firestore()
            .collection('users')
            .doc(user.uid)
            .set({
              borrow: user.borrow + borrow,
              donate: user.donate + donate,
              holding: user.holding + holding,
            });
        }
      };
      Alert.alert(`Hook ${currentHook}`, `${action} your bag now`, [
        {
          text: 'Done',
          onPress: async () => {
            switch (actionType) {
              case 'take':
                await updateStats({borrow: 0, donate: 0, holding: 1});
                break;
              case 'return':
                await updateStats({borrow: 1, donate: 0, holding: -1});
                break;
              case 'donate':
                await updateStats({borrow: 0, donate: 1, holding: 0});
                break;
            }
            setPanelOpen(true);
          },
        },
      ]);
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
                {text: 'Take a Bag', onPress: () => onCodeDetect(-1, 'take')},
                {
                  text: 'Return a Bag',
                  onPress: () => onCodeDetect(1, 'return'),
                },
                {
                  text: 'Donate a Bag',
                  onPress: () => onCodeDetect(1, 'donate'),
                },
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
