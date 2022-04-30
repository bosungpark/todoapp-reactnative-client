import { StatusBar } from 'expo-status-bar';
import {useState, useEffect} from "react";
import { StyleSheet, 
          Text, 
          View, 
          TouchableOpacity, 
          TextInput,
          ScrollView,
          TouchableHighlight,
          TouchableWithoutFeedback,
          Pressable,
        } from 'react-native';
// import { useEffect } from 'react/cjs/react.production.min';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 

const STORAGE_KEY="@toDos";

export default function App() {
  const [working, setWorking]= useState(true);
  const [text, setText]= useState("");
  const [toDos, setToDos]= useState({})

  useEffect(() => {
    loadToDos();
  }, []);

  const travel= () => setWorking(false);
  const work= () => setWorking(true);
  const onChangeText= (payload) => setText(payload);
  
  const saveToDos= async (toSave) => {
    const s= JSON.stringify(toSave)
    await AsyncStorage.setItem(STORAGE_KEY, s)
  };
  
  const loadToDos= async() => {
    const s= await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
    // console.log(s)
  };
  
  const addToDo= async () =>{
    if(text===""){
      return;
    }
    const newToDos = {
      ...toDos, 
      [Date.now()]: {text, working:working}
    };     
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }

  const deleteToDo= async (key) => {
    Alert.alert("Delete to do", "are you sure?",
      [{text:"Cancel"},
      {
      text: "Yes, I'm sure", 
      // style: "destructive",
      onPress: async () => {
        const newToDos={...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      },
    },
    ]);
  };
  // return;
  // console.log(toDos);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white": theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.gray: "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a To Do?": "Where do you want to go?"} 
        style={styles.input}/>
        <ScrollView>{
          Object.keys(toDos).map((key) => (
            toDos[key].working === working ? (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={()=>deleteToDo(key)}>
              <Text style={styles.toDoText}><FontAwesome5 name="trash-alt" size={18} color="theme.gray" /></Text>
            </TouchableOpacity> 
          </View>):null ))
        }</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input:{
    backgroundColor:"white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,  
    fontSize: 18,
    marginBottom: 30
  },
  toDo:{
    backgroundColor:theme.gray,
    marginBottom: 10,
    paddingVertical:20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
  },
  toDoText:{
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  }
});
