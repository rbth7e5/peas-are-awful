import React, {useState} from 'react';
import {SafeAreaView, FlatList} from 'react-native';
import {ButtonGroup, ListItem} from 'react-native-elements';
import {useDonatedRanking, useFeed} from './custom-hooks';

export default function Community() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const feedList = useFeed();
  const donatedList = useDonatedRanking();
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
        containerStyle={{borderRadius: 8, borderWidth: 0}}
        innerBorderStyle={{width: 0}}
        buttonStyle={{borderWidth: 0}}
        selectedButtonStyle={{backgroundColor: '#a6e3ca', borderWidth: 0}}
        selectedTextStyle={{color: '#0d3d3b'}}
        textStyle={{color: '#0d3d3b'}}
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
