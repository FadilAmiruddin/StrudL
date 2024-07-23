import React, { useState, useEffect ,Platform} from 'react';
import { View, StyleSheet, Text, TouchableOpacity ,Linking,Alert} from 'react-native';
import MapScreen from './MapScreen'; // Adjust the path as necessary
import getDistrictFromCoordinates from '../HelperJsFiles/DistrintFinder.js';
import useLocation from '../HelperJsFiles/locationPerms';
import getThreeRandomQuests from '../HelperJsFiles/randomQuest';
import Icon from 'react-native-vector-icons/Ionicons';

const openInMaps = (myLat,myLong,lat, long) => {
  const url = `http://maps.apple.com/?saddr=${myLat},${myLong}&daddr=${lat},${long}`;
  Linking.openURL(url);

   
    
};
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}
function isCloseToDestination(userLat, userLon, destLat, destLon, thresholdKm) {
  const distance = haversineDistance(userLat, userLon, destLat, destLon);
  return distance <= thresholdKm;
}

const App = () => {
  const TooFarAway = () =>
    Alert.alert('Looks Like you are a bit far', 'Navigate to the location first to initiate the quest.', [
      {
        text: 'Go Back',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Navigate', onPress: () => handleMaps()},
    ]);

  const myLocation = useLocation();
  const [bottom, setBottom] = useState(-80); // Makes the drawer work
  const [zIndex, setZIndex] = useState(-1); // This is to hide the quest info
  const [isSmall, setIsSmall] = useState(false); // Boolean to see if the drawer is open or not
  const [district, setDistrict] = useState(''); // The district name
  const [Q1, setQ1] = useState(''); // The quest name
  const [Q2, setQ2] = useState(''); // The quest name
  const [Q3, setQ3] = useState(''); // The quest name
  const [QuestTitle, setQuestTitle] = useState(''); // The quest name
  const [Quest1Description, setQuest1Description] = useState(''); // The quest description
  const [Quest2Description, setQuest2Description] = useState(''); // The quest description
  const [Quest3Description, setQuest3Description] = useState(''); // The quest description
  const [Q1Coords, setQ1Coords] = useState({ latitude: 0, longitude: 0 });
  const [Q2Coords, setQ2Coords] = useState({ latitude: 0, longitude: 0 });
  const [Q3Coords, setQ3Coords] = useState({ latitude: 0, longitude: 0 });
  const [QuestCoords, setQuestCoords] = useState({ latitude: 0, longitude: 0 });
  const [QuestDescription, setQuestDescription] = useState(''); // The quest description

  useEffect(() => {
    const updateDistrict = async () => {
      if (myLocation.latitude && myLocation.longitude) {
        const newDistrict = await getDistrictFromCoordinates(myLocation.latitude, myLocation.longitude);
        setDistrict(newDistrict);
        const quests = getThreeRandomQuests();
        setQ1(quests[0].questName);
        setQ2(quests[1].questName);
        setQ3(quests[2].questName);
        setQuest1Description(quests[0].questDescription);
        setQuest2Description(quests[1].questDescription);
        setQuest3Description(quests[2].questDescription);
        setQ1Coords({ latitude: quests[0].latitude, longitude: quests[0].longitude });
        setQ2Coords({ latitude: quests[1].latitude, longitude: quests[1].longitude });
        setQ3Coords({ latitude: quests[2].latitude, longitude: quests[2].longitude });
      }
    };
    updateDistrict();
  }, [myLocation]);

  const Xpress = () => {
    setZIndex(-1);
  };

  const handlePress = () => {
    if (!isSmall) {
      setBottom(-290); // Move the rectangle up
      setIsSmall(true);
    } else {
      setBottom(-80); // Move the rectangle down
      setIsSmall(false);
    }
    console.log('Button pressed');
  };
  
  const handleMaps = () => {
    if (QuestCoords.latitude && QuestCoords.longitude) {
      openInMaps(myLocation.latitude,myLocation.longitude,QuestCoords.latitude, QuestCoords.longitude);
    }
    console.log('Button pressed');
  };
  const handleStart = () => {
    if (QuestCoords.latitude==myLocation.latitude && QuestCoords.longitude==myLocation.longitude) {
      console.log('You are at the destination');
    }
    else {
      console.log('You are not at the destination');
      TooFarAway();
    }
    console.log('Button pressed');
  };
  const Go1 = () => {
    setQuestTitle(Q1);
    setQuestDescription(Quest1Description);
    setZIndex(1);
    setQuestCoords(Q1Coords);
  };

  const Go2 = () => {
    setQuestTitle(Q2);
    setQuestDescription(Quest2Description);
    setZIndex(1);
    setQuestCoords(Q2Coords);
  };

  const Go3 = () => {
    setQuestTitle(Q3);
    setQuestDescription(Quest3Description);
    setQuestCoords(Q3Coords);
    console.log(Q3Coords);
    setZIndex(1);
    distanceInKm = haversineDistance(myLocation.latitude, myLocation.longitude, Q3Coords.latitude, Q3Coords.longitude);
    console.log(isCloseToDestination(distanceInKm))
  };
  return (
    <View style={styles.container}>
      <MapScreen style={styles.map} />
      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleText}>{district}</Text>
      </View>

      <View style={[styles.QuestInfo, { zIndex }]}>
      <View style={styles.icon}>
      <TouchableOpacity onPress={Xpress}>
        <Icon name="close" size={30} color="#000" />
      </TouchableOpacity>
    </View>
    <Text style={styles.title}>Quest:</Text>
    <Text style={styles.questT}>{QuestTitle}</Text>
    
    <Text style={styles.image}>Image here, idk where image from</Text>


    <View 
	style = {{
		flexDirection: "row",
		backgroundColor: "#D9D9D9",
		borderRadius: 20,
		paddingTop: 20,
		paddingBottom: 28,
		paddingHorizontal: 15,
		marginBottom: 40,
    bottom: -160,
		marginHorizontal: 20,
	}}>
	<Text 
		style = {{
			color: "#000000",
			fontSize: 22.5,
			marginBottom: 8,
		}}>
		{"Objectives\n\n"}
	</Text>
	<Text 
		style = {{
			fontSize: 16,
			flex: 1,
     bottom: -30,
     
		}}>
      {QuestDescription}
	</Text>
</View>

<TouchableOpacity 
  style={styles.buttonWrapper} 
  onPress={handleStart}
  activeOpacity={0.7} // Adjust this value as needed
>
<View 

	style = {{
		backgroundColor: "#FF5555",
		borderRadius: 2,
    bottom: -450,
	}}>
	<Text 
		style = {{
			color: "#FFFFFF",
			fontSize: 22.5,
		}}>
		{"Start"}
	</Text>
</View>
</TouchableOpacity>




<TouchableOpacity 
  style={styles.buttonWrapper} 
  onPress={handleMaps}
  activeOpacity={0.7} // Adjust this value as needed
>
  
  
  
  
  
  <View 
    style={{
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#6C6C6C",
      borderRadius: 2,
      paddingVertical: 10,
      paddingHorizontal: 30,
      marginBottom: 16,
      marginHorizontal: -10,
      width: 200,
      height: 50,
      bottom: -435,
      right: -200,
    }}
  >
    <Text 
      style={{
        color: "#FFFFFF",
        fontSize: 22.5,
      }}
    >
      {"Open in Maps"}
    </Text>
  </View>
</TouchableOpacity>

      </View>






      <View style={[styles.rectangle, { bottom }]}>
        <TouchableOpacity style={styles.buttonWrapper} onPress={handlePress}>
          <View style={styles.modalHeaderButton} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Today’s Quests</Text>

        <View style={styles.questContainer}>
          <View style={styles.questTextContainer}>
            <Text style={styles.questTitle}>{Q1}</Text>
            <Text style={styles.questDistance}>20km</Text>
          </View>
          <View style={styles.flexSpacer} />
          <TouchableOpacity style={styles.goButton} onPress={Go1}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.questContainer}>
          <View style={styles.questTextContainer}>
            <Text style={styles.questTitle}>{Q2}</Text>
            <Text style={styles.questDistance}>15m</Text>
          </View>
          <View style={styles.flexSpacer} />
          <TouchableOpacity style={styles.goButton} onPress={Go2}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.questContainer}>
          <View style={styles.questTextContainer}>
            <Text style={styles.questTitle}>{Q3}</Text>
            <Text style={styles.questDistance}>30km</Text>
          </View>
          <View style={styles.flexSpacer} />
          <TouchableOpacity style={styles.goButton} onPress={Go3}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    top: 100,
    bottom: 100
  },
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    marginLeft: 300,
  },
  bubbleContainer: {
    position: 'absolute',
    top: 10,
    left: 100,
    height: 50,
    width: 200,
    backgroundColor: '#FFFFFF',
    borderColor: '#EEEEEE',
    borderRadius: 30,
    borderWidth: 1,
    paddingVertical: 10,
    marginBottom: 276,
    alignItems: 'center',
    shadowColor: '#00000040',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  bubbleText: {
    color: '#2FCDFF',
    fontSize: 20,
  },
  rectangle: {
    position: 'absolute',
    width: '100%',
    height: 348,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  QuestInfo: {
    position: 'absolute',
    width: '100%',
    height: 600,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    bottom: -80,
  },
  buttonWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 90,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalHeaderButton: {
    width: 70,
    height: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    marginBottom: 32,
    marginLeft: 280,
  },
  modalTitle: {
    color: '#000000',
    fontSize: 30,
    marginBottom: 15,
  },
  questContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
  },
  questTextContainer: {
    flex: 3,
    alignSelf: 'flex-start',
    marginRight: 6,
  },
  questTitle: {
    color: '#000000',
    fontSize: 18,
    marginBottom: 2,
  },
  questDistance: {
    color: '#6C6C6C',
    fontSize: 15,
  },
  flexSpacer: {
    flex: 1,
  },
  goButton: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    paddingVertical: 14,
  },
  goButtonText: {
    color: '#000000',
    fontSize: 22.5,
  },
});

export default App;
