import {useKioskData, useSlideUpAnimation} from '../custom-hooks';
import {STYLES} from '../styles';
import {Animated, View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import GeoJSON from 'geojson';
import {getDirections} from '../mapbox-api';

interface PanelProps {
  panelOpen: boolean;
  kioskID: string;
  kioskLoc: any;
  onScan: () => any;
  origin: any;
  onGetDirection: (r: GeoJSON.LineString) => any;
}

export default function Panel(props: PanelProps) {
  const {panelOpen, kioskID, onScan, kioskLoc, origin, onGetDirection} = props;
  const slideUp = useSlideUpAnimation(panelOpen, 300, [320, 0]);
  const data = useKioskData(kioskID);
  if (data) {
    const ratio = data.bags_avail / data.bags_limit;
    return (
      <Animated.View style={[STYLES.panel, slideUp]}>
        <View style={STYLES.panelWrapper}>
          <Text style={STYLES.panelTitle}>{data.name}</Text>
          <Text style={STYLES.panelSubtitle}>
            Available Bags ({data.bags_avail}/{data.bags_limit})
          </Text>
          <View style={STYLES.panelLimit}>
            <View style={[STYLES.panelProgress, {width: `${ratio * 100}%`}]} />
          </View>
          <View style={STYLES.panelButtons}>
            <TouchableOpacity
              onPress={async () => {
                const response = await getDirections(
                  [origin.coords.longitude, origin.coords.latitude],
                  kioskLoc,
                );
                onGetDirection(response.routes[0].geometry);
              }}>
              <View style={STYLES.panelButton}>
                <Text style={STYLES.panelButtonText}>Get Directions</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onScan}>
              <View style={STYLES.panelButton}>
                <Text style={STYLES.panelButtonText}>Scan QR Code</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
  return null;
}
