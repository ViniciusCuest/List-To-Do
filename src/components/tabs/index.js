import React, { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Modal,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/core'
import Animated from 'react-native-reanimated';
import * as Gesture from 'react-native-gesture-handler';

import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';

import {LinearGradient} from 'expo-linear-gradient';

import * as Notifications from 'expo-notifications';
import * as Icon from '@expo/vector-icons';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import db from '../../../services/sqlite';

export function Tabs({ title, dateTime, chave, items }) {
    const navigation = useNavigation();
    const [modal, setModal] = useState(false);

    const [selectDate, setSelectDate] = useState(new Date());
    const [openPicker, setOpenPicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);

    function ChangeDateTime(DateTime){
        setOpenPicker(false);
        setOpenTimePicker(false);
        let converted = DateTime.nativeEvent.timestamp;

        if(converted && isBefore(converted, new Date())){
            setSelectDate(new Date());
            return Alert.alert("Tempo escolhido está no passado", "Escolha uma data/hora no futuro");
        }
        if(converted){
            setSelectDate(converted);
        }
    }

    async function saveNotification(){
        Alert.alert("Selecionar esse horário?",`Manter o horário: ${format(selectDate, "dd/MM/yyyy - HH:mm")} e salvar a alteração?`, [
            {
                text: "Não",
                onPress: () => {

                }
            },
            {
                text: "Sim",
                onPress: () => {
                    Notifications.setNotificationHandler({
                        handleNotification: async () => ({
                          shouldShowAlert: true,
                          shouldPlaySound: false,
                          shouldSetBadge: false,
                        }),
                      });
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Heeey, 🍃',
                            body: `Está na hora de cuidar da sua vida`,
                            sound: true,
                            priority: Notifications.AndroidNotificationPriority.HIGH,
                            data: {
                                items
                            },
                        },
                        trigger: {
                            seconds: 60 * 1440,
                            repeats: true,
                        }
                    }).then(Response => {
                        db.transaction((query) => {
                            console.log(Response);
                            query.executeSql("UPDATE tasks SET notificationToken = ? WHERE id = ?", [Response, items.id], (query, result) => {
                                if(result.rowsAffected > 0){
                                    console.log("ok");
                                }else{
                                    console.log("nada");
                                }
                            }, (error) => {
                                console.log("caiu aqui");
                            });
                        }, (error) => {
                            console.log(error.message);
                        });
                    }); 
                }
            }
        ]);
    }

    return (
        <>
        <Gesture.Swipeable overshootRight={false} renderRightActions={() => (
            <Animated.View>
                <View style={{ flexDirection: "row" }}>
                    <Gesture.RectButton style={styles.buttonEdit} onPress={() => { navigation.navigate("EditTask", items) }}>
                        <Icon.Ionicons name="pencil-sharp" size={24} color={colors.background} />
                    </Gesture.RectButton>
                    <Gesture.RectButton style={styles.buttonRemove} onPress={chave}>
                        <Icon.Ionicons name="md-trash-outline" size={24} color={colors.background} />
                    </Gesture.RectButton>
                </View>
            </Animated.View>
        )}>
        <Modal visible={modal}>
            <LinearGradient colors={[colors.background, colors.dark_cyan, colors.cyan]} style={styles.container} start={0, 0} end={1, 1} locations={[0.05, 1, 1]}>
                <View style={styles.modalContent}>
                    <View style={styles.modalForm}>
                        <TouchableOpacity style={styles.modalButton} onPress={()=>{setModal(!modal)}}><Icon.Ionicons name="close" size={35} color={colors.background}/></TouchableOpacity> 
                        <View style={styles.modalSetDate}>
                            {(openPicker == true) && (
                                <>
                                <DateTimePicker value={selectDate} mode="date" display="default" onChange={ChangeDateTime} />
                                </>
                            )}
                            {(openTimePicker == true) && (
                                <>
                                <DateTimePicker value={selectDate} mode="time" display="default" onChange={ChangeDateTime} />
                                </>
                            )}
                            {Platform.OS === "android" && (
                                <>
                                    <Text style={styles.description}>
                                        {`Alterar Dia/Horário: \n`}
                                    </Text>
                                    <Text style={styles.dateTime}>
                                        {format(selectDate, "dd/MM/yyyy - HH:mm")}
                                    </Text>
                                </>
                            )}
                        </View>
                        <View style={[styles.modalSetDate, {flexDirection: "row", justifyContent: "space-around", alignSelf: "auto"}]}>
                            <TouchableOpacity style={{alignSelf: "flex-start"}} onPress={()=>{ setSelectDate(new Date()) }}><Icon.MaterialCommunityIcons name="reload" size={35} color={colors.background} /></TouchableOpacity>
                            <TouchableOpacity style={{alignSelf: "flex-end"}} onPress={()=>{ setOpenPicker(!openPicker) }}><Icon.Ionicons name="calendar-sharp" style={{marginBottom: 10}} size={35} color={colors.background} /></TouchableOpacity>
                            <TouchableOpacity style={{alignSelf: "flex-end"}} onPress={()=>{ setOpenTimePicker(!openTimePicker) }}><Icon.MaterialIcons style={{marginBottom: 10}} name="more-time" size={35} color={colors.background} /></TouchableOpacity>                        
                        </View>
                        <View style={styles.modalNotif}>
                            <Text style={[styles.dateTime, {textAlign: "center", fontSize: 15, fontFamily: fonts.heading, color: colors.warning}]}>Você será notificado todos os dias {'\n'} Até a data final da tarefa {'\n'}</Text>
                            <Text style={[styles.description, {textAlign: "center", lineHeight: 20}]}>Ao contrário desejando {'\n'} desativar as notificações</Text>
                        </View>
                        <View style={styles.buttonView}>
                            <TouchableOpacity onPress={saveNotification} style={styles.submitButton}><Icon.MaterialCommunityIcons name="timetable" size={30} color={colors.background} /><Text style={styles.label}>Notificar</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </Modal>
            <Gesture.RectButton style={styles.button} onPress={() => navigation.navigate("TaskInfo", items)}>
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.content}>
                    <Gesture.TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={()=>{setModal(!modal)}}>
                        <Icon.MaterialCommunityIcons name={(items.date === null) ? "clock-check-outline" : "clock-alert-outline"} size={25} color={(items.alertDate === null) ? colors.warning  : colors.cyan} />
                        <Text style={[styles.description, {marginHorizontal: 5, marginRight: 5}]}>{(items.alertDate === null) ? "Sem definição" : items.alertDate }</Text>
                        <Icon.Ionicons name={(items.notificate === "s") ? "notifications-circle-outline" : "notifications-off-circle-outline" } size={30} color={(items.notificate === "s") ? colors.background : colors.warning} />
                    </Gesture.TouchableOpacity>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon.MaterialIcons name="playlist-add" size={24} color={colors.background} style={{ marginRight: 5 }} />
                        <Text style={[styles.description, { marginTop: 3 }]}>{format(new Date(dateTime), "dd/MM/yyyy")}</Text>
                    </View>
                </View>
            </Gesture.RectButton>
        </Gesture.Swipeable>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    modalContent:{
        backgroundColor: colors.gray,
        width: "80%",
        height: 500,
        borderRadius: 20,
    },
    modalButton: {
        alignSelf: "flex-end",
        marginHorizontal: 5,
        marginBottom: 20,
    },
    modalSetDate:{
        marginTop: 10,
        flexDirection: "column",
        paddingVertical: 5,
        alignSelf: "center",
    },
    modalNotif:{
        marginTop: 20,
        alignItems: "center",
    },
    button: {
        flexDirection: "row",
        alignSelf: "center",
        width: "88%",
        height: 80,
        backgroundColor: colors.gray,
        borderRadius: 12,
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginVertical: 3,
    },
    content: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-end"
    },
    title: {
        fontFamily: fonts.heading,
        fontSize: 18,
        color: colors.background
    },
    description: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.background
    },
    dateTime:{
        fontFamily: fonts.heading,
        fontSize: 18,
        color: colors.cyan
    },
    buttonRemove: {
        backgroundColor: colors.alert,
        height: 75,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        alignSelf: "center",
        marginTop: 5,
        position: "relative",
        right: 20,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    buttonEdit: {
        backgroundColor: colors.warning,
        height: 75,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        alignSelf: "center",
        marginTop: 5,
        position: "relative",
        right: 19,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    buttonView:{
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
        backgroundColor: colors.dark_cyan,
        borderWidth: 2,
        borderColor: colors.cyan
    },
    label: {
        fontSize: 16,
        color: colors.background,
        fontFamily: fonts.heading,
        marginLeft: 10,
    },
});
