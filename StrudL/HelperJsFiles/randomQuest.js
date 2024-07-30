// Import or define the JSON data
import questsData from '../HelperJsonFiles/quests.json'; // Adjust the path to your JSON file

// Function to select 3 random quests
const getThreeRandomQuests = () => {
    const quests = questsData;
  if (!Array.isArray(quests) || quests.length === 0) {
    return [];
  }
  
  // Shuffle the array
  const shuffled = quests.sort(() => 0.5 - Math.random());

  // Select the first 3 elements from the shuffled array
  return shuffled.slice(0, 3);
};
export default getThreeRandomQuests;

// Example usage
