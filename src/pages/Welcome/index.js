import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback,
    Platform,
    TextInput
} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {MaterialIcons} from '@expo/vector-icons'
import {LinearGradient} from 'expo-linear-gradient';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { Constants } from 'react-native-unimodules';

export default function Welcome(){
    const navigation = useNavigation();
    const [user, setUser] = useState("");
    const [isFilled, setIsFilled] = useState(false);
    function CheckIsFilled(User){
        User ? setIsFilled(true) : setIsFilled(false);
    }
    return(
        <LinearGradient colors={[colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.1, 1.0]}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.content}>
                            <View style={styles.main}>
                                <Text style={styles.label}>Bem-vindo ao</Text>
                                <Text style={styles.title}>Task Manager</Text>
                                <Text style={[styles.title, {textAlign: "right", lineHeight: 50,}]}>😉📌</Text>
                                <Text style={styles.description}>Aqui você poderá salvar tudo o que deseja {'\n'} que iremos alertá-lo 😜</Text>
                            </View>
                            <View style={styles.form}>
                                <TextInput value={user} placeholder="Diga-nos seu nome" autoCorrect={false} style={[styles.input, isFilled ? { borderBottomColor: colors.cyan } : { borderBottomColor: colors.gray }]} onChangeText={(text) => {setUser(text); CheckIsFilled(text)}} />
                            </View>
                            <View style={styles.button}>
                                <TouchableOpacity style={styles.submitButton} onPress={() => { navigation.navigate("SignIn", user); }}><Text style={styles.buttonTitle}>Próxima</Text><MaterialIcons name="navigate-next" size={26} color={colors.background} /></TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15
    },
    main: {
        marginTop: Constants.statusBarHeight + 120
    },
    title: {
        fontSize: 42,
        color: colors.background,
        fontFamily: fonts.heading,
        textAlign: "center",
        lineHeight: 80
    },
    label: {
        fontSize: 25,
        color: colors.background,
        fontFamily: fonts.heading,
        textAlign: "left",
    },
    description: {
        fontSize: 15,
        color: colors.background,
        fontFamily: fonts.regular,
        marginTop: 50,
        textAlign: "center",
    },
    button:{
        flexDirection: "row",
        width: "100%",
        height: 60,
        justifyContent: "center",
        marginTop: 30
    },
    buttonTitle: {
        fontSize: 16,
        color: colors.background,
        fontFamily: fonts.heading,
        marginLeft: 10,
    },
    submitButton: {
        height: 55,
        width: "50%",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        borderRadius: 8,
        marginTop: 30,
        backgroundColor: colors.cyan,
        borderWidth: 2,
        borderColor: colors.gray
    },
    form:{
        flexDirection: "row",
        backgroundColor: colors.background,
        width: "90%",
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        borderRadius: 8,
        paddingHorizontal: 10,
        alignSelf:'center',
        marginTop: 30,
        marginBottom: 30
    },
    input:{
        width: "70%",
        height: 50,
        backgroundColor: colors.background,
        borderRadius: 8,
        margin: 5,
        textAlign: "center",
        borderBottomWidth: 2,
        borderBottomColor: colors.gray,
        fontFamily: fonts.regular
    }
});
