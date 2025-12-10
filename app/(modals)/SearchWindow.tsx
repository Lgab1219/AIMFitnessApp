import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import supabase from "../../supabase";

type Food = [{
  id?: number,
  name?: string,
  calories?: number
}]

export default function SearchWindow() {

    const router = useRouter();

    // State holding the search query
    const [searchQuery, setSearchQuery] = useState<string>("");

    // State holding the search results for viewing
    const [searchResults, setSearchResults] = useState<Food>([{}]);

    const [userId, setUserId] = useState<string | null>(null);

    const [currentCalories, setCurrentCalories] = useState<number>(0);

    async function handleSearch(query: string) {

      if (!query) {
        return;
      }

      try {
        // Client asks server for search results based on query
        const res = await fetch(`http://192.168.1.6:3000/search?query=${encodeURIComponent(query)}`);

        // Turn received response from server into JSON
        const data = await res.json();

        setSearchResults(data.foods);
      } catch (error) {
        console.error("Error fetching search results: ", error);
      }
    }

    // Fetch current calories on component mount
    useEffect(() => {
      async function fetchCurrentCalories() {
        const { data: user } = await supabase.auth.getUser();

        const id = user.user?.id || null;

        setUserId(id);
      
        const { data: calories, error: calorieError } = await supabase
          .from('calories_data')
          .select('current_calories')
          .eq('user_id', user.user?.id);
      
        if (calorieError) {
          console.log("ERROR fetching calories: ", calorieError);
          return;
        }
      
        if (calories) {
          setCurrentCalories(calories[0].current_calories);
        }
      }

      fetchCurrentCalories();
    }, []);

    async function updateCurrentCalories(newCalories: number) {
      setCurrentCalories((prevCalories) => prevCalories + newCalories);

      const { error } = await supabase
        .from('calories_data')
        .update({ current_calories: currentCalories + newCalories })
        .eq('user_id', userId);

      if (error) {
        console.log("ERROR updating calories: ", error);
        return;
      }

      router.replace('/DashboardScreen');
    }



    return (
      <>
            <ScrollView style={{ flex: 1, backgroundColor: '#E0E0E0', paddingTop: 50 }}>
                <View style={styles.titleContainer}>
                    <TouchableHighlight underlayColor='#E0E0E0' style={{ backgroundColor: '#E0E0E0', marginBottom: '20%' }}
                        onPress={() => { router.dismiss() }} >
                        <Text style={styles.exitStyle}>x</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.subtitleStyle}>Search your food</Text>
                    <TextInput 
                    style={{ borderColor: '#000000', borderWidth: 1, width: '100%', padding: 10 }} 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}/>
                    <TouchableHighlight underlayColor='#e6733c' style={styles.buttonStyle}>
                      <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 18, fontWeight: '600' }} onPress={() => handleSearch(searchQuery)}>Search</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.foodsContainer}>
                    {searchResults ? searchResults.map((food) => (
                      <TouchableHighlight style={styles.food} key={food.id} 
                      underlayColor= '#e6733c' 
                      onPress={() => {updateCurrentCalories(food.calories ?? 0)}}>
                        <>
                        <Text>{food.name}</Text>
                        <Text>Calories: {food.calories}</Text>
                        </>
                      </TouchableHighlight> 
                    )) : <Text>No results found.</Text>}
                </View>
            </ScrollView>
      </>
    )
}

const styles = StyleSheet.create({
  food: {
    flexDirection: 'column',
    gap: 4,
    backgroundColor: '#E0E0E0',
    borderWidth: 1 || 0,
    borderColor: '#000000',
    paddingInline: 15,
    paddingVertical: 10
  },
  foodsContainer: {
    flexDirection: 'column',
    gap: 12,
    paddingInline: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#E0E0E0',
    paddingInline: "5%",
  },

  subtitleStyle: {
    color: '#2E2D2D',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 20,
  },

  buttonStyle: {
    backgroundColor: '#f0803c',
    padding: 20,
    borderRadius: 5,
    width: '70%',
    alignSelf: 'center',
  },

  exitStyle: {
    color: '#2E2D2D',
    textAlign: 'right',
    padding: 10,
    fontSize: 40,
    fontWeight: '600'
  }
})