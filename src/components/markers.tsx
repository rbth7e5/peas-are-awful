import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FeatureCollection} from 'geojson';
import {LAYER_STYLES, MARKER_STYLES} from '../styles';

interface KioskMarkerProps {
  onTap: (id: string) => any;
}

export const KioskMarker = (props: KioskMarkerProps) => {
  const [kiosks, setKiosks] = useState([]);
  const {onTap} = props;
  useEffect(() => {
    return firestore()
      .collection('kiosks')
      .onSnapshot(querySnapshot => {
        if (querySnapshot) {
          const docData = querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
          setKiosks(docData);
        }
      });
  });
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
      shape={featureCollection}
      onPress={e => onTap(e.nativeEvent.payload.properties.id)}>
      <MapboxGL.SymbolLayer
        id="symbolLocationSymbols"
        minZoomLevel={1}
        style={MARKER_STYLES.kioskIcon}
      />
    </MapboxGL.ShapeSource>
  );
};

interface RouteMarkerProps {
  route: any;
}
export const RouteMarker = (props: RouteMarkerProps) => {
  const {route} = props;
  if (!route) {
    return null;
  }
  return (
    <MapboxGL.ShapeSource id="renderRouteMarkerSource" shape={route}>
      <MapboxGL.LineLayer
        id="renderRouteMarkerSymbol"
        style={LAYER_STYLES.routeMarker}
      />
    </MapboxGL.ShapeSource>
  );
};
