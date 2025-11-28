import { Controller, UseFormReturn } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { User } from '../types';

export default function StepOne({ form, nextPage }: StepProps) {

    const { control } = form;

    return (
        <>
      <View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>Register</Text>
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

        <Text style={{ color: '#ffffff' }}>Username</Text>
        <Controller control={control}
        rules={{ required: true, }} render={({ field: { onChange, value } }) => (
          <TextInput style={styles.inputStyle} placeholder="Enter your username" 
          onChangeText={onChange} 
          value={value} /> 
        )} name="username" />

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

interface StepProps {
    nextPage: () => void;
    form: UseFormReturn<User>;
}

const styles = StyleSheet.create({
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
  },

  titleContainer: {
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#F0803C',
    paddingTop: '5%'
  },

  titleStyle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    paddingBottom: 20,
  },
});