// config/toastConfig.tsx
import { BaseToast, ErrorToast } from "react-native-toast-message"
import { CustomToast } from "../components/CustomToast"

export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: "#10b981" }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: "400"
            }}
        />
    ),
    error: (props: any) => <ErrorToast {...props} text1Style={{ fontSize: 17 }} text2Style={{ fontSize: 15 }} />,
    custommm: (props: any) => <CustomToast {...props} />
}
