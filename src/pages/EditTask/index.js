import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import { useRoute,useNavigation } from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient'

import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import colors from '../../styles/colors';

export default function EditTask(){
    const navigation = useNavigation();
    const route = useRoute().params;
    console.log(route);
    return(
        <LinearGradient colors={[colors.background, colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.05, 1, 1]}>
            <SafeAreaView style={styles.container}>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={()=>{navigation.navigate("Main")}} style={[styles.button, {position: "absolute", left: 10}]}><Ionicons name="chevron-back-circle" size={40} color={colors.background}/></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{}} style={[styles.button, {position: "absolute", right: 10}]}><MaterialCommunityIcons name="check-circle" size={40} color={colors.background} /></TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 60,
        backgroundColor: colors.dark_cyan,
        alignItems: "center"
    }
});