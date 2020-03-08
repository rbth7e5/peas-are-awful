import React, {useState} from 'react';
import {SafeAreaView, FlatList} from 'react-native';
import {ButtonGroup, ListItem} from 'react-native-elements';
import {useDonatedRanking, useFeed} from './custom-hooks';

export default function Community() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const donatedList = useDonatedRanking();
  const feedList = useFeed();
  const buttonNames = ['Feed', 'Ranking'];
  let list = [];
  if (selectedIndex === 0) {
    list = feedList;
  } else {
    list = donatedList;
  }
  return (
    <SafeAreaView>
      <ButtonGroup
        selectedIndex={selectedIndex}
        onPress={setSelectedIndex}
        buttons={buttonNames}
      />
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={list}
        renderItem={({item}) => (
          <ListItem
            leftAvatar={{source: {uri: item.photo}}}
            title={item.name}
            subtitle={selectedIndex === 0 ? item.subtitle : item.email}
            bottomDivider
          />
        )}
      />
    </SafeAreaView>
  );
}
