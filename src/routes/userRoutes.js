import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import BottomTabsRoutes from '../routes/userTabs';

import TaskInfo from '../pages/TaskInfo';
import EditTask from '../pages/EditTask';
import UnloggedRoutes from './unloggedRoutes';
import ScannerBarCode from '../pages/ScannerBarCode';

const Stack = createStackNavigator();

const UserRoutes = (data) => (
    <Stack.Navigator>
        <Stack.Screen name="Unlogged" initialParams={data} component={UnloggedRoutes} options={{
            headerShown: false
        }}/>
        <Stack.Screen name="Main" component={BottomTabsRoutes} options={{
            headerShown: false
        }} />
        <Stack.Screen name="TaskInfo" component={TaskInfo} options={{
             headerShown: false
        }}/>
        <Stack.Screen name="EditTask" component={EditTask} options={{
             headerShown: false
        }}/>
        <Stack.Screen name="ScannerBarCode" component={ScannerBarCode} options={{
            headerShown: false
        }} />
    </Stack.Navigator>
);

export default UserRoutes;