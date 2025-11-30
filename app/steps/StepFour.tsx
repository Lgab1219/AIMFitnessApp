import supabase from '@/supabase';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { UseFormReturn } from 'react-hook-form';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Goals, User } from '../types';

export default function StepFour({ form, goals, setGoals, setPageNum }: StepProps) {

    const { setValue, handleSubmit } = form;

    const { email, password, username, age, current_weight, target_weight, height, gender } = form.getValues();

    const router = useRouter();

    // If goal is already selected, remove it; otherwise, add it (using filter)
    function toggleGoal(goal: Goals) {
      setGoals(prevGoals => {
        const updatedGoals = prevGoals.includes(goal) ? prevGoals.filter(g => g !== goal) : [...prevGoals, goal];
        
      // Update the form value for goals
      setValue('goals', updatedGoals);

      return updatedGoals;
      });
    }

    async function insertUserData() {
      const { error } = await supabase
        .from('users')
        .insert({
          username: username,
          age: age,
          current_weight: current_weight,
          target_weight: target_weight,
          height: height,
          gender: gender,
          goals: goals.length > 0 ? goals : null,
        });

      if (error) {
        console.log('Error inserting user data:', error.message);
      }
    }

    // Submit handler
    async function onSubmit (data: User) {
      if (!data) {
        return;
      } 

      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            displayName: username,
          }
        }
      });
    
      if (error) {
        console.log('Sign up error:', error.message);
        return;
      }

      // Insert additional user data into the 'users' table
      insertUserData();

      //Reset form after submission
      router.navigate('/LoginScreen')
      setPageNum({ page: 0 });
    }

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
    );
}

interface StepProps {
    form: UseFormReturn<User>;
    goals: Goals[];
    setGoals: React.Dispatch<React.SetStateAction<Goals[]>>;
    setPageNum: React.Dispatch<React.SetStateAction<{ page: number }>>;
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