import supabase from '@/supabase';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { User } from './types';

export default function LoginScreen() {

  const loginForm = useForm<User>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [accountInputError, setAccountInputError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Initializing router for conditional route navigation
  const router = useRouter();

  // Destructuring loginForm function for React Hook Form's auth validation
  const { control, handleSubmit } = loginForm;

async function onSubmit(data: User) {

  // Destructuring loginForm to take in login values from user
  const { email, password } = loginForm.getValues();
  
  // If user data is not available or loginForm input is not valid, don't run function
  if (!data) {
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    setErrorMessage(error.message);
    return;
  }

  setTimeout(() => {
    router.navigate('/(tabs)/DashboardScreen');
  }, 1000);
}



  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#F0803C', paddingTop: '30%' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>Login</Text>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={{ color: '#ffffff' }}>Email</Text>
        <Controller control={control} rules={{ 
          required: true, pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email"
          } }} 
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.inputStyle} placeholder="Enter your email" 
          onChangeText={onChange} 
          value={value} />
        )} name="email" />

        <Controller control={control}
        rules={{ required: true, minLength: 5,}} 
        render={({ field: { onChange, value } }) => (
        <>
          <Text style={{ color: '#ffffff' }}>Password</Text>
          <TextInput style={styles.inputStyle} placeholder="Enter your password" 
          onChangeText={onChange} autoCorrect={false} secureTextEntry={true} autoCapitalize="none" 
          textContentType='password' value={value} />
        </>
      )} name="password" />

        <TouchableHighlight underlayColor='#F0803C' onPress={handleSubmit(onSubmit)}>
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Login</Text>
          </View>
        </TouchableHighlight>
      </View>

      <View style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
        { errorMessage ? <Text style={{ color: '#ffffff' }}>{errorMessage}</Text> : '' }
      </View>

        <View style={{ width: '100%' }}>
          <Link href="/RegistrationScreen" asChild>
            <Text style={{ color: '#f0803c', width: '100%', padding: 20, marginVertical: 150, backgroundColor: '#ffffff', textAlign: 'center' }}>Don't have an account yet?</Text>
          </Link>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff',
    color: '#000000',
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
  },

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
});
