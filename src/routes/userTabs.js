import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { MaterialIcons } from '@expo/vector-icons';

import Main from '../pages/Main';
import AddTask from '../pages/AddTask';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

const Tabs = createBottomTabNavigator();

const BottomTabsRoutes = (data) => (
    <Tabs.Navigator tabBarOptions={{
        keyboardHidesTabBar: true,
        labelPosition: "beside-icon",
        style: {
            height: 60,
            backgroundColor: colors.dark_cyan,
            borderTopWidth: 1,
            borderTopColor: colors.dark_cyan
        },
        labelStyle: {
            fontFamily: fonts.regular,
            color: "#fff"
        }
    }}>
        <Tabs.Screen name="Main" initialParams={data.route.params} component={Main} options={{
            tabBarLabel: "Favoritos",
            tabBarIcon: () => (
                <MaterialIcons name="saved-search" size={25} color={colors.background}/>
            )

        }} />
        <Tabs.Screen name="AddTask" component={AddTask} options={{
            tabBarLabel: "Adicionar",
            tabBarIcon: () => (
                <MaterialIcons name="playlist-add" size={25}color={colors.background} />
            )
        }} />
    </Tabs.Navigator>
);

export default BottomTabsRoutes;