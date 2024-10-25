import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: 'white' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && event.defaultPrevented === false) {
            // Here we call runOnJS if you need to execute something specific
            runOnJS(() => {
              navigation.navigate(route.name);
              // Additional logic can be added here
            })();
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <Text style={{ color: isFocused ? 'blue' : 'black' }}>
              {options.tabBarLabel !== undefined ? options.tabBarLabel : options.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
