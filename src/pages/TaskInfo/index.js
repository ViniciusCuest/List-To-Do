import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';

import Constants from 'expo-constants';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import {LinearGradient} from 'expo-linear-gradient';

import {format} from 'date-fns';

import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useRoute, useNavigation } from '@react-navigation/core';
import db from '../../../services/sqlite';

export default function TaskInfo() {
    const navigation = useNavigation();
    const data = useRoute().params;
    const [subTasks, setSubTasks] = useState([]);

    const [check, setCheck] = useState([]);
    const [origCheck,setOrigCheck] = useState([]);

    useEffect(() => {
        LoadInfo(data.id);
    }, []);
    function LoadInfo(key) {
        db.transaction((query) => {
            query.executeSql("SELECT * FROM tasks INNER JOIN sub_task ON tasksId = id WHERE tasksId = ?", [key], (query, result) => {
                let values = [];
                let original = []; 
                let checks = [];
                for(let i=0; i < result.rows.length; i++){
                    values.push(result.rows.item(i));
                    checks.push({id: result.rows.item(i).id_task, check: result.rows.item(i).checked});
                    original.push({id: result.rows.item(i).id_task, check: result.rows.item(i).checked});
                }      
                setCheck(checks);
                setOrigCheck(original);
                setSubTasks(values);
            });
        });
    }
    function SaveChanges(){
        if(JSON.stringify(origCheck) === JSON.stringify(check)){
            Alert.alert("Nenhuma mudança", "Faça alguma alteração para poder salvar! 😉");
        } 
        else{
            for(let i = 0; i < origCheck.length; i++){
                if(origCheck[i].check !== check[i].check){
                    db.transaction((query) => {
                        query.executeSql("UPDATE sub_task SET checked = ? WHERE id_task = ?", [check[i].check, check[i].id], (query, result) => {
                            console.log(result.rowsAffected);
                        });
                    }, (err) => {
                        console.log("Error " + err.message);
                    }, () => {
                       
                    });
                }
            }
            Alert.alert("Tarefa concluída", "Alteração realizada com sucesso! 😜");
        }
    }
    function Checking(index){
        if(check[index].check === 'n'){
            check[index].check = 's';
            setCheck((oldValues) => [...oldValues]);
        }
        else{
            check[index].check = 'n';
            setCheck((oldValues) => [...oldValues]);
        }
    }
    return (
        <LinearGradient colors={[colors.background, colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.05, 1, 1]}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Info - {data.title}</Text>
                    <View style={{flexDirection: "row",alignSelf: "flex-end", alignItems: "center", justifyContent: "center"}}>
                        <FontAwesome name="calendar-check-o" size={20} color={colors.gray} />
                        <Text style={[styles.headerDescription, {marginTop: 5, marginLeft: 3}]}>{ format(new Date(data.date), "dd/MM/yyyy")}</Text>
                    </View>
                </View>
                <View style={styles.FlatList}>
                    <FlatList data={subTasks} keyExtractor={(item) => String(item.id_task)} renderItem={({item, index}) => (
                        <View style={[styles.containerCheck, (check[index].check === 's') ? {marginLeft: 50} : {}]}>
                            <TouchableOpacity onPress={()=> { 
                                Checking(index);
                                }} style={styles.buttonCheck}>{ (check[index].check === 's') ? <MaterialCommunityIcons name="checkbox-marked" size={35} color={colors.background} />  : <MaterialCommunityIcons name="checkbox-blank-off-outline" size={35} color={colors.background}/> }</TouchableOpacity>
                            <Text style={[styles.titleCheck, (check[index].check === 's') ? {textDecorationLine: "line-through", textDecorationColor: "#000", opacity: 0.8 } : {}]}>{item.title}</Text>
                        </View>
                    )} showsVerticalScrollIndicator={false} contentContainerStyle={styles.flatListContent} />
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={()=>{navigation.navigate("Main")}} style={[styles.button, {position: "absolute", left: 10}]}><Ionicons name="chevron-back-circle" size={40} color={colors.background}/></TouchableOpacity>
                    <TouchableOpacity onPress={SaveChanges} style={[styles.button, {position: "absolute", right: 10}]}><Ionicons name="checkmark-circle" size={40} color={colors.background} /></TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignSelf: "center",
        width: "95%",
        height: 80,
        marginTop: Constants.statusBarHeight + 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        justifyContent: "space-around",
    },
    headerTitle: {
        fontFamily: fonts.heading,
        fontSize: 28,
        color: colors.dark_cyan
    },
    headerDescription: {
        fontFamily: fonts.heading,
        fontSize: 12,
        color: colors.dark_cyan,
    },
    FlatList: {
        flex: 1,
        marginTop: 5,
        marginBottom: 60
    },
    button:{
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.gray,
        borderRadius: 12,
    },
    footer: {
        flexDirection: 'row',
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 60,
        backgroundColor: colors.dark_cyan,
        alignItems: "center"
    },

    containerCheck: {
        flexDirection: "row",
        marginTop: 10,
        marginHorizontal: 10,
        alignItems: "center",
    },
    titleCheck: {
        fontFamily: fonts.regular,
        color: colors.gray,
        fontSize: 24,
        marginHorizontal: 8,
    },
    buttonCheck:{
        backgroundColor: colors.gray,
        borderRadius: 12,
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 10
    }
});