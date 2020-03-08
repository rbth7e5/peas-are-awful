import {useKioskData, useSlideUpAnimation} from '../custom-hooks';
import {STYLES} from '../styles';
import {Animated, View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface PanelProps {
  panelOpen: boolean;
  kioskID: string;
  onScan: () => any;
}

export default function Panel(props: PanelProps) {
  const {panelOpen, kioskID, onScan} = props;
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
            <TouchableOpacity onPress={() => {}}>
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
