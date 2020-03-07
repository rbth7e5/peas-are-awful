/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Map from './src/Map';
import Profile from './src/Profile';
import Community from './src/Community';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {STYLES} from './src/styles';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '146330306217-s8vpfhe1ne2hibh2a8hoqva73ll43l6f.apps.googleusercontent.com', //
});

export const UserContext = React.createContext(null);

const Tab = createBottomTabNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Handle user state changes
    function onAuthStateChanged(u) {
      setUser(u);
      if (initializing) {
        setInitializing(false);
      }
    }
    return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, [initializing]);

  useEffect(() => {
    if (user) {
      return firestore()
        .collection('users')
        .onSnapshot(querySnapshot => {
          const retrievedUserArray = querySnapshot.docs.filter(
            d => d.id === user.uid,
          );
          if (retrievedUserArray.length > 0) {
            const data = retrievedUserArray[0]
              ? retrievedUserArray[0].data()
              : {};
            setUser({
              ...user,
              ...data,
            });
          } else {
            return firestore()
              .collection('users')
              .doc(user.uid)
              .set({data: {borrow: 0, donate: 0, holding: 0}});
          }
        });
    }
  }, [user, initializing]);

  if (initializing) {
    return null;
  }
  if (!user) {
    return (
      <View style={STYLES.loginView}>
        <Text style={{margin: 'auto', fontSize: 17}}>Welcome to Peas!</Text>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          onPress={async () => {
            await GoogleSignin.hasPlayServices();
            const {accessToken, idToken} = await GoogleSignin.signIn();
            const credential = auth.GoogleAuthProvider.credential(
              idToken,
              accessToken,
            );
            await auth().signInWithCredential(credential);
          }}
        />
      </View>
    );
  }
  return (
    <UserContext.Provider value={user}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Map') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Profile') {
                iconName = focused
                  ? 'account-circle'
                  : 'account-circle-outline';
              } else if (route.name === 'Community') {
                iconName = focused ? 'account-group' : 'account-group-outline';
              }

              // You can return any component that you like here!
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen name="Map" component={Map} />
          <Tab.Screen name="Profile" component={Profile} />
          <Tab.Screen name="Community" component={Community} />
        </Tab.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
