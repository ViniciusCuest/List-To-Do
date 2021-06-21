import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

import LottieView from 'lottie-react-native';
import {LinearGradient} from 'expo-linear-gradient';

import colors from '../../styles/colors';

export default function Load(){
    return(
        <LinearGradient colors={[colors.background, colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.05, 1, 1]}>
            <View style={styles.container}>
                <LottieView speed={3} source={require('../../assets/loader.json')} autoPlay loop style={styles.animated} />
            </View>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    animated: {
        backgroundColor: "transparent",
        width: 350,
        height: 350,
        marginTop: 20
    }
});