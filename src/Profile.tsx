import React, {useContext} from 'react';
import {Text, SafeAreaView, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {UserContext} from '../App';
import auth from '@react-native-firebase/auth';

export default function Profile() {
  const user = useContext(UserContext);
  let pic = {uri: user.photo};
  let first_name = user.name;
  let title = 'Novice';
  let total_borrowed = user.borrow;
  let total_saved = user.borrow + user.donate;
  let total_holding = user.holding;
  let total_donated = user.donate;

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Header */}
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <Avatar
          containerStyle={{marginTop: 20, marginLeft: 20}}
          rounded
          size="large"
          source={pic}
          showEditButton
          onPress={() => auth().signOut()}
        />
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <Text style={{marginTop: 20, marginLeft: 20, fontSize: 30}}>
            {first_name}
          </Text>
          <Text style={{marginLeft: 20, fontSize: 20}}>{title}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 20, padding: 16}}>
            Plastic Bags Saved
          </Text>
          <Avatar
            rounded
            title={total_saved.toString(10)}
            size="large"
            overlayContainerStyle={{backgroundColor: '#0d3d3b'}}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 20, padding: 16}}>
            Bags Donated
          </Text>
          <Avatar
            rounded
            title={total_donated.toString(10)}
            size="large"
            overlayContainerStyle={{backgroundColor: '#a6e3ca'}}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 20, padding: 16}}>
            Bags in Holding
          </Text>
          <Avatar
            rounded
            title={total_holding.toString(10)}
            size="large"
            overlayContainerStyle={{backgroundColor: '#fee1b4'}}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 20, padding: 16}}>
            Bags Borrowed
          </Text>
          <Avatar
            rounded
            containerStyle={{marginBottom: 16}}
            title={total_borrowed.toString(10)}
            size="large"
            overlayContainerStyle={{backgroundColor: '#fc8753'}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
