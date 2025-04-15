import * as React from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"

const CustomRadio = ({ selected, label, color = "#1A8CFF", disabled = false }: { selected: boolean; label?: string; color?: string; disabled?: boolean }) => {
    return (
        <View style={styles.radioItem}>
            <View style={[styles.radioCircle, disabled && styles.disabledCircle]}>{selected && <View style={[styles.selectedRb, disabled && styles.disabledDot, { backgroundColor: disabled ? "#CCCCCC" : color }]} />}</View>
            {label ? <Text style={[styles.filterText, disabled && styles.disabledText]}>{label}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    radioItem: {
        flexDirection: "row",
        alignItems: "center"
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#1A8CFF",
        alignItems: "center",
        justifyContent: "center"
    },
    selectedRb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#1A8CFF"
    },
    filterText: {
        fontSize: 15,
        color: "#1F2937",
        fontWeight: "500",
        marginLeft: 8,
        lineHeight: 20,
        height: 20
    },
    disabledCircle: {
        borderColor: "#CCCCCC"
    },
    disabledDot: {
        backgroundColor: "#CCCCCC"
    },
    disabledText: {
        color: "#CCCCCC"
    }
})

export default CustomRadio
