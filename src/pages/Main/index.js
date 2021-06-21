import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
} from 'react-native'

import db from '../../../services/sqlite';
import {useRoute, useNavigation} from '@react-navigation/core';

import { Tabs } from '../../components/tabs';
import Load from '../../components/loading';

import {LinearGradient} from 'expo-linear-gradient';
import Constants from 'expo-constants';
import {Ionicons} from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function Main(){
    const navigation = useNavigation();
    const route = useRoute();
    const dados = route.params;

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [data, setData] = useState([]);

    async function deleteTask(data){
        Alert.alert("Excluir?", "Deseja realmente excluir essa tarefa?", [
            {
                text: "Não",
                onPress: () => Alert.alert("Certinho...", "Ainda bem que decidiu em não excluir a/o "+`"${data.title}"`+" 😎"),
                style: "cancel"
            },
            {
                text: "Sim",
                onPress: async () => {
                    db.transaction((query) => {
                        query.executeSql("DELETE FROM tasks WHERE id = ?", [data.id], (query, result) => {
                            if(result.rowsAffected > 0){
                                query.executeSql("DELETE FROM sub_task WHERE tasksId = ?", [data.id]);
                                Alert.alert("Excluindo...", "Poxa, exclusão finalizada 😢", [
                                    {
                                        text: "Ok",
                                        onPress: () => setData((oldValue) => oldValue.filter((item) => item.id !== data.id)),
                                    }
                                ]);
                            }
                            else{
                                Alert.alert("ERRO AO DELETAR");
                            }
                        });
                    });
                }
            }],
        {
            cancelable: true
        });
    }

    async function loadValues(){
        db.transaction((query)=>{
            query.executeSql("SELECT * FROM tasks",[], (query, results) => {
                let Values = [];
                for(let i = 0; i < results.rows.length; i++){   
                    Values.push(results.rows.item(i));
                }
                setData(Values);
                setTimeout(()=> {
                    setLoading(false);
                }, 2500);
            });
        });
    }

    useEffect(()=>{
        setUserData(dados);
        loadValues();
    },[]);

    if(loading)
        return <Load/>

    return(
        <LinearGradient colors={[colors.background, colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.05, 1, 1]}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Tarefas</Text>
                    <TouchableOpacity onPress={()=>{ navigation.navigate("ScannerBarCode"); }}>
                        <Ionicons name="settings-outline" size={40} color={colors.dark_cyan} />
                    </TouchableOpacity>
                </View>
                <View style={styles.tabsContent}>
                    <FlatList data={data} keyExtractor={(item) => String(item.id)} renderItem={({item}) => (
                        <Tabs title={item.title} dateTime={item.date} items={item} chave={() => { deleteTask(item)} } />
                    )} contentContainerStyle={styles.flatListContent} />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header: {
        flexDirection: "row",
        width: "90%",
        height: 65,
        marginTop: Constants.statusBarHeight + 20,
        marginLeft: 20,
        justifyContent: "space-between",
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    headerTitle: {
        fontFamily: fonts.heading,
        fontSize: 38,
        color: colors.dark_cyan
    },
    headerName: {
        flexDirection: "row",
        width: "90%",
        height: 70,

        marginLeft: 20,

        alignItems: "center",
        justifyContent:"space-between"
    },
    headerTitleName: {
        fontFamily: fonts.heading,
        fontSize: 28,
        color: colors.dark_cyan,
        marginHorizontal: 5,
    },
    tabsContent: {
        marginTop: 20,
    },
    flatListContent: {
        marginVertical: 5,
    }
});