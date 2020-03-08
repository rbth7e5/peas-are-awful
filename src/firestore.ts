import firestore from '@react-native-firebase/firestore';

export const updateBagsAvail = async (kioskID: string, value: number) => {
  const kioskRef = firestore()
    .collection('kiosks')
    .doc(kioskID);
  await firestore().runTransaction(async transaction => {
    const doc = await transaction.get(kioskRef);
    if (doc.exists) {
      transaction.update(kioskRef, {
        bags_avail: doc.data().bags_avail + value,
      });
    }
  });
};
