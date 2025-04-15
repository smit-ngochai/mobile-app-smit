import * as React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Linking, AppState, Pressable, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useCameraDevice, Camera, useCodeScanner, useCameraPermission } from "react-native-vision-camera"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { IconSetting } from "../assets"
import api from "../globall/globall"

function QRLoginScreen({ navigation }: { navigation: any }) {
    const [showCamera, setShowCamera] = React.useState(true) // Ban đầu mở camera ngay lập tức
    const [scanned_code, setScannedCode] = React.useState<string | null>(null)
    const [deviceInfo, setDeviceInfo] = React.useState("") // Lưu thông tin thiết bị từ mã QR
    const appState = React.useRef(AppState.currentState)

    // Camera permissions
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice("back")

    // Khi component mount, kiểm tra quyền camera
    React.useEffect(() => {
        const checkPermissionAndOpenCamera = async () => {
            // Kiểm tra quyền camera
            if (!hasPermission) {
                requestPermission()
            }
        }

        checkPermissionAndOpenCamera()
    }, [])

    // Kiểm tra quyền camera khi ứng dụng trở lại từ nền
    React.useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                // Ứng dụng vừa trở lại từ nền, kiểm tra quyền và khôi phục trạng thái
                checkSavedStateAndPermission()
            }
            appState.current = nextAppState
        })

        return () => {
            subscription.remove()
        }
    }, [])

    // Kiểm tra trạng thái đã lưu và quyền camera
    const checkSavedStateAndPermission = async () => {
        const savedScreen = await AsyncStorage.getItem("lastScreen")
        const savedCamera = await AsyncStorage.getItem("showCamera")

        // Xóa dữ liệu đã lưu
        await AsyncStorage.multiRemove(["lastScreen", "showCamera"])

        // Kiểm tra quyền camera hiện tại
        const currentStatus = await Camera.getCameraPermissionStatus()

        if (savedScreen === "QRLogin" && String(currentStatus) === "authorized") {
            // Nếu trước đó đang ở màn hình QRLogin và quyền đã được cấp
            if (savedCamera === "true") {
                setShowCamera(true)
            }
        }
    }

    // Lưu trạng thái và mở cài đặt
    const saveStateAndOpenSettings = async () => {
        try {
            await AsyncStorage.setItem("lastScreen", "QRLogin")
            await AsyncStorage.setItem("showCamera", String(showCamera))
            Linking.openSettings()
        } catch (error) {
            console.error("Lỗi khi lưu trạng thái:", error)
        }
    }

    // QR code scanner setup
    const codeScanner = useCodeScanner({
        codeTypes: ["qr", "ean-13"],
        onCodeScanned: codes => {
            if (codes.length > 0 && !scanned_code) {
                const qrValue: string = codes[0].value as string

                // Phân tích chuỗi QR để lấy mã
                if (qrValue && qrValue.startsWith("smit-login|")) {
                    // Tách chuỗi theo dấu |
                    const parts: string[] = qrValue.split("|")
                    if (parts.length >= 2) {
                        // Lấy phần thứ hai (mã)
                        const code: string = parts[1]
                        // Lưu mã QR đã quét
                        setScannedCode(code)
                        // Sau khi quét xong, hiển thị màn hình "Cho phép đăng nhập"
                        setShowCamera(false)
                    }
                } else {
                    setShowCamera(false)
                }
            }
        }
    })

    const senQRCode = async (step: "approved" | "rejected") => {
        const res = await api({
            url: `/public/qrcode/auth`,
            method: "POST",
            data: {
                step: step,
                code: scanned_code
            }
        })
        if (res.error) {
            Alert.alert("Lỗi", res.message || "Đăng nhập thất bại")
        }
        setShowCamera(true)
        setScannedCode(null)
    }

    // Hiển thị camera
    if (showCamera) {
        // Kiểm tra quyền camera
        if (!hasPermission) {
            return (
                <ImageBackground source={require("../assets/bgr2.png")} style={[styles.container, { alignItems: "flex-start" }]}>
                    <Image style={{ marginBottom: 15 }} source={require("../assets/qr_login/camera.png")} />
                    <Text style={{ color: "#000", marginBottom: 32, fontSize: 24, fontWeight: "700" }}>Cho phép ứng dụng quyền truy cập camera</Text>
                    <View style={{ width: "100%", marginBottom: 35 }}>
                        <View style={[styles.instruct_setting]}>
                            <IconSetting />
                            <Text style={[styles.instruct_setting_text]}>
                                Tới <Text style={{ fontWeight: "700" }}>cài đặt</Text>, say đó chọn mục <Text style={{ fontWeight: "700" }}>quyền riêng tư</Text>
                            </Text>
                        </View>
                        <View style={{ height: 25, width: 1, backgroundColor: "#DCE3EA", marginLeft: 10, marginBottom: 10, marginTop: -5 }} />
                        <View style={[styles.instruct_setting, { alignItems: "center" }]}>
                            <IconSetting />
                            <Text style={[styles.instruct_setting_text]}>
                                Chọn mục <Text style={{ fontWeight: "700" }}>Camera</Text>
                            </Text>
                        </View>
                        <View style={{ height: 25, width: 1, backgroundColor: "#DCE3EA", marginLeft: 10, marginBottom: 10, marginTop: 10 }} />
                        <View style={[styles.instruct_setting, { alignItems: "center" }]}>
                            <IconSetting />
                            <Text style={[styles.instruct_setting_text]}>
                                <Text style={{ fontWeight: "700" }}>Bật</Text> quyền cho SMIT App
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={saveStateAndOpenSettings} style={styles.buttonOutline}>
                        <IconSetting />
                        <Text style={[{ fontSize: 16, fontWeight: "600" }]}>Tới cài đặt</Text>
                    </TouchableOpacity>
                </ImageBackground>
            )
        }

        // Hiển thị camera khi có quyền
        return (
            <View style={styles.cameraContainer}>
                {device != null && (
                    <>
                        <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} codeScanner={codeScanner} torch={"off"} enableZoomGesture={true} />

                        {/* Overlay UI */}
                        <View style={styles.overlay}>
                            <View style={styles.scanFrame} />
                            <Text style={styles.instructionText}>Đặt mã QR vào khung để quét</Text>
                        </View>
                    </>
                )}
            </View>
        )
    }

    // Hiển thị màn hình "Cho phép đăng nhập" sau khi quét mã QR
    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container}>
            <Image source={require("../assets/login/image.png")} />
            <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center" }}>Cho phép đăng nhập</Text>
            <Text style={{ textAlign: "center", marginTop: 15, color: "#718096", fontSize: 15, fontWeight: "500", lineHeight: 20 }}>Bạn đang chuẩn bị đăng nhập tài khoản trên thiết bị {deviceInfo || "Windown 11-dsdsda"}</Text>

            <TouchableOpacity
                style={{ width: "100%" }}
                activeOpacity={0.7}
                onPress={() => {
                    senQRCode("approved")
                }}>
                <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                    <Text style={styles.buttonText}>Cho phép đăng nhập</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.linearGradient, { width: "100%", backgroundColor: "rgba(255, 170, 170, 0.30)", marginTop: 15 }]}
                activeOpacity={0.7}
                onPress={() => {
                    senQRCode("rejected")
                }}>
                <Text style={[styles.buttonText, { color: "#CE1B1B" }]}>Từ chối</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

export default QRLoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "cover",
        backgroundColor: "#F5FAFF",
        paddingHorizontal: 40
    },
    linearGradient: {
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center"
    },
    // Camera styles
    cameraContainer: {
        flex: 1,
        backgroundColor: "black"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center"
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
        zIndex: 10
    },
    backButtonText: {
        color: "white",
        fontSize: 16
    },
    buttonOutline: {
        borderWidth: 1,
        borderColor: "#DCE3EA",
        borderRadius: 10,
        padding: 10,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 4
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: "#1A8CFF",
        borderRadius: 10,
        backgroundColor: "transparent"
    },
    instructionText: {
        color: "white",
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
        paddingHorizontal: 40
    },
    instruct_setting: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap"
    },
    instruct_setting_text: {
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
        flexShrink: 1
    }
})
