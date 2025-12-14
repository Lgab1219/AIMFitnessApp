import { StyleSheet, Text, View } from 'react-native';

export default function ExceedCaloriesWindow() {

    return (
        <View style={styles.exceedCaloriesWindow}>
            <Text style={styles.exceedCaloriesText}>
                You have exceeded the calorie budget. Please take some rest from eating and only eat again tomorrow.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    exceedCaloriesWindow: {
        position: 'absolute',
        zIndex: 1,
        top: 0,
        width: '100%',
        backgroundColor: '#3ECF8E',
        padding: 20
    },

    exceedCaloriesText: {
        color: '#ffffff',
        fontSize: 13,
        textAlign: 'center'
    }
})