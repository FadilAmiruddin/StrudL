import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapScreen from './MapScreen'; // Adjust the path as necessary
import getDistrictFromCoordinates from '../HelperJsFiles/DistrintFinder.js';
import useLocation from '../HelperJsFiles/locationPerms';
import getThreeRandomQuests from '../HelperJsFiles/randomQuest';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
  const myLocation = useLocation();
  const [bottom, setBottom] = useState(-80);// makes the drawyer work
  const  [zIndex, setZIndex] = useState(-1); // This is to hide the quest info
  const [isSmall, setIsSmall] = useState(false);//boolean to see if the drawer is open or not
  const [district, setDistrict] = useState(''); // The district name
  const [Q1, setQ1] = useState(''); // The quest name
  const [Q2, setQ2] = useState(''); // The quest name
  const [Q3, setQ3] = useState(''); // The quest name
  const [QuestTitle, setQuestTitle] = useState(''); // The quest name
  const [Quest1Description, setQuest1Description] = useState(''); // The quest description
  const [Quest2Description, setQuest2Description] = useState(''); // The quest description
  const [Quest3Description, setQuest3Description] = useState(''); // The quest description

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
      }
    };
    updateDistrict();
  }, [myLocation]);
  const Xpress = () => {
    setZIndex(-1);
  }
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

  const Go1 = () => {
    setQuestTitle(Q1)
    setQuestDescription(Quest1Description);
    setZIndex(1);
    
  };

  const Go2 = () => {
    setQuest2Description(Quest2Description)
    setQuestTitle(Q2)
    setZIndex(1);
  }

  const Go3 = () => {
    setQuestTitle(Q3)
    setQuest3Description(Quest3Description)
    setZIndex(1);
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
<View 
	style = {{
		backgroundColor: "#FF5555",
		borderRadius: 2,
		paddingVertical: 10,
		paddingHorizontal: 30,
		marginBottom: 16,
		marginHorizontal: 10,
    bottom: -130,
    marginRight: 210,
	}}>
	<Text 
		style = {{
			color: "#FFFFFF",
			fontSize: 22.5,
		}}>
		{"Start"}
	</Text>
</View>
<View 
	style = {{
		alignItems: "center",
		backgroundColor: "#6C6C6C",
		borderRadius: 2,
		paddingVertical: 10,
		paddingHorizontal: 30,
		marginBottom: 16,
		marginHorizontal: 10,
    bottom: -65,
    marginRight: -110,
    
	}}>
	<Text 
		style = {{
			color: "#FFFFFF",
			fontSize: 22.5,
		}}>
		{"Open in Maps"}
	</Text>
</View>


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
