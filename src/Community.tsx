import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {SearchBar} from 'react-native-elements';

export default function Community() {
  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <SearchBar placeholder="Search" />
      </SafeAreaView>
    </>
  );
}
