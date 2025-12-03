import supabase from "@/supabase";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function DashboardScreen() {

  // Create seperate AI file to use fetched values to generate starting values (calorie budget) for user profile
  // Before generating values, check if user profile already has values set
  // Turn AI's string output and store into a variable to be displayed on the dashboard screen

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

      console.log("USER DATA: ", data);
    }

    fetchUserData();
  }, []);

  async function logOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("ERROR: ", error);
      return;
    }

    router.navigate('/LoginScreen');
  }

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: '#F0803C', paddingTop: '30%' }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleStyle}>Dashboard</Text>
                </View>

                <View>
                  <TouchableHighlight underlayColor='#f0803c' style={{ backgroundColor: '#f0803c' }} onPress={logOut}>
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
    backgroundColor: '#F0803C',
    paddingInline: "5%"
  },

  titleStyle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    paddingBottom: 20,
  },
})