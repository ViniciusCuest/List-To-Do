import React, {useState} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    Alert
} from 'react-native';

import {useNavigation} from '@react-navigation/core';

import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome5, Feather, AntDesign } from '@expo/vector-icons'; 

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import db from '../../../services/sqlite';

export default function LogIn(){
    const navigation = useNavigation();

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const [isFilled, setIsFilled] = useState(false);
    const [isFilledPass, setIsFilledPass] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [CheckPassColor, setCheckPassColor] = useState(colors.gray);

    function login(){
        db.transaction((query) => {
            query.executeSql("SELECT * FROM user WHERE user = ? AND pass = ?",[user, pass], (query, result) => {
                if(result.rows.length > 0){
                    navigation.navigate("Main", result.rows.item(0));
                }
                else{
                    Alert.alert("Erro");
                }
            });
        }, (error) => {
            Alert.alert("Query Error",`${error.message}`)
        });
    }

    function CheckIsFilled(User){
        User ? setIsFilled(true) : setIsFilled(false);
    }
    function CheckIsFilledPass(Pass){
        Pass ? setIsFilledPass(true) : setIsFilledPass(false);
        switch(Pass.length){
            case 0:
                setCheckPassColor(colors.alert);
            break;
            case 1:
                setCheckPassColor(colors.warning);
            break;
            case 4:
                setCheckPassColor(colors.orange);
            break;
            case 8:
                setCheckPassColor(colors.green);
            break 
        }
    }

    function CheckShowPass(){
        setShowPass(oldValue => !oldValue);
    }
    return(
        <LinearGradient colors={[colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.1, 1.0]}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>    
                        <View style={styles.content}>
                            <View style={styles.form}>
                                <TextInput value={user} placeholder="User" autoCorrect={false} style={[styles.input, isFilled ? {borderBottomColor: colors.green} : {borderBottomColor: colors.gray } ]} onChangeText={(text)=> setUser(text)}/>
                            </View>
                            <View style={styles.form}>
                                <TouchableOpacity activeOpacity={0.5} onPress={CheckShowPass}>
                                    <FontAwesome5 name={showPass ? "eye" : "eye-slash"} size={24} color={colors.gray}/>
                                </TouchableOpacity>
                                <TextInput value={pass}  placeholder="Password" autoCorrect={false} style={[
                                    styles.input, isFilledPass ? {borderBottomColor: colors.green} : {borderBottomColor: colors.gray } 
                                ]} onChangeText={(text) => setPass(text)} secureTextEntry={showPass ? false : true}/>
                                <TouchableOpacity>
                                    <Feather name="check-circle" size={24} color={CheckPassColor} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.button}>
                                <TouchableOpacity style={styles.submitButton} onPress={login}><AntDesign name="login" size={26} color={colors.background} /><Text style={styles.label}>Login</Text></TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    form:{
        flexDirection: "row",
        backgroundColor: colors.background,
        width: "90%",
        height: 60,
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 5,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    button:{
        flexDirection: "row",
        width: "100%",
        height: 60,
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 20,
        paddingHorizontal: 0,
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
    label: {
        fontSize: 16,
        color: colors.background,
        fontFamily: fonts.heading,
        marginLeft: 10,
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