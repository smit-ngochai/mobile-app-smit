// src/components/NotificationProvider.tsx
import React, { useEffect, useRef, createContext, useContext } from "react"
import { Platform, AppState, AppStateStatus, Alert } from "react-native"
import { PermissionsAndroid } from "react-native"
// Nhập các hàm modular
import { getApp } from "@react-native-firebase/app"
import { getMessaging, onMessage, getToken as getFCMToken, requestPermission as requestFCMPermission, AuthorizationStatus, onNotificationOpenedApp as onFCMNotificationOpenedApp, getInitialNotification as getFCMInitialNotification } from "@react-native-firebase/messaging"
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import ShortcutBadge from "react-native-app-badge"
import notifee, { AndroidImportance } from "@notifee/react-native"

interface NotificationContextType {
    resetBadge: () => Promise<void>
    requestPermissions: () => Promise<void>
    getToken: () => Promise<string | null>
}

const NotificationContext = createContext<NotificationContextType>({
    resetBadge: async () => {},
    requestPermissions: async () => {},
    getToken: async () => null
})

export const useNotification = () => useContext(NotificationContext)

interface NotificationProviderProps {
    children: React.ReactNode
    onNotificationReceived?: (remoteMessage: any) => void
    onTokenReceived?: (token: string) => void
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, onNotificationReceived, onTokenReceived }) => {
    // Lưu trạng thái ứng dụng
    // const appState = useRef(AppState.currentState)

    // Lấy tham chiếu đến Firebase app và messaging
    const app = getApp()
    const messaging = getMessaging(app)

    // Tạo channel cho Android (chỉ cần tạo 1 lần)
    useEffect(() => {
        if (Platform.OS === "android") {
            notifee.createChannel({
                id: "default",
                name: "Default Channel",
                importance: AndroidImportance.HIGH
            })
        }
    }, [])

    // Hàm reset badge count
    const resetBadge = async () => {
        try {
            if (Platform.OS === "ios") {
                // PushNotificationIOS.setApplicationIconBadgeNumber(0)
                await notifee.setBadgeCount(0)
                console.log("Badge đã được reset về 0")
            } else if (Platform.OS === "android") {
                await ShortcutBadge.setCount(0)
                await notifee.cancelAllNotifications()
                console.log("Badge Android đã được reset về 0")
            }
        } catch (error) {
            console.error("Lỗi khi reset badge:", error)
        }
    }

    // Hàm xin quyền cho Android
    const requestPermissionsAndroid = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getToken()
            } else {
                console.log("Quyền thông báo Android bị từ chối")
            }
        } catch (error) {
            console.error("Lỗi khi yêu cầu quyền Android:", error)
        }
    }

    // Hàm xin quyền cho iOS
    const requestIosPermission = async () => {
        try {
            // Yêu cầu quyền
            const authStatus = await requestFCMPermission(messaging, {
                badge: true,
                sound: true,
                alert: true
            })

            const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL

            if (enabled) {
                getToken()
            } else {
                console.log("Từ chối quyền thông báo iOS")
            }
        } catch (error) {
            console.error("Lỗi khi yêu cầu quyền iOS:", error)
        }
    }

    // Hàm lấy token
    const getToken = async (): Promise<string | null> => {
        try {
            const token = await getFCMToken(messaging)
            console.log("FCM Token:", token)

            if (onTokenReceived) {
                onTokenReceived(token)
            }

            return token
        } catch (error) {
            console.error("Lỗi khi lấy token:", error)
            return null
        }
    }

    // Function để yêu cầu quyền theo platform
    const requestPermissions = Platform.OS === "ios" ? requestIosPermission : requestPermissionsAndroid

    // Setup các listener
    useEffect(() => {
        // Yêu cầu quyền dựa trên nền tảng
        requestPermissions()
        // Xử lý thông báo khi app đang mở
        const messageListener = onMessage(messaging, async remoteMessage => {
            const title = remoteMessage.notification?.title || "Thông báo mới"
            const body = remoteMessage.notification?.body || ""

            let badgeCount = Number(remoteMessage?.data?.notificationCount) || 0

            await notifee.displayNotification({
                title,
                body,
                android: {
                    channelId: "default",
                    importance: AndroidImportance.HIGH
                },
                ios: {
                    badgeCount: badgeCount
                }
            })

            if (onNotificationReceived) {
                onNotificationReceived(remoteMessage)
            }
        })

        // Xử lý khi app được mở từ thông báo (background) (khi màn hình mở nhưng ở ngoài app)
        onFCMNotificationOpenedApp(messaging, remoteMessage => {
            console.log("Notification opened app from background:", remoteMessage)
        })

        // Xử lý khi app được mở từ thông báo (khi khoá màn hình)
        getFCMInitialNotification(messaging).then(remoteMessage => {
            if (remoteMessage) {
                console.log("App opened from quit state:", remoteMessage)
            }
        })

        // Theo dõi thay đổi trạng thái ứng dụng
        // const appStateListener = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
        //     // Khi app chuyển từ background/inactive sang active
        //     if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        //         console.log("App has come to the foreground!")
        //         // Nếu bạn muốn reset badge khi mở app, hãy để lại dòng này
        //         // resetBadge()
        //     }

        //     // Lưu trạng thái hiện tại
        //     appState.current = nextAppState
        // })

        // Cleanup listeners
        return () => {
            messageListener()
            // appStateListener.remove()
        }
    }, [onNotificationReceived, onTokenReceived])

    return <NotificationContext.Provider value={{ resetBadge, requestPermissions, getToken }}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
