// App.tsx
import * as React from "react"
import { View, StyleSheet } from "react-native"
import { AppNavigation } from "./src/navigation/AppNavigation"
import { Provider as PaperProvider } from "react-native-paper"
import SplashScreen from "react-native-splash-screen"
import NotificationProvider from "./src/components/NotificationProvider"

function App(): React.JSX.Element {
    React.useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide()
        }, 500)
    }, [])

    return (
        <NotificationProvider
            onNotificationReceived={message => {
                console.log("Nhận thông báo:", message)
                // Xử lý thêm khi nhận thông báo
            }}
            onTokenReceived={token => {
                console.log("Token mới:", token)
                // Gửi token lên server của bạn
            }}>
            <PaperProvider>
                <View style={styles.container}>
                    <AppNavigation />
                </View>
            </PaperProvider>
        </NotificationProvider>
    )
}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
})
