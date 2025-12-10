import supabase from "@/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Goals } from "../types";

export default function DashboardScreen() {

  const [userData, setUserData] = useState<any>(null);

  const [calorieBudget, setCalorieBudget] = useState<number>(0);

  const [currentCalories, setCurrentCalories] = useState<number>(0);

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

  // Fetch current calories
  useEffect(() => {
    async function fetchCurrentCalories() {
      const { data: user } = await supabase.auth.getUser();

      const { data, error } = await supabase
      .from('calories_data')
      .select('current_calories')
      .eq('user_id', user.user?.id);

      if (error) {
        console.log("Fetch current calories error: ", error);
        return;
      }

      setCurrentCalories(data[0].current_calories ?? 0);
    }

    fetchCurrentCalories();
  }, []);

  async function logOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("ERROR: ", error);
      return;
    }

    router.navigate('/LoginScreen');
  }

  const calculateCalories = (current_weight: number, height: number, age: number, gender: string, goal: string) => {

    let bmr: number;
    let maintain_weight: number;

    // Mifflin-St Jeor Equation (these are BMR)
    if (gender === 'male') {
      bmr = (10 * current_weight) + (6.25 * height) - (5 * age) + 5;
      maintain_weight = Math.ceil(bmr * 1.55);
    } else {
      // Equation for female gender
      bmr = (10 * current_weight) + (6.25 * height) - (5 * age) - 161;
      maintain_weight = Math.ceil(bmr * 1.55);
    }

    if (goal === Goals.GainWeight) {
      return maintain_weight + 500;
    }

    if (goal === Goals.LoseWeight) {
      return maintain_weight - 500;
    }

    if (goal === Goals.MaintainWeight) {
      return maintain_weight;
    }
  }

  // Check if calories_data does not exist yet. If so, generate starting values
  useEffect(() => {
    if (!userData) return;

    async function fetchCalorieBudget() {
      const { data, error } = await supabase
        .from('calories_data')
        .select('calorie_budget')
        .eq('user_id', userData.id)
        .single();

      if (error) {
        console.log("ERROR: ", error);
        return;
      }
    
      setCalorieBudget(data.calorie_budget);
    }

    async function checkCaloriesData() {
      const { data, error } = await supabase
        .from('calories_data')
        .select('id')
        .eq('user_id', userData.id)
        .maybeSingle();

      if (error) {
        console.log("ERROR: ", error);
        return;
      }

      // If data already exists, do not generate starting values but fetch current calorie budget
      if (data) {
        fetchCalorieBudget();
        return;
      }

      // If data does not exist, calculate calorie budget based on user data
      const budget = calculateCalories(
        userData.current_weight,
        userData.height,
        userData.age,
        userData.gender,
        userData.goal
      );

      // Set calorie budget state to update current calorie budget value
      setCalorieBudget(budget!);

      // ...and then generate starting values to display on dashboard
      generateStartingValues(budget!);
  }

    async function generateStartingValues(budget: number) {
      const { error } = await supabase
        .from('calories_data')
        .insert({
          user_id: userData.id,
          calorie_budget: budget,
          current_calories: 0
        });

      if (error) {
        console.log("ERROR: ", error);
        return;
      }
    }

    checkCaloriesData();
  }, [userData]);

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: '#2E2D2D', paddingTop: '30%' }}>
                <View style={styles.titleContainer}>
                    <Text style={{ color: '#ffffff', textAlign: 'center' }}>Calorie Budget</Text>
                    <Text style={styles.titleStyle}>{calorieBudget}</Text>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={{ color: '#ffffff', textAlign: 'center' }}>Current Calories</Text>
                    <Text style={styles.titleStyle}>{currentCalories}</Text>
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