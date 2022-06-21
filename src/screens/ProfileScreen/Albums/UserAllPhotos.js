import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity,TextInput,Dimensions} from 'react-native'
import React,{useState,useEffect,useContext} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import firebase  from '@react-native-firebase/app';

var { height, width } = Dimensions.get('window');

const UserAllPhotos = ({route,navigation}) => {

  const [posts,setPosts] = useState([])
  const [serachposts, searchsetPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  
  const getPosts = async ()=>{
    const querySanp = await firestore().collection('Albums').doc(firebase.auth().currentUser.uid).collection('groups').doc('전체사진').collection('photos').orderBy('postTime', 'desc').get()
    const allposts = querySanp.docs.map(docSnap=>docSnap.data())
   //  console.log(allusers)
   console.log('Posts: ', posts );
   setPosts(allposts)
   
}

useEffect(()=>{
    getPosts()
},[])

const RenderCard = ({item})=>{
    return (
      <TouchableOpacity 
      onPress={() => navigation.navigate('PhotoDetail',{ foldername : route.params.fname} )}>
      <View  style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }]}>
      <Image 
      style={{
          flex: 1,
          alignSelf: 'stretch',
          width: undefined,
          height: undefined,
          backgroundColor: '#c2c2c2'
      }}
      source={{uri: item.img}}
      />
    
      </View>
      </TouchableOpacity>
    )
}
    return (
      <View style={styles.container}>
          <View style={styles.padding}>

        <TouchableOpacity>
        <View style={styles.folderContainer}>
      <Icon name="folder"  size={23} color="orange"/>
      <Text style={{fontSize : 18,fontFamily: 'DungGeunMo'}}> {route.params.fname}</Text>
        
        
        
        </View>

        </TouchableOpacity>

        <View style={styles.titleConainer}>
      
      <Text style={{fontSize : 25,fontFamily: 'DungGeunMo'}}>{route.params.name} 님의 사진첩</Text>

      <Text style={{color : '#129fcd', fontSize : 20,fontFamily: 'DungGeunMo',marginTop : 5,}}>{posts.length}</Text>
        
        </View>
        
        </View>

        <FlatList 
          data={posts}
          horizontal={false}
          numColumns={3}
          renderItem={({item})=> {return <RenderCard item={item} />
        }}
         
        />    


       
        
        </View>
        
        
    
  );
};

export default UserAllPhotos;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
     
    },


    padding: {
        padding : 20,
        backgroundColor: '#fff',
        
       
      },
    folderContainer :{
      flexDirection: 'row', // 혹은 'column'
      marginBottom: 15,
      marginTop : 30,
    },
    titleConainer:{
      flexDirection: 'column', // 혹은 'column'
    },
    title:{
      flexDirection: 'row', // 혹은 'column'
      flex: 1,
    },
    miniroom: {
      width:'100%', 
      height:150,
      justifyContent: 'space-around',
      alignItems:'center',
      marginTop: 30,
      paddingVertical: 8,
      paddingHorizontal: 12,
     
    },
    fab: {
      width:45,
      height:45,
      position: 'absolute',
      margin: 25,
      right: 0,
      bottom: 0,
      borderTopLeftRadius: 30,
		  borderTopRightRadius: 30,
      borderBottomLeftRadius : 30,
      borderBottomRightRadius : 30,

      backgroundColor:"orange"
      },
  });