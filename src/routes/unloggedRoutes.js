import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import LogIn from '../pages/LogIn';
import SignIn from '../pages/SignIn';
import Welcome from '../pages/Welcome';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

const Stack = createStackNavigator();
const UnloggedRoutes = (data) =>  (
    <Stack.Navigator>
        {data.route.params.data.name
            ?
            <Stack.Screen component={LogIn} name="LogIn" options={{
                title: "Login",
                headerStyle: {
                    backgroundColor: colors.dark_cyan,
                },
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontFamily: fonts.heading,
                    color: colors.background
                }
            }} />
            :
            <>
            <Stack.Screen component={Welcome} name="Welcome" options={{
                headerShown: false
            }} />
            <Stack.Screen component={SignIn} name="SignIn" options={{
                title: "SignIn",
                headerStyle: {
                    backgroundColor: colors.dark_cyan,
                },
                headerTitleAlign: "center",
                headerPressColorAndroid: colors.cyan_light,
                headerTintColor: colors.background,
                headerTitleStyle: {
                    fontFamily: fonts.heading,
                    color: colors.background
                },
            }} />
            <Stack.Screen component={LogIn} name="LogIn" options={{
                title: "Login",
                headerStyle: {
                    backgroundColor: colors.dark_cyan,
                },
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontFamily: fonts.heading,
                    color: colors.background
                }
            }} />
            </>
        }
    </Stack.Navigator>
);
export default UnloggedRoutes;