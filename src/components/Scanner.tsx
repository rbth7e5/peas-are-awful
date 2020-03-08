import QRCodeScanner from 'react-native-qrcode-scanner';
import * as React from 'react';
import {Button} from 'react-native';

interface ScannerProps {
  open: boolean;
  onClose: () => any;
  onScan: (id: string) => any;
}
export default function Scanner(props: ScannerProps) {
  const {open, onClose, onScan} = props;
  if (open) {
    return (
      <QRCodeScanner
        onRead={e => onScan(e.data)}
        topContent={<Button title="Close" onPress={onClose} />}
      />
    );
  }
  return null;
}
