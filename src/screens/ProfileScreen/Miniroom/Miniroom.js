import { View, Text,TouchableOpacity,StyleSheet,Image,SafeAreaView,Button,Dimensions,Animated,PanResponder} from 'react-native';
import React,{useState,useEffect,useRef} from 'react'
import { DraxView,DraxProvider,DraxList } from 'react-native-drax';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import ToolInven from './ToolInven';
import MinimiInven from './MinimiInven';
import MusicInven from './MusicInven';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import MiniroomBox from '../../../components/MiniroomBox/MiniroomBox';
import useStore from '../../../../store/store';
import firestore from '@react-native-firebase/firestore'; 
import firebase  from '@react-native-firebase/app';

const Tab = createMaterialTopTabNavigator();
const gestureRootViewStyle = { flex: 1};
const Miniroom = () => {  
  const usersBackgroundCollection = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('background').doc(firebase.auth().currentUser.uid+ 'mid');
  const usersToolCollection = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('tool');  
  const {tooladdress,settooladdress,Backaddress} = useStore();
  const [tool, setTool] = useState();
  const [Back, setBack] = useState(null);
  
  const getBackground = async ()=>{ 
    const querySanp = await firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('background').doc(firebase.auth().currentUser.uid + 'mid').get()
    const allposts = querySanp.docs.map(docSnap=>docSnap.data())
   //  console.log(allusers)
   console.log('Posts: ', Back );
   setBack(allposts)
   
}
  const getTool = async () => {
    try {
      const datatool = await usersToolCollection.get();
      setTool(datatool._docs.map(doc => ({ ...doc.data(), id: doc.id, })));
    } catch (error) {
      console.log(error.message);
    }
  };


  useEffect(() => {
    getBackground();
    getTool();
  }, [tooladdress,Backaddress]);
  const getBack = a => {
    if(!a){
    return <Text>없어용</Text>
  } return <View>
                <Image style={{width:'100%',height:'100%'}}source={{uri:`${Back ? Back[Back.length-1].address : '없어용'}`}}/> 
</View>
  }
  return (
    <GestureHandlerRootView style={gestureRootViewStyle}>      
          <View style={{flex:1,}}> 
          <Image style={{width:'100%',height:'100%'}}source={{uri: Back ? Back.address : 'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/Background%2Fbackground1.png?alt=media&token=f59b87fe-3a69-46b9-aed6-6455dd80ba45'}}/>
          
            <View style={{flexWrap:"wrap"}}>
            {
        tool?.map((row, idx) => {
         {
            return  <MiniroomBox test={row.address} x={row.getx} y={row.gety} name={row.name}></MiniroomBox>;} 
      })
      }
      </View>
    </View>
        <View style={styles.miniroom}>
        <Tab.Navigator>
      <Tab.Screen name="가구" component={ToolInven} />
      <Tab.Screen name="미니미" component={MinimiInven} />
      <Tab.Screen name="배경" component={MusicInven} />
    </Tab.Navigator>
    
        </View>
    </GestureHandlerRootView>
  ); 
};

export default Miniroom;
const styles = StyleSheet.create({
    miniroom: {
      width:'100%', 
      height:250,
    },
    receivingZone: {
      height: (Dimensions.get('window').width / 4) - 12,
      borderRadius: 10,
      width: (Dimensions.get('window').width / 4) - 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 5
    },
    receiving: {
      borderColor: 'red',
      borderWidth: 2,
    },
    draggableBox: {
      width: (Dimensions.get('window').width / 4) - 12,
      height: (Dimensions.get('window').width / 4) - 12,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 5
    },
    dragging: {
      opacity: 0.2,
    },
    hoverDragging: {
      borderColor: 'magenta',
      borderWidth: 2,
    },
    receivingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly'
    },
    itemSeparator: {//아래 리스트 안 사각형 간격
      height: 12
    },
    draxListContainer: {
      padding: 5,
      height: 250
    },
    receivingZoneContainer: {
      padding: 5,
      height: 300,
  
    },
    textStyle: {
      fontSize: 18
    },
    title:{ 
      height:50,
      backgroundColor: 'orange',
      justifyContent: "center",
      flexDirection: 'row',
      alignItems: "center",
    },
    titleText:{
      color:'white',
      marginTop:10,
      height:40,
      fontSize:20,
      textAlign:'center'
      },
      box:{
        translateX:194,
        translateY:-150,
        height: 20,
        width: 20,
        borderColor: "blue",
        borderWidth:1,
        borderRadius: 5
      },
      draggable: {
        width: 70,
        height: 70,
        borderWidth:1,
      },
      receiver: {
        width: 100,
        height: 100,
        backgroundColor: 'green',
      },
      draggableBox: {
        height: (Dimensions.get('window').width / 4) - 12,
          borderRadius: 80,
          width: (Dimensions.get('window').width / 4) - 12,
          justifyContent: 'center',
          flexWrap:'wrap',
          borderWidth:1,
          flex:1,
      }
  });