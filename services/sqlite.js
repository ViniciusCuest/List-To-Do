import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("TaskManager", "1.0", "Banco de Dados do Gerenciador de Tarefa", 20000);

db.transaction((query) => {
    query.executeSql("CREATE TABLE IF NOT EXISTS user(id INTEGER, name TEXT, user TEXT, pass TEXT, tip TEXT, code TEXT)");
    query.executeSql("CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, title TEXT NOT NULL, date TEXT NOT NULL, notificationToken TEXT, notificationDate TEXT, notificate TEXT, alertDate TEXT, alerted TEXT DEFAULT 'n')");
    query.executeSql("CREATE TABLE IF NOT EXISTS sub_task(id_task INTEGER PRIMARY KEY, title TEXT NOT NULL, checked TEXT DEFAULT 'n', tasksId INTEGER NOT NULL, FOREIGN KEY (tasksId) REFERENCES tasks(id) ON DELETE CASCADE)");
}, (err) => {
    console.log("Message: " + err.message);
}, () => {
    console.log("Message: Banco de Dados Aberto com success");
});

export default db;
