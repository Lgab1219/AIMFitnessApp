import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";

export default function SearchWindow() {

    const router = useRouter();

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
                    <TextInput style={{ borderColor: '#000000', borderWidth: 1, width: '100%', padding: 10 }} placeholder="Search..." />
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#E0E0E0',
    paddingInline: "5%"
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