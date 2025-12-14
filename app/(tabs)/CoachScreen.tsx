import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import supabase from '../../supabase';

type Message = {
  id?: number;
  message?: string;
  sender?: string;
  created_at?: string;
};

export default function CoachScreen() {

    const [messageInput, setMessageInput] = useState<string>('');
    const [messageList, setMessageList] = useState<Message[]>([]);
    const geminiURL = `https://aim-fitness-app.vercel.app/api/gemini`;
    const mockGeminiURL = `https://aim-fitness-app.vercel.app/api/gemini-mock`;

    // Detects if there are any sent messages, and updates the fetchMessages useEffect.
    const [updateMessages, toggleUpdateMessages] = useState<boolean>(false);

    function handleMessage(text: string) {
        setMessageInput(text);
    }

    useEffect(() => {
        async function checkStarterPrompt() {
            const { data } = await supabase.auth.getUser();
            if (!data) return;

            if (data.user?.user_metadata.starter_prompt_generated) return;

            await generateStarterPrompt(data.user?.id as string);

            await supabase.auth.updateUser({ 
                data: { starter_prompt_generated: true }
             });

             await supabase.auth.refreshSession();
             toggleUpdateMessages(prev => !prev);
        }

        checkStarterPrompt();
    }, []);

    async function generateStarterPrompt(userID: string) {
        const prompt: string = `
        You are a friendly AI Health and Fitness Coach.

        Instructions:
        - Help user answer their questions only related to health and fitness

        If you have understood, introduce yourself briefly to the user.
        `;

        const response = await fetch(geminiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });

        const data = await response.json();

        await supabase.from('messages').insert({
            user_id: userID,
            message: data.reply,
            sender: 'ai'
        })
        .select('*')
        .single();
    }

    async function sendMessage() {
        const { data: user } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('messages')
            .insert({
                user_id: user.user?.id,
                message: messageInput,
                sender: 'user'
            })
            .select('*')
            .single();

        if (error) {
            console.log("ERROR SENDING MESSAGE: ", error);
            return;
        }

        setMessageList((prev) => [...prev, data]);
        setMessageInput('');
        promptAI();
    }

    useEffect(() => {
        async function fetchMessages() {
            const { data: user } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', user.user?.id)
                .order('created_at', { ascending: true });

            if (!error && data) {
                setMessageList(data);
            }
        }

        fetchMessages();
    }, [updateMessages]);

    async function promptAI() {
        const { data: user } = await supabase.auth.getUser();
        if (!user) return;

        const response = await fetch(geminiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageInput })
        });

        if (!response.ok) {
            console.log("Gemini request failed: ", response.text());
            return;
        }

        const data = await response.json();
        console.log("Gemini Instant Reply: ", data.reply);

        const aiMessage = data.reply;

        const { error: replyError } = await supabase
        .from('messages')
        .insert({
            user_id: user.user?.id,
            message: aiMessage,
            sender: 'ai'
        })
        .select('*')
        .single();

        if (replyError) return;

        toggleUpdateMessages(prev => !prev);
    }

    return (
        <>
        <ScrollView 
          style={{ flex: 1, backgroundColor: '#E0E0E0' }}
          contentContainerStyle={{ paddingBottom: 100 }} // space for input box
        >
            <View style={styles.chatHeader}>
                <Text style={styles.headerText}>Coach</Text>
            </View>

            <View style={styles.messagesContainer}>
              {messageList.map((msg) => (
                <View
                  key={msg.id ?? msg.created_at}
                  style={[
                    styles.bubble,
                    msg.sender === "user" ? styles.userBubble : styles.aiBubble
                  ]}
                >
                  <Text>{msg.message}</Text>
                </View>
              ))}
            </View>
        </ScrollView>

        <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              value={messageInput}
              onChangeText={handleMessage}
            />
            <TouchableHighlight 
              style={styles.submitBtn} 
              underlayColor="#ffffff" 
              onPress={sendMessage}
            >
                <Text style={{ color: "#ffffff" }}>Send</Text>
            </TouchableHighlight>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    chatHeader: {
        backgroundColor: '#f0803c',
        padding: 20,
        paddingTop: 50
    },

    headerText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold'
    },

    messagesContainer: {
        padding: 15,
        gap: 10,
    },

    bubble: {
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },

    userBubble: {
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-end',
        borderWidth: 1
    },

    aiBubble: {
        backgroundColor: '#f0803c',
        alignSelf: 'flex-start',
        color: '#ffffff'
    },

    inputContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#E0E0E0',
        flexDirection: 'row',
        padding: 10,
        gap: 10,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#2e2d2d',
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },

    submitBtn: {
        backgroundColor: '#f0803c',
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 5,
    },
});
