import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, getDocs, collection, onSnapshot, getDoc } from "firebase/firestore";

// here is the feed where users can see jios from other users
// there will also be a button to bring users to create their own jio
// yet to be implemented
const SocialScreen = ({navigation}) => {
  // loading true while retrieving posts
  const [loading, setLoading] = useState(true);
  // retrieve user info from Firestore
  var hall;
  var block;
  var level;
  var name;
  const [h, setH] = useState('');
  const [b, setB] = useState('');
  const [l, setL] = useState('');
  const [n, setN] = useState('');
  const getInfo = async () => {
    // console.log("getting info");
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await onSnapshot(docRef, (doc) => {
      const data = doc.data();
      // console.log("retrieved info");
      // console.log(data.hall)
      hall = data.hall;
      setH(data.hall);
      block = data.block;
      setB(data.block);
      level = data.level;
      setL(data.level);
      name = data.name;
      setN(data.name);
    });
  };

  // retrieve posts
  const [jios, setJios] = useState();
  const getPosts = async () => {
    // to store data
    const posts = new Array();
    // gets all posts
    const querySnapshot = await getDocs(collection(db, "posts"));
    // for each document
    await querySnapshot.forEach(doc => {
      // retrieves document data (name, hall, time etc)
      let data = doc.data()
      // console.log("retrieved: " + doc.id);
      // console.log(hall);
      const start = data.startDateTime.toDate();
      const end = data.endDateTime.toDate();
      const date = new Date();
      // if current date is within start and end
      const withinDate = end >= date;
      // adds it to the newBookings array as a tuple - with the data and the doc id
      if (withinDate && (
        // privacy setting is open
        (data.privacy === 'O') 
        // or privacy setting is hall and the hall is same as current user's
        || (data.privacy === 'H' && data.hall === hall) 
        // or privacy setting is block and the block and hall is same as current user's
        || (data.privacy === 'B' && data.hall === hall && data.block === block)
        // or privacy setting is level and the block, hall and level is same as current user's
        || (data.privacy === 'L' && data.hall === hall && data.block === block && data.level === level))) {
            posts.push({data: data, id: doc.id});
            // console.log("added: " + doc.id)
      }
    })

    setLoading(false);

    posts.sort((post1, post2) => post1.data.startDateTime.seconds - post2.data.startDateTime.seconds);
    setJios(posts);
    // console.log(jios);
  }

  useEffect(() => {
    getInfo();
    const unsub = navigation.addListener('focus', () => {
      getPosts();
    });
  }, [navigation])

  // function to render each item in flatList (each booking)
  function renderList({item}) {
    // convert start Date and Time to String
    const start = item.data.startDateTime.toDate();
    const startDate = start.getDate() + "/" + (start.getMonth() + 1) + "/" + (start.getYear() + 1900);
    const startTime = start.getHours() + 'hrs ' + start.getMinutes() + 'min';
    const starting = startDate + " " + startTime;

    // convert end Date and Time to String
    const end = item.data.endDateTime.toDate();
    const endDate = end.getDate() + "/" + (end.getMonth() + 1) + "/" + (end.getYear() + 1900);
    const endTime = end.getHours() + 'hrs ' + end.getMinutes() + 'min';
    const ending = endDate + " " + endTime;

    return (
      <View style={styles.itemContainer}>
        <Text>Post by: {item.data.name}</Text>
        <Text>From: {starting}</Text>
        <Text>To: {ending}</Text>
        <Text>Location: {item.data.location}</Text>
        <Text>Description: {item.data.text}</Text>
      </View>
    )
  }

  // function to render the screen after all bookings retrieved i.e. load finished
  function Loaded(props) {
    return (
      <View style={styles.listContainer}>
        
        <FlatList
          style={styles.item}
          data={jios}
          renderItem={renderList}
          keyExtractor={item => item.id}
        />

        <TouchableOpacity
        // button to post
          onPress={() => {
            navigation.navigate("Post", {
              hall: h,
              block: b,
              level: l,
              name: n
            });
          }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Post</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View
      style={styles.container}
    >
   {loading 
    ? <ActivityIndicator 
        size="large"
        color="black"
      />
    : <Loaded />
    }     

    </View>
  )
}

export default SocialScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '30%',
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontSize: 16,
  },
  item: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 8,
    marginHorizontal: 16,
},
itemContainer: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginBottom: 10,
},
listContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
})