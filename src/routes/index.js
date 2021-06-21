import React from 'react';
import { NavigationContainer, useRoute } from '@react-navigation/native';

import UserRoutes from './userRoutes';


export default function Routes(name){
    return(
        <NavigationContainer>
            <UserRoutes data={name} />
        </NavigationContainer>
    );
}
