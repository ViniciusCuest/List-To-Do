import db from './sqlite';

var val;

const controller = {
    loginPage: {
        checkUserExists: () => {
            db.transaction((query) => {
                query.executeSql("SELECT * FROM user", [], (query, result) => {
                    if(result.rows.length > 0){
                        
                    }
                    else{
                        val = false;
                    }
                });
                }, (error) => {

                }, () => {                
            });        
        },
        handleLogin: (user, senha) => {
            db.transaction((query) => {
                query.executeSql("SELECT * FROM user", [], (query, result) => {
                    if (result.rowsAffected > 0) {
                        result.rows.item(0);
                    } else {
                        console.log(result.rowsAffected);
                    }
                });
            }, (error) => {
                console.log("erro" + error.message);
            }, () => {
                console.log("certo");
            });
        },
    },
}
export default controller;