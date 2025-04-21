import * as React from "react"
import { View, StyleSheet, Platform, Alert } from "react-native"
import { AppNavigation } from "./src/navigation/AppNavigation"
import { Provider as PaperProvider } from "react-native-paper"
import SplashScreen from "react-native-splash-screen"
import { PermissionsAndroid } from "react-native"
import messaging from "@react-native-firebase/messaging"

function App(): React.JSX.Element {
    React.useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide()
        }, 500)

        if (Platform.OS == "android") {
            requestPermissionsAndroid()
        } else {
            requestIosPermission()
        }

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage))
        })

        return unsubscribe
    }, [])

    const requestPermissionsAndroid = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Alert.alert("Granted")
            getToken()
        } else {
            // Alert.alert("Denied")
        }
    }

    const requestIosPermission = async () => {
        try {
            const authStatus = await messaging().requestPermission()
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL

            if (enabled) {
                getToken()
            } else {
                console.log("Từ chối quyền thông báo iOS")
            }
        } catch (error) {
            console.error("Lỗi khi yêu cầu quyền iOS:", error)
        }
    }

    const getToken = async () => {
        const token = await messaging().getToken()

        console.log("token", token)
    }

    return (
        <PaperProvider>
            <View style={styles.container}>
                <AppNavigation />
            </View>
        </PaperProvider>
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
