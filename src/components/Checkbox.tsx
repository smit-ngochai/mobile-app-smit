import * as React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "react-native-paper"
import Icon from "react-native-vector-icons/FontAwesome"

const CustomCheckbox = ({ checked, onPress, label, color = "#1A8CFF", disabled = false }: { checked: boolean; onPress: () => void; label?: string; color?: string; disabled?: boolean }) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}>
            <Icon name={checked ? "check-square" : "square-o"} size={24} color={disabled ? "#CCCCCC" : checked ? color : "#1F2937"} />
            {label ? <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text> : null}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    label: {
        marginLeft: 8
    },
    disabledText: {
        color: "#CCCCCC"
    }
})

export default CustomCheckbox
