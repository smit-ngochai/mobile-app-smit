import React from "react"
import { Text, View, StyleSheet, StyleProp, TextStyle } from "react-native"
import MaskedView from "@react-native-masked-view/masked-view"
import LinearGradient from "react-native-linear-gradient"

interface GradientTextProps {
    text: string
    style?: StyleProp<TextStyle>
    colors?: string[]
    locations?: number[]
    start?: { x: number; y: number }
    end?: { x: number; y: number }
}

/**
 * Component hiển thị text với màu gradient
 * @param text - Text cần hiển thị
 * @param style - Style cho text (fontSize, fontWeight, etc.)
 * @param colors - Mảng các màu cho gradient
 * @param locations - Vị trí của mỗi màu (từ 0 đến 1)
 * @param start - Điểm bắt đầu của gradient (mặc định: góc trên bên trái)
 * @param end - Điểm kết thúc của gradient (mặc định: góc dưới bên phải)
 */
const GradientText: React.FC<GradientTextProps> = ({ text, style, colors = ["#00AEC2", "#007CFA", "#0062D1"], locations = [0, 0.549, 1], start = { x: 0, y: 0 }, end = { x: 1, y: 1 } }) => {
    // Đảm bảo mảng colors và locations có cùng độ dài
    const safeLocations = locations
        ? locations.length === colors.length
            ? locations
            : Array(colors.length)
                  .fill(0)
                  .map((_, i) => i / (colors.length - 1))
        : Array(colors.length)
              .fill(0)
              .map((_, i) => i / (colors.length - 1))

    // Tính toán kích thước dựa trên fontSize (nếu có)
    const getTextDimensions = () => {
        if (typeof style === "object" && style !== null && "fontSize" in style) {
            const fontSize = Number(style.fontSize)
            return {
                height: fontSize * 1.5,
                // Đặt chiều rộng tối thiểu dựa trên độ dài của text
                minWidth: text.length * fontSize * 0.6
            }
        }
        // Mặc định nếu không có fontSize
        return {
            height: 60,
            minWidth: text.length * 14
        }
    }

    const dimensions = getTextDimensions()

    return (
        <View style={styles.container}>
            <MaskedView style={[styles.maskedView, dimensions]} maskElement={<Text style={[styles.text, style]}>{text}</Text>}>
                <LinearGradient colors={colors} locations={safeLocations} start={start} end={end} style={styles.gradient} />
            </MaskedView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // alignSelf: 'flex-start', // Để hiển thị đúng vị trí
        minWidth: 50 // Đảm bảo luôn có chiều rộng tối thiểu
        // width: '100%',
    },
    maskedView: {
        flexDirection: "row",
        // Chiều cao sẽ được ghi đè bởi dimensions
        height: 60
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        // Màu này không quan trọng vì chỉ dùng làm mask
        color: "black"
    },
    gradient: {
        flex: 1
    }
})

export default GradientText
