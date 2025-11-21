import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

export default function HomeScreen() {

  // State to hold user input
  const [user, setUser] = useState<User>({
    email: '',
    username: '',
    password: ''
  });

  // State to hold the current page number
  const [pageNum, setPageNum] = useState<PageNum>({
    page: 0
  });

  function nextPage(): void {
    setPageNum({ page: pageNum.page + 1 });
  }

  function prevPage(): void {
    setPageNum({ page: pageNum.page - 1 });
  }

  
  function handleSubmit() {
    // Handle form submission logic here
    console.log('User submitted:', user);
  }

  // First step of the multi-step form
  const firstStep = ({ nextPage }: { nextPage: () => void }) => {
    return (
    <>
      <View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>Register</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={{ color: '#ffffff' }}>Email</Text>
        <TextInput style={styles.inputStyle} placeholder="Enter your email" 
        onChangeText={(text) => setUser({ ...user, email: text })} 
        value={user.email} />

        <Text style={{ color: '#ffffff' }}>Username</Text>
        <TextInput style={styles.inputStyle} placeholder="Enter your username" 
        onChangeText={(text) => setUser({ ...user, username: text })} 
        value={user.username} />

        <Text style={{ color: '#ffffff' }}>Password</Text>
        <TextInput style={styles.inputStyle} placeholder="Enter your password" 
        onChangeText={(text) => setUser({ ...user, password: text })} autoCorrect={false} secureTextEntry={true} autoCapitalize="none" 
        textContentType='password' value={user.password} />

        <TouchableHighlight underlayColor='#F0803C' onPress={() => {nextPage()}} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Next</Text>
          </View>
        </TouchableHighlight>
      </View>
      </View>
    </>
    );
  }

  // Second step of the multi-step form
  const secondStep = ({ nextPage, prevPage }: { nextPage: () => void; prevPage: () => void; }) => {
    return (
      <>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>Step 2</Text>
        <TouchableHighlight underlayColor='#F0803C' onPress={() => {nextPage()}} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Next</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor='#F0803C' onPress={() => {prevPage()}} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Previous</Text>
          </View>
        </TouchableHighlight>
        </View>
      </>
    )
  }

  return (
    <>
    <ScrollView style={{ flex: 1, backgroundColor: '#F0803C', paddingTop: '20%',
      paddingInline: '5%'
     }}>
      {pageNum.page === 0 && firstStep({ nextPage })}
      {pageNum.page === 1 && secondStep({ nextPage, prevPage })}
    </ScrollView>
    </>
  );
}

interface User {
  email: string;
  username: string;
  password: string;
}

interface PageNum {
  page: number;
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
    marginBottom: 20,
    marginTop: 5,
    borderRadius: 5
  },

  buttonStyle: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    width: '70%',
    alignSelf: 'center',
  }
});
