import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

export default function HomeScreen() {

  // React Hook Form setup to manage account handling and verification
  const { control, handleSubmit, trigger, setValue,
    formState: { errors } } = useForm<User>({
      defaultValues: {
        email: '',
        username: '',
        password: '',
        current_weight: 0,
        target_weight: 0,
        height: 0,
        age: 0,
        gender: 'male',
        goals: []
      }
    })

  const [goals, setGoals] = useState<Goals[]>([]);

  // State to hold the current page number
  const [pageNum, setPageNum] = useState<PageNum>({
    page: 0
  });

  async function nextPage() {
    const isValid = await trigger(["email", "username", "password"]);
    if (isValid) {
      setPageNum({ page: pageNum.page + 1 });
    }
  }

  function prevPage(): void {
    setPageNum({ page: pageNum.page - 1 });
  }

  // State to hold user goals
  // If goal is already selected, remove it; otherwise, add it (using filter)
  function toggleGoal(goal: Goals) {
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.includes(goal) ? prevGoals.filter(g => g !== goal) : [...prevGoals, goal];
    
    // Update the form value for goals
    setValue('goals', updatedGoals);

    return updatedGoals;
    });
  }

  // Submit handler
  const onSubmit = (data: User) => {
    console.log(data)

    //Reset form after submission
    setPageNum({ page: 0 });
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

  // Second step of the multi-step form
  const secondStep = ({ nextPage, prevPage }: { nextPage: () => void; prevPage: () => void; }) => {
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

        <TouchableHighlight underlayColor='#F0803C' onPress={() => {prevPage()}} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Previous</Text>
          </View>
        </TouchableHighlight>
        </View>
      </>
    );
  }

  // Third step of the multi-step form
  const thirdStep = ({ nextPage, prevPage }: { nextPage: () => void; prevPage: () => void }) => {
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

        <TouchableHighlight underlayColor='#F0803C' onPress={() => {prevPage()}} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Previous</Text>
          </View>
        </TouchableHighlight>
        </View>
      </>
    )
  }

  // Last step of the multi-step form
  const fourthStep = ({ prevPage }: { prevPage: () => void }) => {
    return (
      <>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>Final Step</Text>

            <Text style={{ color: '#ffffff' }}>Lose Weight</Text>
            <Checkbox value={goals.includes(Goals.LoseWeight)} onValueChange={() => toggleGoal(Goals.LoseWeight)} />

            <Text style={{ color: '#ffffff' }}>Gain Weight</Text>
            <Checkbox value={goals.includes(Goals.GainWeight)} onValueChange={() => toggleGoal(Goals.GainWeight)} />

            <Text style={{ color: '#ffffff' }}>Maintain Weight</Text>
            <Checkbox value={goals.includes(Goals.MaintainWeight)} onValueChange={() => toggleGoal(Goals.MaintainWeight)} />

            <Text style={{ color: '#ffffff' }}>Improve body composition</Text>
            <Checkbox value={goals.includes(Goals.BodyComposition)} onValueChange={() => toggleGoal(Goals.BodyComposition)} />
              
            <Text style={{ color: '#ffffff' }}>Become more fit</Text>
            <Checkbox value={goals.includes(Goals.Fit)} onValueChange={() => toggleGoal(Goals.Fit)} />

        <TouchableHighlight underlayColor='#F0803C' onPress={handleSubmit(onSubmit)} >
          <View style={styles.buttonStyle}>
            <Text style={{ textAlign: 'center', padding: 10 }}>Submit</Text>
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
      {pageNum.page === 2 && thirdStep({ nextPage, prevPage })}
      {pageNum.page === 3 && fourthStep({ prevPage })}
    </ScrollView>
    </>
  );
}

type Gender = 'male' | 'female';

enum Goals {
  LoseWeight = 'lose_weight',
  MaintainWeight = 'maintain_weight',
  GainWeight = 'gain_weight',
  BodyComposition = 'body_composition',
  Fit = "fit"
}

interface User {
  email: string;
  username: string;
  password: string;
  current_weight: number;
  target_weight: number;
  height: number;
  age: number;
  gender: Gender;
  goals: Goals[];
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
