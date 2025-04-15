import * as React from "react"
import { View, Text, Button, StyleSheet, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

// Định nghĩa kiểu cho navigation

function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Text>Register Screen</Text>
            <Button title="Submit" />
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
        // backgroundColor: "#F5FAFF"
    }
})
