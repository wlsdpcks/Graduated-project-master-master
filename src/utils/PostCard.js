import React, {useContext, useEffect, useState,useCallback} from 'react';
import colors from '../res/colors';
import images from '../res/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../../styles/FeedStyles';
import {Image, Dimensions,Text, View, StyleSheet, TouchableWithoutFeedback,RefreshControl} from 'react-native';
import ProgressiveImage from './ProgressiveImage';
import AppText from '../components/Sns/AppText'
import { AuthContext } from './AuthProvider';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import firebase  from '@react-native-firebase/app';

const PostCard = ({item, onPress,onDelete,}) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [likeData, setlikeData] = useState([]);
  const [likeCheckData, setlikeCheckData] = useState(null);
  const [likeIcon, setLikeIcon] = useState(false)
  const [currentUserLike, setCurrentUserLike] = useState(false)
  const [isLiked, setIsLiked] = useState(false);
  const navigation = useNavigation();
  const [deleted, setDeleted] = useState(false);


  const [refreshing, setRefreshing] = useState(false);
  const likecolor = '#ff0800'
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const handleLiked = () => {
    !isLiked
      ? onLikePress(item)
      : onDislikePress(item);
    setIsLiked(!isLiked);
  };

  const onLikePress = (item) => {
    firestore()
    .collection('posts')
    .doc(item.postid)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .set({
      uid : firebase.auth().currentUser.uid
    }).then(() => {
      firestore()
      .collection('posts')
      .doc(item.postid)
      .update({
        likes : item.likes + 1
        
      })
      setDeleted(true);


    })

}
const onDislikePress = (item) => {
    firestore()
    .collection('posts')
    .doc(item.postid)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .delete().then(() => {
      firestore()
      .collection('posts')
      .doc(item.postid)
      .update({
        likes : item.likes - 1
        
      })
      setDeleted(true);

    })
}

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
      
          setUserData(documentSnapshot.data());
        }
      });
  };

  const getlikes = async(item) => {
   
    const querySanp = await firestore()
    .collection('posts')
    .doc(item.postid)
    .collection("likes")
    .get()

    const allcomments = querySanp.docs.map(docSnap=>docSnap.data())
    setlikeData(allcomments)
      
    
  }
  const getlikescheck = async(item) => {
   
    const querySanp = await firestore()
    .collection('posts')
    .doc(item.postid)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if (documentSnapshot.exists) {
    
        setlikeCheckData(documentSnapshot.data());
      }

    });
};

  

  useEffect(() => {
    getUser();
    getlikes(item);
    getlikescheck(item);
    setDeleted(false);
  }, [deleted,refreshing]);

  return (
    <Card key={item.id}refreshControl={
      <RefreshControl
         refreshing={refreshing}
         onRefresh={onRefresh}
       />
     }>
        <View style={Styles.container}>
      <View style={Styles.nameContainer}>
        <Image
          source={{uri: userData
            ? userData.userImg ||
              'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
            : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
        }}
          style={Styles.personImage}
        />
        <View>
        <TouchableOpacity onPress={onPress}>
          <Text style={Styles.personName}> {userData ? userData.name || 'Test' : 'Test'}{' '} </Text>
          
          </TouchableOpacity>
        </View>
      </View>
     
    </View>
          
       
      
      
    <Image source={{uri: item.postImg}} style={Styles.postImg} />

    <View style={Styles.container}>
      <View style={Styles.iconContainer}>
        <View style={Styles.leftIcons}>
        
        {(() => { 
      if (likeCheckData ? likeCheckData.uid : '' === firebase.auth().currentUser.uid) 
         
      return  <Ionicons name="heart" size={25} color={'#ff0800'} onPress={() => onDislikePress(item)}

      />
      else
       return <Ionicons name="heart" size={25} color={'#545454'} onPress={() => onLikePress(item)}

      />
      
      })()} 
      
       
             
         
              
            
        
            <View style={{marginLeft: 5}}>
        <TouchableOpacity onPress={() => navigation.navigate('PostComment',{uid : item.uid, postid: item.postid, name : item.post} )}>  
          <Ionicons name="chatbubble-ellipses" size={23} color={'#545454'}  />
        </TouchableOpacity>
        </View>
        <View style={{marginLeft: 5}}>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
        {user.uid == item.uid ? (
         
            <Ionicons name="trash" size={23} />
          
        ) : null}
        </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
    <AppText style={Styles.likes}>  {likeData.length} likes</AppText>
    <View
      style={{
        marginStart: 15,
        marginEnd: 15,
        flexDirection: 'column',
        marginTop: 10,
      }}>
      <Text style={{color: 'black', fontWeight: 'bold', fontSize: 13}}>
      {userData ? userData.name : ''}
      </Text>
      <Text style={{color: 'black'}}>{item.post}</Text>
    </View>
    <TouchableOpacity
      style={{marginTop: 5, marginStart: 15}}
      onPress={() => console.log('Pressed Post Comments')}>
      <Text style={{color: colors.textFaded2}}>
        View all  comments
      </Text>
    </TouchableOpacity> 

    <Text
        style={{
          color: colors.textFaded2,
          marginTop: 5,
          marginStart: 15,
          fontSize: 12,
        }}>
       {moment(item.postTime.toDate()).fromNow()}
      </Text>

 
    </Card>
  );
};

export default PostCard;
const Styles = StyleSheet.create({
container: {
  backgroundColor: 'white',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 12,
  marginBottom: 6,
  marginStart: 10,
  marginEnd: 10,
  alignItems: 'center',
},
nameContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
},
personImage: {
  width: 30,
  height: 30,
  borderRadius: 30,
},
personName: {
  color: 'black',
  marginStart: 10,
  fontWeight: 'bold',
},
placeName: {
  color: colors.text,
  marginStart: 10,
  fontSize: 12,
},
iconMore: {
  height: 15,
  width: 15,
},
postImg: {
  height: Dimensions.get('screen').height / 3,
  width: Dimensions.get('screen').width,
  
},
container2: {
  justifyContent: 'space-between',
  flexDirection: 'row',
  //paddingStart: 20,
  marginEnd: 15,
  marginTop: 15,
},
actionIcons: {
  width: 23,
  height: 23,
  marginStart: 15,
},
container3: {
  padding: 15,
},
iconContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 10,
},
leftIcons: {
  flexDirection: 'row',
  width: 100,
},
likes: {
  fontSize: 14,
  fontWeight: 'bold',
},
});
