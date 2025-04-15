import * as React from "react"
import { useNavigation } from "@react-navigation/native"
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ImageBackground, Alert } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { IconGate, IconProfile, IconLock, Icon2Fa } from "../assets"
import LinearGradient from "react-native-linear-gradient"
import api from "../globall/globall"
import { checkAuth } from "../../index.js"

// Định nghĩa kiểu cho navigation
type RootStackParamList = {
    login: undefined
    register: undefined
    inapp: { screen?: string; source: string }
    auth: undefined
}

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>

function LoginScreen() {
    const navigation = useNavigation<LoginScreenNavigationProp>()
    const [input_tk, setInput_tk] = React.useState("")
    const [input_mk, setInput_mk] = React.useState("")
    const [input_2fa, setInput_2fa] = React.useState("")
    const [two_factor_hashed, setTwo_factor_hashed] = React.useState("")
    // Tạo refs cho các input
    const usernameInputRef = React.useRef<TextInput>(null)
    const passwordInputRef = React.useRef<TextInput>(null)
    const twoFaInputRef = React.useRef<TextInput>(null)
    // Thêm state để theo dõi trạng thái focus của các input
    const [usernameFocused, setUsernameFocused] = React.useState(false)
    const [passwordFocused, setPasswordFocused] = React.useState(false)
    const [twoFaFocused, setTwoFaFocused] = React.useState(false)
    // Thêm state để theo dõi trạng thái xác thực hai yếu tố
    const [isTwoFactor, setIsTwoFactor] = React.useState(false)

    const login = async () => {
        const res = (await api({
            url: "/public/auth/login",
            method: "POST",
            data: {
                username: input_tk,
                password: input_mk
            }
        })) as any
        if (res.error) {
            if (res.subcode === "email-or-password-invalid") Alert.alert(res.message || "Tài khoản hoặc mật khẩu không chính xác")
            else Alert.alert(res.message || "Đăng nhập thất bại")
        } else {
            if (res.two_factor_scene) {
                setIsTwoFactor(true)
                setTwo_factor_hashed(res.two_factor_hashed)
            } else {
                // Gọi lại checkAuth để cập nhật global.authState
                await checkAuth()

                // Sau đó mới điều hướng
                navigation.navigate("inapp", {
                    screen: "Tài khoản",
                    source: "login"
                })
            }
        }
    }

    const twoFactor = async () => {
        const res = await api({
            url: "/public/auth/login/two_factor",
            method: "POST",
            data: {
                hash: two_factor_hashed,
                otp: input_2fa
            }
        })
        if (res.error) return Alert.alert(res.message || "Xác thực thất bại")
        await checkAuth()

        navigation.navigate("inapp", {
            screen: "Tài khoản",
            source: "login"
        })
    }

    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container} key="2">
            {!isTwoFactor ? (
                // Giao diện đăng nhập bình thường
                <>
                    <IconGate width={108} height={108} />
                    <Text style={styles.titleText}>Đăng nhập tài khoản SMIT</Text>

                    <TouchableOpacity
                        style={[styles.inputContainer, usernameFocused && styles.inputContainerFocused, { marginTop: 23 }]}
                        activeOpacity={0.8}
                        onPress={() => {
                            usernameInputRef.current?.focus()
                            setUsernameFocused(true)
                        }}>
                        <IconProfile width={20} height={20} focused={usernameFocused} />
                        <TextInput ref={usernameInputRef} style={styles.input} placeholder="Tài khoản..." onFocus={() => setUsernameFocused(true)} onBlur={() => setUsernameFocused(false)} value={input_tk} onChangeText={setInput_tk} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused, { marginTop: 15 }]}
                        activeOpacity={0.8}
                        onPress={() => {
                            passwordInputRef.current?.focus()
                            setPasswordFocused(true)
                        }}>
                        <IconLock width={20} height={20} focused={passwordFocused} />
                        <TextInput ref={passwordInputRef} style={styles.input} placeholder="Mật khẩu..." secureTextEntry={true} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} value={input_mk} onChangeText={setInput_mk} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: "100%" }} activeOpacity={0.7} onPress={() => login()}>
                        <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </>
            ) : (
                // Giao diện xác thực hai yếu tố
                <>
                    <Icon2Fa width={76} height={76} />
                    <Text style={styles.titleText}>Nhập mã 2Fa</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", lineHeight: 24, textAlign: "center", marginTop: 15 }}>Mở ứng dụng xác thực của bạn và điền đoạn mã để xác thực</Text>

                    <TouchableOpacity
                        style={[styles.inputContainer, twoFaFocused && styles.inputContainerFocused, { marginTop: 15 }]}
                        activeOpacity={0.8}
                        onPress={() => {
                            twoFaInputRef.current?.focus()
                            setTwoFaFocused(true)
                        }}>
                        <IconLock width={20} height={20} focused={twoFaFocused} />
                        <TextInput ref={twoFaInputRef} style={styles.input} placeholder="Nhập 2Fa" secureTextEntry={true} onFocus={() => setTwoFaFocused(true)} onBlur={() => setTwoFaFocused(false)} value={input_2fa} onChangeText={setInput_2fa} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: "100%" }} activeOpacity={0.7} onPress={() => twoFactor()}>
                        <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                            <Text style={styles.buttonText}>Xác thực</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </>
            )}
        </ImageBackground>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        backgroundColor: "#F5FAFF"
    },

    titleText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1F2937",
        textAlign: "center",
        marginTop: 8
    },
    linearGradient: {
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center"
    },
    inputContainer: {
        gap: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DCE3EA",
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10
    },
    inputContainerFocused: {
        borderColor: "#1A8CFF"
    },
    input: {
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
        marginLeft: 8
    }
})
