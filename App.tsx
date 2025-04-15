import * as React from "react"
import { View, StyleSheet, Platform } from "react-native"
import { AppNavigation } from "./src/navigation/AppNavigation"
import { Provider as PaperProvider } from "react-native-paper"
import SplashScreen from "react-native-splash-screen"

function App(): React.JSX.Element {
    React.useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide()
        }, 500)
    }, [])

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
