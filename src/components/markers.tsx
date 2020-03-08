import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FeatureCollection} from 'geojson';
import {MARKER_STYLES} from '../styles';

export const KioskMarker = () => {
  const [kiosks, setKiosks] = useState([]);
  useEffect(() => {
    return firestore()
      .collection('kiosks')
      .onSnapshot(querySnapshot => {
        const docData = querySnapshot.docs.map(doc => doc.data());
        setKiosks(docData);
      });
  }, [kiosks]);
  const featureCollection = {
    type: 'FeatureCollection',
    features: kiosks.map(k => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [k.location._longitude, k.location._latitude],
        },
        properties: k,
      };
    }),
  } as FeatureCollection;
  return (
    <MapboxGL.ShapeSource
      id="symbolLocationSource"
      hitbox={{width: 5, height: 5}}
      shape={featureCollection}>
      <MapboxGL.SymbolLayer
        id="symbolLocationSymbols"
        minZoomLevel={1}
        style={MARKER_STYLES.kioskIcon}
      />
    </MapboxGL.ShapeSource>
  );
};