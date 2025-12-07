import supabase from "@/supabase";
import { GoogleGenAI } from "@google/genai";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function DashboardScreen() {

  // Create seperate AI file to use fetched values to generate starting values (calorie budget) for user profile
  // Before generating values, check if user profile already has values set
  // Turn AI's string output and store into a variable to be displayed on the dashboard screen

  const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string;

  if (!googleApiKey) {
    console.log("Google API Key is missing");
  }

  // Initialize AI client
  const ai = new GoogleGenAI({ apiKey: googleApiKey });

  // State to hold user data
  const [userData, setUserData] = useState<any>(null);

  // Router instance for navigation
  const router = useRouter();

  // Fetch user data once component is rendered
  useEffect(() => {
    async function fetchUserData() {
      const { data: user } = await supabase.auth.getUser();

      // Conditional in case anyone tries to access dashboard without being logged in
      if (!user.user) {
        router.navigate('/LoginScreen');
      }

      //Fetch logged user's data from 'users' table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.user?.id)
        .single();
      
      if (error) {
        console.log("ERROR: ", error);
        return;
      }

      setUserData(data);
    }

    fetchUserData();
  }, []);

  // Generate starting values when userData is set
/*  useEffect(() => {
    if (userData) {
      generateStartingValues();
    }
  }, [userData]);*/

  async function logOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("ERROR: ", error);
      return;
    }

    router.navigate('/LoginScreen');
  }

  async function generateStartingValues() {
    if (!userData) return;

    const prompt = `Generate personalized daily calorie budget, protein, carbohydrate, and fat intake values for a user based on the following profile:
    Age: ${userData.age}
    Gender: ${userData.gender}
    Current Weight: ${userData.current_weight}
    Target Weight: ${userData.target_weight}
    Height: ${userData.height}
    Goals: ${userData.goals}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    console.log("AI Response: ", response.text);
  }

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: '#2E2D2D', paddingTop: '30%' }}>
                <View style={styles.titleContainer}>
                    <Text style={{ color: '#ffffff', textAlign: 'center' }}>Calorie Budget</Text>
                    <Text style={styles.titleStyle}>0</Text>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={{ color: '#ffffff', textAlign: 'center' }}>Current Calories</Text>
                    <Text style={styles.titleStyle}>2,600</Text>
                </View>

                <View>
                  <TouchableHighlight underlayColor='#f0803c' style={styles.buttonStyle} onPress={() => router.navigate('/SearchWindow')}>
                    <Text style={{ textAlign: 'center', color: '#ffffff' }}>Input Food</Text>
                  </TouchableHighlight>
                </View>

                <View>
                  <TouchableHighlight underlayColor='#2E2D2D' style={{ backgroundColor: '#2E2D2D', marginTop: '20%' }} onPress={logOut}>
                    <Text style={{ color: '#ffffff', textAlign: 'center' }}>Logout</Text>
                  </TouchableHighlight>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#2E2D2D',
    paddingInline: "5%"
  },

  titleStyle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
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
})