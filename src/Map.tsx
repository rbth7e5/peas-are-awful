import React, {useContext, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {STYLES} from './styles';
import {MAPBOX_TOKEN} from '../private';
import {KioskMarker, RouteMarker} from './components/markers';
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
  const [route, setRoute] = useState(null);
  const [currentLoc, setCurrentLoc] = useState(null);
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
            .set(
              {
                borrow: user.borrow + borrow,
                donate: user.donate + donate,
                holding: user.holding + holding,
              },
              {merge: true},
            );
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
            if (actionType === 'donate' && user) {
              await firestore()
                .collection('feed')
                .doc()
                .set({
                  photo: user.photo,
                  name: user.name,
                  subtitle: `${user.name} donated 1 bag to ${kioskData.name}!`,
                });
            }
            setPanelOpen(true);
          },
        },
      ]);
    }
  };
  return (
    <>
      <MapboxGL.MapView
        style={STYLES.mapView}
        onPress={() => {
          setPanelOpen(false);
          setRoute(null);
        }}>
        <MapboxGL.Camera followUserLocation={true} animationDuration={100} />
        <MapboxGL.UserLocation
          visible={true}
          onUpdate={loc => setCurrentLoc(loc)}
        />
        <KioskMarker
          onTap={id => {
            setPanelOpen(true);
            setKioskID(id);
          }}
        />
        <RouteMarker route={route} />
      </MapboxGL.MapView>
      {kioskData && (
        <Panel
          panelOpen={panelOpen}
          kioskID={kioskID}
          onScan={() => {
            setPanelOpen(false);
            setScannerOpen(true);
          }}
          kioskLoc={[
            kioskData.location._longitude,
            kioskData.location._latitude,
          ]}
          origin={currentLoc}
          onGetDirection={r => setRoute(r)}
        />
      )}
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
