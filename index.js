/**
 * @format
 */

import { AppRegistry } from "react-native"
import App from "./App"
import { name as appName } from "./app.json"
import api from "./src/globall/globall"
// globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true

// Khởi tạo global.authState
global.authState = {}

export const checkAuth = async () => {
    try {
        const res = await api({
            url: "/public/authentication",
            method: "GET"
        })

        if (res && !res.error) {
            global.authState = res
        }

        return res
    } catch (error) {
        console.error("Auth check failed:", error)
        return null
    }
}

// Gọi API ngay lập tức khi khởi động
checkAuth()

// Đăng ký component trước (quan trọng)
AppRegistry.registerComponent(appName, () => App)
