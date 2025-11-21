import { StyleSheet, View, ScrollView, TextInput, Text, TouchableHighlight } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {

  const [user, setUser] = useState<User>({
    email: '',
    password: ''
  });

  function handleSubmit() {
    // Handle form submission logic here
    console.log('User submitted:', user);
  }

  return (
    <>
    <ScrollView style={{ flex: 1, backgroundColor: '#F0803C', paddingTop: '20%',
      paddingInline: '5%'
     }}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>Register</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={{ color: '#ffffff' }}>Email</Text>
        <TextInput style={styles.inputStyle} placeholder="Enter your email" 
        onChangeText={(text) => setUser({ ...user, email: text })} 
        value={user.email} />

        <Text style={{ color: '#ffffff' }}>Password</Text>
        <TextInput style={styles.inputStyle} placeholder="Enter your password" 
        onChangeText={(text) => setUser({ ...user, password: text })} 
        value={user.password} />

        <TouchableHighlight underlayColor='#F0803C' onPress={handleSubmit} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Submit</Text>
          </View>
        </TouchableHighlight>
      </View>
    </ScrollView>
    </>
  );
}

interface User {
  email: string;
  password: string;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#F0803C',
  },

  titleStyle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    paddingBottom: 20,
  },

  inputStyle: {
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 20
  },

  buttonStyle: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5
  }
});
