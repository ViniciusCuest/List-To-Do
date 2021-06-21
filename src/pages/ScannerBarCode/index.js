import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Platform, SafeAreaView } from 'react-native';
import * as Calendar from 'expo-calendar';

async function getDefaultCalendarSource() {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
  return defaultCalendars[0].source;
}

async function createCalendar() {
  Calendar.createEventAsync("1",{
    title: "remember",
    startDate: new Date(),
    endDate: new Date(),
    allDay: false,
    alarms: ALARM,
    timeZone: "pt-br"
  })
}

export default function ScannerBarCode() {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

      }
    })();
  }, []);

  return(
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Button style={styles.button} title="Create a new calendar" onPress={createCalendar} />
    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#000",
    height: 40,
    width: 90, 
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 200,
  }
});