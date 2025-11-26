import { Controller, UseFormReturn } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { User } from '../types';
export default function StepTwo({ form, nextPage }: StepProps) {

    const { control } = form;

    return (
        <>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>Step 2</Text>

        <Text style={{ color: '#ffffff' }}>Current Weight (kg)</Text>
        <Controller control={control} rules={{ required: true, min: 1, }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput style={styles.inputStyle} placeholder="Enter your current weight"
            onChangeText={onChange} value={value?.toString()} keyboardType='numeric' />
          </>
        )} name="current_weight" />

        <Text style={{ color: '#ffffff' }}>Target Weight (kg)</Text>
        <Controller control={control} rules={{ required: true, min: 1,}}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput style={styles.inputStyle} placeholder="Enter your target weight"
            onChangeText={onChange} value={value?.toString()} keyboardType='numeric' />
          </>
        )} name="target_weight" />

        <Text style={{ color: '#ffffff' }}>Height (cm)</Text>
        <Controller control={control} rules={{ required: true, min: 1,}}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput style={styles.inputStyle} placeholder="Enter your height"
            onChangeText={onChange} value={value?.toString()} keyboardType='numeric' />
          </>
        )} name="height" />

        <Text style={{ color: '#ffffff' }}>Age</Text>
        <Controller control={control} rules={{ required: true, min: 1,}}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput style={styles.inputStyle} placeholder="Enter your age"
            onChangeText={onChange} value={value?.toString()} keyboardType='numeric' />
          </>
        )} name="age" />

        <TouchableHighlight underlayColor='#F0803C' onPress={() => {nextPage()}} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Next</Text>
          </View>
        </TouchableHighlight>
        </View>
        </>
    )
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
  },

  titleStyle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    paddingBottom: 20,
  },
});