import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import db from '../../../services/sqlite';
import {format} from 'date-fns';

import {Ionicons, MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import fonts from '../../styles/fonts';
import colors from "../../styles/colors";

export default function AddTask(){
    const navigation = useNavigation();

    const [allTasks, setAllTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskName, setTaskName] = useState("");
    const [check, setCheck] = useState(true);

    function addTask(){
        if(taskName === ""){
            Alert.alert("Impossível de inserir Sub-tarefa", "Digite algo antes da inserção 😁");
        }
        else{
            setAllTasks(oldValue => [...oldValue, {key: `${oldValue.length}`, name: taskName}]);
            setTaskName("");
        }
    }

    function removeTask(key){
        setAllTasks(allTasks.filter(item => item.key !== key));
    }

    function saveTask(){
        let date = format(new Date(), "yyyy/MM/dd");
        let notificar;
        if(check === true){
            notificar = "s";
        }else{
            notificar = "n";
        }
        db.transaction((query) => {
            query.executeSql("INSERT INTO tasks(title, date, notificate)VALUES(?,?,?)", [taskTitle, date, notificar], (query, result) =>{
                let last_id = result.insertId;
                for(let i = 0; i < allTasks.length; i++){
                    query.executeSql("INSERT INTO sub_task(title, tasksId) VALUES(?,?)",[allTasks[i].name, last_id], (query, result) => {
                        if(result.rowsAffected > 0){
                            navigation.navigate("Main", {complete: true});
                            setTaskName("");
                            setTaskTitle("");
                            setAllTasks([]);
                        }
                        else{
                            Alert.alert("Erro");
                        }
                    }); 
                }
            });
        }, (error) => {
            Alert.alert("Erro", "Erro ao realizar o salvamento da Tarefa 😢" + error);
        });
    }

    return(
        <LinearGradient colors={[colors.background, colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.05, 1, 1]}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <Text style={styles.title}>Título</Text>
                            <TextInput value={taskTitle} style={styles.input} placeholder="" placeholderTextColor={colors.gray} onChangeText={(text) => setTaskTitle(text)} />
                        </View>

                        <View style={styles.flatListContainer}>
                            <FlatList data={allTasks} keyExtractor={(item) => String(item.key)} renderItem={({item}) => (
                                <View style={styles.itemView}>
                                    <View style={styles.itemButton}>
                                        <TouchableOpacity onPress={() => {removeTask(item.key)}}><Ionicons name="close" size={25} color={colors.background} /></TouchableOpacity>
                                        <Text style={{fontFamily: fonts.regular, color: colors.background}}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </View>
                            )} contentContainerStyle={styles.flatList} showsVerticalScrollIndicator={false} numColumns={3}/>
                            <View style={styles.subline}></View>
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.label}>Adicionar sub-tarefas</Text>
                            <TextInput value={taskName} style={styles.input} placeholder="" placeholderTextColor={colors.gray} onChangeText={(text)=> setTaskName(text)} />
                            <TouchableOpacity onPress={addTask} style={styles.button}>
                                <Ionicons name="add-sharp" size={30} color={colors.background} />
                                <Text style={styles.buttonTitle}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.button, {marginTop: 30,}]} onPress={()=> {setCheck(!check)}}>
                                { check ? <><Text style={styles.buttonTitle}>Notificar?</Text><MaterialCommunityIcons name="checkbox-marked" size={30} color={colors.background} /></>  : <><Text style={styles.buttonTitle}>Não Notificar?</Text><MaterialCommunityIcons name="checkbox-blank-off-outline" size={30} color={colors.background}/></> }
                                
                        </TouchableOpacity>

                        <TouchableOpacity onPress={saveTask} style={styles.submitButton}> 
                            <MaterialIcons name="add-task" size={30} color={colors.background}/>
                            <Text style={styles.label}>Criar Nova</Text> 
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: 120,
    },
    form:{
        alignItems: "center",
    },
    title:{
        fontFamily: fonts.heading,
        fontSize: 26,
        color: colors.dark_cyan
    },
    button: {
        flexDirection: "row",
        height: 30,
        alignSelf: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        borderRadius: 8
    },
    buttonTitle: {
        marginHorizontal: 5,
        color: colors.background,
        fontFamily: fonts.regular,
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
    input: {
        width: "70%",
        height: 50,
        backgroundColor: colors.background,
        borderRadius: 8,
        margin: 5,
        textAlign: "center",
        fontFamily: fonts.regular,
        borderWidth: 1,
        borderColor: colors.gray
    },
    label: {
        fontSize: 16,
        color: colors.background,
        fontFamily: fonts.heading,
        marginLeft: 10
    },
    flatListContainer: {
        width: "100%",
        height: "30%",
        marginVertical: 20,
    },
    flatList: {
        marginHorizontal: 5
    },
    subline: {
        width: "80%",
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        alignSelf: "center",
        marginTop: 1
    },
    itemView: {
        flex: 0.5
    },
    itemButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 3,
        marginVertical: 2,
        marginHorizontal: 2,
        backgroundColor: colors.gray,
        height: 40,
        borderRadius: 8
    }
})