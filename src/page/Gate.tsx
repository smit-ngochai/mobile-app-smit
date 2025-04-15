import * as React from "react"
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { WebView } from "react-native-webview"
import Orientation from "react-native-orientation-locker"
import { useIsFocused } from "@react-navigation/native"
import { IconMenu } from "../assets"

function GateScreen({ navigation, route }: { navigation: any; route: any }) {
    const isFocused = useIsFocused()
    const isInitialMount = React.useRef(true)

    // Lưu trữ nguồn gốc chuyển màn hình
    const sourceScreen = route.params?.source || "unknown"

    // Sửa lại listener
    const orientationListener = React.useRef((orientation: string) => {
        // Luôn khóa landscape khi có bất kỳ thay đổi nào
        Orientation.lockToLandscapeLeft()
    })

    // Thêm Dimensions listener - đáng tin cậy hơn
    React.useEffect(() => {
        const dimensionListener = Dimensions.addEventListener("change", ({ window }) => {
            if (isFocused) {
                // Luôn khóa landscape khi dimensions thay đổi
                Orientation.lockToLandscapeLeft()
            }
        })

        return () => {
            dimensionListener.remove()
        }
    }, [isFocused])

    // Hàm khóa landscape
    const lockToLandscape = () => {
        Orientation.lockToLandscapeLeft()

        // Thêm listener
        Orientation.removeOrientationListener(orientationListener.current) // Xóa listener cũ
        Orientation.addOrientationListener(orientationListener.current)
    }

    React.useEffect(() => {
        if (isFocused) {
            if (isInitialMount.current || sourceScreen === "login") {
                // Chỉ áp dụng setTimeout nếu là lần đầu hoặc đến từ màn login
                const timer1 = setTimeout(() => {
                    lockToLandscape()
                }, 700)

                isInitialMount.current = false
                return () => clearTimeout(timer1)
            } else {
                // Xoay ngay lập tức nếu đến từ tab khác
                lockToLandscape()
            }
        } else {
            // Khi rời khỏi màn hình Gate
            Orientation.removeOrientationListener(orientationListener.current)
            Orientation.lockToPortrait()
        }
    }, [isFocused, sourceScreen])

    const handleMenuPress = () => {
        // Lấy giá trị hiện tại của showTabBar (mặc định là false nếu chưa được set)
        const currentShowTabBar = route.params?.showTabBar || false

        // Toggle giá trị showTabBar
        navigation.setParams({ showTabBar: !currentShowTabBar })
    }

    // Thêm effect để ẩn TabBar khi rời khỏi màn hình Gate
    React.useEffect(() => {
        if (!isFocused && route.params?.showTabBar) {
            // Reset tham số khi rời khỏi màn hình
            navigation.setParams({ showTabBar: false })
        }
    }, [isFocused, navigation, route.params?.showTabBar])

    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: "https://gate.smit.vn/business" }} style={{ flex: 1 }} />
            <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton} activeOpacity={0.7}>
                <IconMenu width={24} height={24} focused={true} />
            </TouchableOpacity>
        </View>
    )
}

export default GateScreen

const styles = StyleSheet.create({
    menuButton: {
        position: "absolute",
        top: 100,
        right: -10,
        width: 55,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CCE4FF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.1,
        shadowRadius: 15
    }
})
