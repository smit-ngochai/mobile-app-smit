import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import "react-native-gesture-handler"
import { StyleSheet, View, Text, ActivityIndicator, ImageBackground } from "react-native"
import LoginScreen from "../page/Login"
import GateScreen from "../page/Gate"
import RegisterScreen from "../page/Register"
import AccountScreen from "../page/Account"
import QRLoginScreen from "../page/QRLogin"
import NotifyScreen from "../page/Notify"
import CustomTabBar from "../components/CustomTabBar"
import { IconSmit, IconNotify, IconLoginQR, IconAcount } from "../assets"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as React from "react"

declare global {
    // @ts-ignore
    var authState: {
        isLogin?: boolean
        language?: string
        country?: string
    }
}

// Định nghĩa kiểu tham số cho Stack Navigator
type RootStackParamList = {
    auth: undefined
    inapp: { screen?: string; source?: string }
    login: undefined
}

// Định nghĩa kiểu tham số cho Tab Navigator
type TabParamList = {
    Gate: undefined
    Notify: undefined
    "Đăng nhập": undefined
    "Tài khoản": undefined
}

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

// Định nghĩa kiểu cho tham số của tabBarIcon
interface TabBarIconProps {
    focused: boolean
    color: string
    size: number
    route: { name: string }
}

const getTabNavigatorOptions = () => {
    return {
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700" as "700",
            marginTop: 6 // Tạo khoảng cách giữa icon và text
        },
        headerShown: false,
        tabBarActiveTintColor: "#007CFA",
        tabBarInactiveTintColor: "gray",
        // Thêm style cho bottom tab bar
        tabBarStyle: {
            backgroundColor: "#F5FAFF", // Màu nền của bottom tab
            paddingTop: 10,
            borderTopWidth: 1
        },

        tabBarIcon: ({ focused, color, size, route }: TabBarIconProps) => {
            // Sử dụng icon mặc định
            if (route.name === "Gate") {
                return <IconSmit width={28} height={28} focused={focused} />
            } else if (route.name === "Tài khoản") {
                return <IconAcount width={32} height={32} focused={focused} />
            } else if (route.name === "Notify") {
                return <IconNotify width={28} height={28} focused={focused} />
            } else if (route.name === "Đăng nhập") {
                return <IconLoginQR width={28} height={28} focused={focused} />
            }
        }
    }
}

export const AppNavigation = () => {
    // State hiện tại
    const [initialRoute, setInitialRoute] = React.useState<"auth" | "inapp">("auth")
    const [isLoading, setIsLoading] = React.useState(true)
    const [initialParams, setInitialParams] = React.useState<any>({})

    // Thêm state để theo dõi trạng thái API
    const [apiData, setApiData] = React.useState<any>(null)
    const [isApiLoaded, setIsApiLoaded] = React.useState(false)

    // useEffect để đợi API hoàn thành, với timeout 1 phút
    React.useEffect(() => {
        const startTime = Date.now()
        const MAX_WAIT_TIME = 60000 // 1 phút = 60000ms

        const checkApiData = () => {
            // Kiểm tra xem global.authState đã có dữ liệu chưa
            if (global.authState && Object.keys(global.authState).length > 0) {
                setApiData(global.authState)
                setIsApiLoaded(true)
                return true
            }

            // Kiểm tra timeout
            if (Date.now() - startTime > MAX_WAIT_TIME) {
                console.log("API timeout after 1 minute")
                // Không cần apiTimeout, chỉ cần đánh dấu là đã loaded
                setIsApiLoaded(true)
                return true
            }

            return false
        }

        // Kiểm tra ngay lần đầu
        if (checkApiData()) return

        // Nếu chưa có dữ liệu, kiểm tra lại định kỳ
        const intervalId = setInterval(() => {
            if (checkApiData()) {
                clearInterval(intervalId)
            }
        }, 300)

        // Đảm bảo interval bị clear sau khi component unmount
        return () => clearInterval(intervalId)
    }, [])

    // Quyết định điều hướng dựa trên API
    React.useEffect(() => {
        if (isApiLoaded) {
            const checkNavigation = async () => {
                try {
                    // Kiểm tra trạng thái đăng nhập từ API
                    if (apiData && apiData.isLogin) {
                        setInitialRoute("inapp")

                        // Kiểm tra lastScreen ngay cả khi đã đăng nhập
                        const lastScreen = await AsyncStorage.getItem("lastScreen")
                        if (lastScreen === "QRLogin") {
                            setInitialParams({ screen: "Đăng nhập" }) // Đến màn QRLogin
                        } else {
                            setInitialParams({ screen: "Tài khoản" }) // Đến màn Tài khoản
                        }
                    } else {
                        setInitialRoute("auth")
                    }
                } catch (error) {
                    console.error("Lỗi khi kiểm tra điều hướng:", error)
                    // Nếu có lỗi, về auth nếu chưa đăng nhập
                    if (!apiData || !apiData.isLogin) {
                        setInitialRoute("auth")
                    }
                } finally {
                    setIsLoading(false)
                }
            }

            checkNavigation()
        }
    }, [isApiLoaded, apiData])

    // Hiển thị loading khi đang đợi API
    // if (isLoading) {
    //     return null // hoặc hiển thị một loading indicator
    // }

    if (isLoading) {
        return (
            <>
                <ImageBackground source={require("../assets/bgr2.png")} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </ImageBackground>
            </>
        )
    }

    // Render navigation sau khi đã có dữ liệu API
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
                <Stack.Screen name="auth" component={AuthNavigation} />
                <Stack.Screen name="inapp" component={InappNavigation} initialParams={initialParams} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

// màn đăng nhập
const AuthNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
    )
}

// màn hình chính
const InappNavigation = ({ route }: { route: any }) => {
    // Lấy thông tin màn hình cần chuyển đến từ tham số
    const initialParams = route.params || {}
    const initialRouteName = initialParams.screen || "Gate"

    React.useEffect(() => {
        const checkPermissionOnStart = async () => {
            if (initialRouteName === "Đăng nhập") {
                // Xóa dữ liệu đã lưu để tránh loop
                await AsyncStorage.multiRemove(["lastScreen", "showCamera"])
            }
        }

        checkPermissionOnStart()
    }, [initialRouteName])

    return (
        <Tab.Navigator
            initialRouteName={initialRouteName}
            tabBar={props => {
                const currentRoute = props.state.routes[props.state.index]
                // Sử dụng type assertion để cho TypeScript biết params có thể có showTabBar
                const params = currentRoute.params as { showTabBar?: boolean } | undefined

                if (currentRoute.name === "Gate" && !params?.showTabBar) {
                    return null
                }
                return <CustomTabBar {...props} />
            }}
            screenOptions={({ route }: { route: any }) => ({
                ...getTabNavigatorOptions(),
                tabBarIcon: props => getTabNavigatorOptions().tabBarIcon({ ...props, route })
            })}>
            <Tab.Screen name="Gate" component={GateScreen} />
            <Tab.Screen name="Notify" component={NotifyScreen} />
            <Tab.Screen name="Đăng nhập" component={QRLoginScreen} />
            <Tab.Screen name="Tài khoản" component={AccountScreen} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    // Styles moved to CustomTabBar component
})
