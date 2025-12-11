// components/CustomToast.tsx
import React from "react"
import { View, Text, StyleSheet } from "react-native"

export const CustomToast = ({ text1, text2 }: { text1: string; text2: string }) => {
    return (
        <View style={styles.container}>
            {text1 && <Text style={styles.title}>{text1}</Text>}
            {text2 && <Text style={styles.message}>{text2}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ff69b4", // Màu hồng
        padding: 5,
        borderRadius: 8,
        marginHorizontal: 16
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 2
    },
    message: {
        fontSize: 14,
        color: "#fff"
    }
})
