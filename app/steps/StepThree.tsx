import { Controller, UseFormReturn } from 'react-hook-form';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { User } from '../types';

export default function StepThree({ nextPage, form }: { nextPage: () => void; form: any; }) {

    const { control } = form;

    return (
        <>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>Step 3</Text>

          <Text style={{ color: '#ffffff', alignSelf: 'center', fontSize: 20 }}>What is your gender?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Controller control={control}
            rules={{ required: true, }} render={({ field: { onChange, value } }) => (
              <>
              <TouchableHighlight underlayColor='#F0803C' style={styles.genderStyle} onPress={() => {onChange('male')}}>
                <Image source={require('../../assets/images/man.webp')} />
              </TouchableHighlight>

              <TouchableHighlight underlayColor='#F0803C' style={styles.genderStyle} onPress={() => {onChange('female')}}>
                <Image source={require('../../assets/images/woman.webp')} />
              </TouchableHighlight>
              </>
            )} name="gender" />
          </View>

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

  genderStyle: {
    width: '35%',
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 20,
    marginTop: 5,
    borderRadius: 5,
    alignItems: 'center',
  }
});