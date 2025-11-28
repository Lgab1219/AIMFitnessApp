import supabase from "@/supabase";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function DashboardScreen() {

  const router = useRouter();

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