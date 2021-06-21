import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback,
    Platform,
    Alert
} from 'react-native';
import db from '../../../services/sqlite';

import { LinearGradient } from 'expo-linear-gradient';

import {FontAwesome5, Feather, AntDesign} from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

import { Constants } from 'react-native-unimodules';
import { useRoute, useNavigation } from '@react-navigation/core';

export default function SignIn() {
    const navigation = useNavigation();
    const name = useRoute().params;

    const [user, setUser] = useState(name);
    const [pass, setPass] = useState("");
    const [r_pass, setR_pass] = useState("");
    const [tip, setTip] = useState("");
    const [code, setCode] = useState("");

    const [isFilled, setIsFilled] = useState([{id: 1, filled: !!name}, {id: 2, filled: false},{id: 3, filled: false},{id: 4, filled: false}]);
    const [isFilledPass, setIsFilledPass] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [CheckPassColor, setCheckPassColor] = useState(colors.gray);
    const [CheckPassEqualColor, setCheckPassEqualColor] = useState(colors.gray);

    function SignIn(){
        db.transaction((query) => {
            query.executeSql("INSERT INTO user(id,name,user,pass,tip,code)VALUES(?,?,?,?,?,?)", [1, name, user, r_pass, tip, code], (query, result) => {
                console.log(result.rowsAffected + " " + result.insertId +"  "+ result.rows.length);
                if(result.rowsAffected > 0){
                    Alert.alert('Registrado', "A partir daqui, você contará com nosso serviço de agendamento de tarefas ✔😁", 
                    [
                        {
                            text: "Ok",
                            onPress: () => {
                                navigation.navigate("LogIn");
                            }  
                        }
                    ]);
                }else{
                    Alert.alert('Não');
                }
            });
        }, (error) => {
            Alert.alert("Erro feio", `${error.message}`);
        });
    }
    function CheckIsFilled(id, text){
        if(text.length === 0){
            setIsFilled(isFilled.filter(item => item.id !== id));
            setIsFilled(oldValue => [...oldValue, {id: id, filled: false}]);
        }
        else{
            setIsFilled(isFilled.filter(item => item.id !== id));
            setIsFilled(oldValue => [...oldValue, {id: id, filled: true}]);
        }
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
    function checkEqual(Pass){
        if((Pass || r_pass) === pass){
            setCheckPassEqualColor(colors.green);
        }else{
            setCheckPassEqualColor(colors.alert);
        }
    }

    function CheckShowPass(){
        db.transaction((query) => {
            query.executeSql("SELECT * FROM user", [], (query, result) => {
                for(let i=0; i < result.rows.length; i++){
                    console.log(result.rows.item(i));
                }
            });
        })
        setShowPass(oldValue => !oldValue);
    }

    return(
        <LinearGradient colors={[colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.1, 1.0]}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.content}>
                            <View style={styles.form}>
                                <TextInput value={user} placeholder="Usuário" autoCorrect={false} style={[styles.input, isFilled.find(id => id.id === 1).filled ? { borderBottomColor: colors.cyan } : { borderBottomColor: colors.gray }]} onChangeText={(text) => {setUser(text); CheckIsFilled(1, text)}} />
                            </View>
                            <Text style={styles.tip}>Você pode alterar o nome de Usuário</Text>
                            <View style={styles.form}>
                                <TouchableOpacity activeOpacity={0.5} onPress={CheckShowPass}>
                                    <FontAwesome5 name={showPass ? "eye" : "eye-slash"} size={24} color={colors.gray} />
                                </TouchableOpacity>
                                <TextInput value={pass} placeholder="Palavra-passe" autoCorrect={false} style={[
                                    styles.input, isFilledPass ? { borderBottomColor: colors.cyan } : { borderBottomColor: colors.gray }
                                ]} onChangeText={(text) => {setPass(text); CheckIsFilledPass(text)}} secureTextEntry={showPass ? false : true} />
                                    <Feather name="check-circle" size={24} color={CheckPassColor} />
                            </View>
                            <View style={styles.form}>
                                    <Feather name="check-circle" size={24} color={CheckPassEqualColor} />
                                <TextInput value={r_pass} placeholder="Repita a palavra-passe" autoCorrect={false} style={[styles.input, isFilled.find(id => id.id === 2).filled ? { borderBottomColor: colors.cyan } : { borderBottomColor: colors.gray }]} onChangeText={(text) => {setR_pass(text); checkEqual(text); CheckIsFilled(2, text); }} secureTextEntry textAlign="center" />
                                    <Feather name="check-circle" size={24} color={CheckPassEqualColor} />
                            </View>
                            <View style={styles.form}>
                                <TextInput value={tip} placeholder="Dica para recuperação" autoCorrect={false} style={[styles.input, isFilled.find(id => id.id === 3).filled ? { borderBottomColor: colors.cyan } : { borderBottomColor: colors.gray }]} onChangeText={(text) => {setTip(text); CheckIsFilled(3, text)}} />
                            </View>
                            <View style={styles.form}>
                                <TextInput keyboardType="numeric" value={code} placeholder="Código de recuperação" autoCorrect={false} style={[styles.input, isFilled.find(id => id.id === 4).filled ? { borderBottomColor: colors.cyan } : { borderBottomColor: colors.gray }]} onChangeText={(text) => {setCode(text); CheckIsFilled(4, text)}} />
                            </View>
                            <Text style={styles.tip}>Use o código somente quando a dica não for suficiente para a recuperação do passe</Text>
                            <View style={styles.button}>
                                <TouchableOpacity style={styles.submitButton} onPress={SignIn}><AntDesign name="login" size={26} color={colors.background} /><Text style={styles.label}>SignIn</Text></TouchableOpacity>
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
        alignItems: "center",
        marginTop: Constants.statusBarHeight + 50
    },
    form:{
        flexDirection: "row",
        backgroundColor: colors.background,
        width: "90%",
        height: 60,
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 10,
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
    tip: {
        fontFamily: fonts.regular,
        fontSize: 13,
        color: colors.gray,
        marginTop: 10,
        textAlign: "center"
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