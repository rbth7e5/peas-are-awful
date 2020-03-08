import QRCodeScanner from 'react-native-qrcode-scanner';
import * as React from 'react';
import {Button, Text} from 'react-native';

interface ScannerProps {
  onClose: () => any;
  onScan: (id: string) => any;
}
export default function Scanner(props: ScannerProps) {
  const {onClose, onScan} = props;
  return (
    <QRCodeScanner
      onRead={e => onScan(e.data)}
      containerStyle={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
      topViewStyle={{backgroundColor: 'white'}}
      bottomViewStyle={{backgroundColor: 'white'}}
      topContent={<Text>Scan the QR Code on the Kiosk!</Text>}
      bottomContent={<Button title="Close" onPress={onClose} />}
    />
  );
}
