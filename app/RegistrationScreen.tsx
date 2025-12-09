import { Link } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import StepFour from './steps/StepFour';
import StepOne from './steps/StepOne';
import StepThree from './steps/StepThree';
import StepTwo from './steps/StepTwo';
import { Goals, User } from './types';

export default function RegistrationScreen() {

  // React Hook Form setup to manage account handling and verification
  const form = useForm<User>({
      defaultValues: {
        email: '',
        username: '',
        password: '',
        current_weight: 0,
        target_weight: 0,
        height: 0,
        age: 0,
        gender: 'male',
        goals: Goals.None
      }
    })

  // Destructure methods from useForm seperately for easier access here and Step components
  const { trigger } = form;

  // State to hold the user's goals
  const [goals, setGoals] = useState<Goals>(Goals.None);

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

  return (
    <>
    <ScrollView style={{ flex: 1, backgroundColor: '#F0803C', paddingVertical: '15%'
     }}>
      <View style={{ paddingInline: '5%' }}>
        {pageNum.page === 0 && <StepOne form={form} nextPage={nextPage} />}
        {pageNum.page === 1 && <StepTwo form={form} nextPage={nextPage} />}
        {pageNum.page === 2 && <StepThree form={form} nextPage={nextPage} />}
        {pageNum.page === 3 && <StepFour form={form} goals={goals} setGoals={setGoals} setPageNum={setPageNum} />}
      </View>
      <View style={{ width: '100%', paddingInline: 0 }}>
        <Link href="/LoginScreen" asChild>
          <Text style={{ color: '#f0803c', width: '100%', padding: 20, marginVertical: 50, backgroundColor: '#ffffff', textAlign: 'center' }}>Already have an account?</Text>
        </Link>
      </View>
    </ScrollView>
    </>
  );
}

interface PageNum {
  page: number;
}
