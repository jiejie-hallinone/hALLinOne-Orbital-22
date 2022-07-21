import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, getDocs, collection, onSnapshot, getDoc } from "firebase/firestore";

// here is the feed where users can see jios from other users
// there will also be a button to bring users to create their own jio
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
  /**
   * read user info from firestore 
   */
  const getInfo = async () => {
    // console.log("getting info");
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await onSnapshot(docRef, (doc) => {
      // read document
      const data = doc.data();
      // console.log("retrieved info");
      // console.log(data.hall)
      // store info
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
  /**
   * read posts from firestore
   */
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
      // convert start and end time to JS Date
      const start = data.startDateTime.toDate();
      const end = data.endDateTime.toDate();
      const date = new Date();
      // if current date is within start and end
      const withinDate = end >= date;
      // adds it to the posts array as a tuple - with the data and the doc id
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

    // done retrieving
    setLoading(false);

    // sort by start time
    posts.sort((post1, post2) => post1.data.startDateTime.seconds - post2.data.startDateTime.seconds);
    // store posts
    setJios(posts);
    // console.log(jios);
  }

  // refresh user info and posts every time page is visited
  useEffect(() => {
    getInfo();
    const unsub = navigation.addListener('focus', () => {
      getPosts();
    });
  }, [navigation])

  // function to render each item in flatList (each post)
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
      // details of post - user name, start and end, location, description
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
          ListFooterComponent={<Text>No more posts</Text>}
          ListFooterComponentStyle={styles.footer}
        />

        <TouchableOpacity
        // button to post
          onPress={() => {
            // bring user to post page, with user's hall, block, level and name
            navigation.navigate("Post", {
              hall: h,
              block: b,
              level: l,
              name: n
            });
          }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Image source={require('../../assets/plus.png')} style={{width: 30, height: 30, tintColor: '#0782F9'}} />
        </TouchableOpacity>
      </View>
    )
  }

  // show loading wheel if still retrieving posts, else show posts and post button
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
    width: '30%',
    alignItems: 'center',
    marginBottom: 5
  },
  buttonOutline: {
    marginTop: 5,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontSize: 16,
  },
  item: {
    width: '100%',
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
  footer: {
    marginTop: 2,
    marginBottom: 5,
    alignItems: 'center'
  }
})