import React, {useState, useEffect} from 'react';

import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useFonts, LibreBaskerville_400Regular, LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import AppLoading from 'expo-app-loading'

import Routes from './routes';
import db from '../services/sqlite';

export default function App(){
  const [fontsLoaded] = useFonts({LibreBaskerville_400Regular, LibreBaskerville_700Bold});
  const [exist, setExist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function notificationF(){
     //await Notifications.cancelAllScheduledNotificationsAsync();
     const data = await Notifications.getAllScheduledNotificationsAsync();
    console.log("NOTIFICAÇÕES AGENDADAS ############");
    console.log(data);
   }
   notificationF();
}, []);
  useEffect(() => {
         const subscriptions = Notifications.addNotificationReceivedListener(
          async notification => {
            const data = notification.request.content.data
         });
        return () =>  subscriptions.remove(); 
  }, []);
  useEffect(()=>{
    async function checkUserExists(){
      db.transaction((query) =>{
        query.executeSql("SELECT * FROM user",[], (query, result) => {
          if(result.rows.length > 0){
            setExist(true); 
            setLoading(false);
          }else{
            setExist(false); 
            setLoading(false);
          }
        });
      }, (error) => {
        console.log(error.message);
      });
    }
    checkUserExists();
  },[]);
  
  if(!fontsLoaded){  
    return <AppLoading/>
  }
  if(loading === true){
    return <AppLoading/>
  }

  return(
    <>
      <StatusBar translucent={true} style="dark"/>
      <Routes name={exist} />
    </>
  );  
}
