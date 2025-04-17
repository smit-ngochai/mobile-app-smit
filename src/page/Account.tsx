import * as React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal, Pressable, TextInput, FlatList, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { IconEmail, IconChevronRight, IconEdit, IconPhone, IconPasswork, Icon2Fa, IconMonitor, IconSearch, IconLogout, IconKey } from "../assets"
import LinearGradient from "react-native-linear-gradient"
import ModalCustom from "../components/ModalCustom"
import dayjs from "dayjs"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import api from "../globall/globall"

// Khai báo kiểu cho global
declare global {
    var authState: {
        user?: {
            name?: string
            email?: string
            phone_number?: string
            created_at?: string
        }
    }
}

// Khai báo kiểu cho RootStackParamList
type RootStackParamList = {
    auth: undefined
    // Thêm các màn hình khác nếu cần
}

// Định nghĩa kiểu cho selectedDevice
interface DeviceType {
    id: string
    name: string
    user_agent: string
    last_activity: number
    // Thêm các trường khác nếu cần
}

// Tạo một service riêng để quản lý dữ liệu thiết bị
const DeviceService = {
    // Cache dữ liệu thiết bị
    data: [] as any[],

    // Hàm lấy dữ liệu
    async fetchDevices() {
        try {
            const res = await api({
                url: "/dashboard/sessions/active",
                method: "GET",
                params: {
                    page: 1,
                    limit: 50
                }
            })

            if (res.error) {
                Alert.alert(res.message || "Lấy danh sách thiết bị thất bại")
                return []
            }

            const devicesWithNames = res.data.map((device: any) => ({
                ...device,
                id: device.id,
                name: getDeviceName(device.user_agent),
                lastLogin: formatLastActivity(device.last_activity),
                isCurrent: true
            }))

            // Cập nhật cache
            this.data = devicesWithNames

            return devicesWithNames
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thiết bị:", error)
            return []
        }
    },

    // Hàm lấy số lượng thiết bị
    getCount() {
        return this.data.length
    }
}

// Modal thiết bị
const DevicesModal = ({ visible, onClose, onDeviceDataChanged }: { visible: boolean; onClose: () => void; onDeviceDataChanged?: () => void }) => {
    const search_name_id = React.useRef<TextInput>(null)
    const [modal_logout_visible, setModalLogoutVisible] = React.useState(false)
    const [selected_device, setSelectedDevice] = React.useState<DeviceType | null>(null)
    // Thêm state mới để kiểm soát hiển thị modal thiết bị
    const [hide_device_modal, setHideDeviceModal] = React.useState(false)
    const [device_data, setDeviceData] = React.useState<any[]>([])
    const [search_focused, setSearchFocused] = React.useState(false)

    // Hàm mở modal đăng xuất và ẩn modal thiết bị
    const openLogoutModal = (device: DeviceType | null = null) => {
        setSelectedDevice(device)
        // Ẩn modal thiết bị trước khi hiển thị modal xác nhận
        setHideDeviceModal(true)
        setModalLogoutVisible(true)
    }

    // Đóng modal xác nhận và hiển thị lại modal thiết bị
    const closeLogoutModal = () => {
        setModalLogoutVisible(false)
        setHideDeviceModal(false)
    }

    // Hàm xử lý khi xác nhận đăng xuất
    const handleConfirmLogout = async () => {
        const res = await api({
            url: `/dashboard/sessions/remove`,
            method: "DELETE",
            data: {
                session_id: selected_device ? selected_device.id : "all",
                delete_all: !selected_device
            }
        })

        if (res.error) {
            Alert.alert(res.message || "Đăng xuất thiết bị thất bại")
        } else {
            // Cập nhật lại danh sách thiết bị
            const updatedDevices = await DeviceService.fetchDevices()
            setDeviceData(updatedDevices)
            if (onDeviceDataChanged) {
                onDeviceDataChanged()
            }
        }

        // Đóng các modal
        setModalLogoutVisible(false)
        setHideDeviceModal(false) // Đảm bảo reset state này
        setSelectedDevice(null) // Reset device đã chọn

        // Đóng modal thiết bị sau khi reset state
        onClose()
    }

    // Cập nhật dữ liệu khi modal hiển thị
    React.useEffect(() => {
        const refreshDevices = async () => {
            if (visible) {
                const devices = await DeviceService.fetchDevices()
                setDeviceData(devices)
                // Thông báo cho component cha biết dữ liệu đã thay đổi
                if (onDeviceDataChanged) {
                    onDeviceDataChanged()
                }
            } else {
                // Reset trạng thái focus khi modal đóng
                setSearchFocused(false)
            }
        }

        refreshDevices()
    }, [visible, onDeviceDataChanged])

    return (
        <>
            <ModalCustom visible={visible && !hide_device_modal} onClose={onClose}>
                <View style={{ marginBottom: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <IconMonitor />
                        <Text style={[styles.container_item_text, { fontWeight: "700" }]}>Quản lý thiết bị</Text>
                    </View>
                    <Text style={[styles.container_item_text, { fontWeight: "700" }]}>{device_data.length} thiết bị</Text>
                </View>
                <Pressable
                    onPress={() => {
                        search_name_id.current?.focus()
                        setSearchFocused(true)
                    }}
                    style={[
                        styles.button,
                        styles.buttonSearch,
                        {
                            borderColor: search_focused ? "#1A8CFF" : "#CCE4FF"
                        }
                    ]}>
                    <IconSearch focused={search_focused} />
                    <TextInput ref={search_name_id} style={{ flex: 1, fontSize: 15, fontWeight: "500", height: 44 }} placeholder="Tìm kiếm tên hoặc ID .." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
                </Pressable>

                <View style={[styles.modal_list_device]}>
                    <DeviceList devices={device_data} onLogoutDevice={openLogoutModal} />
                </View>

                <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => openLogoutModal()}>
                    <Text style={styles.textStyle}>Đăng xuất khỏi toàn bộ {device_data.length} thiết bị</Text>
                </TouchableOpacity>
            </ModalCustom>

            <ModalCustom visible={modal_logout_visible} onClose={closeLogoutModal} closeOnBackdropPress={false} padding={0}>
                <ImageBackground source={require("../assets/account/bgr_modal.png")} style={{ padding: 20, paddingVertical: 25, overflow: "hidden" }} imageStyle={{ borderRadius: 20 }}>
                    <Image source={require("../assets/account/logout.png")} />
                    <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 10, marginLeft: 20 }}>Đăng xuất tài khoản</Text>
                    <Text style={{ fontSize: 15, fontWeight: "400", marginBottom: 30, marginLeft: 20 }}>Tài khoản sẽ được đăng xuất khỏi thiết bị, vẫn tiếp tục?</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15 }}>
                        <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 10 }]} activeOpacity={0.7} onPress={closeLogoutModal}>
                            <Text style={{ textAlign: "center", fontWeight: "600", fontSize: 16 }}>Hủy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, { flex: 1, marginTop: 0, backgroundColor: "#FDECED" }]} activeOpacity={0.7} onPress={handleConfirmLogout}>
                            <Text style={{ textAlign: "center", color: "#ED1723", fontWeight: "600", fontSize: 16 }}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ModalCustom>
        </>
    )
}

// Modal mk
const DevicesModalMK = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const mk_old = React.useRef<TextInput>(null)
    const mk_new = React.useRef<TextInput>(null)
    const confirm_mk_new = React.useRef<TextInput>(null)
    const handle_close_ref = React.useRef<(() => void) | null>(null)
    const two_fa_input_ref = React.useRef<TextInput>(null)
    const [focused_input, setFocusedInput] = React.useState<string | null>(null)

    const [old_password, setOldPassword] = React.useState("")
    const [new_password, setNewPassword] = React.useState("")
    const [confirm_password, setConfirmPassword] = React.useState("")
    const [input_2fa, setInput_2fa] = React.useState("")

    // Thêm state để kiểm soát hiển thị modal xác nhận
    const [modal_confirm_visible, setModalConfirmVisible] = React.useState(false)
    const [hide_main_modal, setHideMainModal] = React.useState(false)

    // Reset tất cả state khi modal đóng
    React.useEffect(() => {
        if (!visible) {
            setHideMainModal(false)
            setModalConfirmVisible(false)
            // setIsTwoFactor(false)
        }
    }, [visible])

    // Thêm hàm mở modal xác nhận
    const openConfirmModal = () => {
        setHideMainModal(true)
        setModalConfirmVisible(true)
    }

    // Thêm hàm đóng modal xác nhận
    const closeConfirmModal = () => {
        setModalConfirmVisible(false)
        setHideMainModal(false)
        setFocusedInput(null)
    }

    const changePassword = async () => {
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (new_password !== confirm_password) {
            Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp")
            return
        }

        const res = await api({
            url: "/dashboard/user/change/password",
            method: "PUT",
            data: {
                old_password: old_password,
                new_password: new_password
            }
        })
        if (res.error) {
            if (res.subcode === "user-two-factor-is-required") {
                openConfirmModal()
            } else {
                Alert.alert("Lỗi", res.message || "Đổi mật khẩu thất bại")
            }
        } else {
            Alert.alert("Thành công", "Đổi mật khẩu thành công")
            // Reset tất cả input
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setInput_2fa("")
            // Đóng modal
            onClose()
        }
    }

    const senTwoFactors = async () => {
        const res = await api({
            url: "/dashboard/user/two_factors",
            method: "POST",
            data: {
                otp: input_2fa
            }
        })
        if (res.error) return Alert.alert("Lỗi", res.message || "Nhập 2FA thất bại")
        // Đóng modal 2FA trước khi gọi lại changePassword
        changePassword()
    }

    return (
        <>
            <ModalCustom visible={visible && !hide_main_modal} onClose={onClose} useKeyboardAvoidingView={true} handleCloseRef={handle_close_ref}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <IconMonitor />
                    <Text style={[styles.container_item_text, { fontWeight: "700" }]}>Đổi mật khẩu </Text>
                </View>
                <Pressable
                    onPress={() => {
                        mk_old.current?.focus()
                    }}
                    style={[
                        styles.button,
                        styles.buttonSearch,
                        {
                            paddingHorizontal: 12,
                            gap: 12,
                            borderColor: focused_input === "old_password" ? "#1A8CFF" : "#CCE4FF"
                        }
                    ]}>
                    <IconKey focused={focused_input === "old_password"} />
                    <TextInput
                        ref={mk_old}
                        value={old_password}
                        onChangeText={setOldPassword}
                        onFocus={() => setFocusedInput("old_password")}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                            fontSize: 15,
                            fontWeight: "500",
                            flex: 1,
                            height: 44
                        }}
                        placeholder="Mật khẩu cũ..."
                        secureTextEntry={true}
                    />
                </Pressable>
                <Pressable
                    onPress={() => {
                        mk_new.current?.focus()
                    }}
                    style={[
                        styles.button,
                        styles.buttonSearch,
                        {
                            marginTop: 12,
                            gap: 12,
                            paddingHorizontal: 12,
                            borderColor: focused_input === "new_password" ? "#1A8CFF" : "#CCE4FF"
                        }
                    ]}>
                    <IconKey focused={focused_input === "new_password"} />
                    <TextInput ref={mk_new} value={new_password} onChangeText={setNewPassword} onFocus={() => setFocusedInput("new_password")} onBlur={() => setFocusedInput(null)} style={{ flex: 1, fontSize: 15, fontWeight: "500", height: 44 }} placeholder="Mật khẩu mới..." secureTextEntry={true} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        confirm_mk_new.current?.focus()
                    }}
                    style={[
                        styles.button,
                        styles.buttonSearch,
                        {
                            marginTop: 12,
                            gap: 12,
                            paddingHorizontal: 12,
                            borderColor: focused_input === "confirm_password" ? "#1A8CFF" : "#CCE4FF"
                        }
                    ]}>
                    <IconKey focused={focused_input === "confirm_password"} />
                    <TextInput ref={confirm_mk_new} value={confirm_password} onChangeText={setConfirmPassword} onFocus={() => setFocusedInput("confirm_password")} onBlur={() => setFocusedInput(null)} style={{ flex: 1, fontSize: 15, fontWeight: "500", height: 44 }} placeholder="Xác nhận mật khẩu mới.." secureTextEntry={true} />
                </Pressable>
                <TouchableOpacity style={{ marginTop: 25 }} activeOpacity={0.7} onPress={() => changePassword()}>
                    <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12, height: 40, justifyContent: "center", alignItems: "center" }}>
                        <Text style={[styles.button, styles.buttonConfirm]}>Xác nhận</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ModalCustom>

            {/* Modal gửi 2FA  */}
            <ModalCustom visible={modal_confirm_visible} onClose={closeConfirmModal} useKeyboardAvoidingView={true} closeOnBackdropPress={false} padding={0}>
                <ImageBackground source={require("../assets/account/bgr_modal.png")} style={{ paddingHorizontal: 40, paddingVertical: 25, overflow: "hidden", alignItems: "center" }} imageStyle={{ borderRadius: 20 }}>
                    <Icon2Fa width={76} height={76} />
                    <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 25 }}>Nhập mã 2Fa</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", lineHeight: 24, marginTop: 15, width: 290, textAlign: "center" }}>Mở ứng dụng xác thực của bạn và điền đoạn mã để xác thực</Text>
                    <Pressable
                        onPress={() => {
                            two_fa_input_ref.current?.focus()
                            setFocusedInput("two_fa")
                        }}
                        style={[
                            styles.button,
                            styles.buttonSearch,
                            {
                                marginTop: 20,
                                gap: 12,
                                paddingHorizontal: 12,
                                borderColor: focused_input === "two_fa" ? "#1A8CFF" : "#CCE4FF"
                            }
                        ]}>
                        <IconKey focused={focused_input === "two_fa"} />
                        <TextInput ref={two_fa_input_ref} value={input_2fa} onChangeText={setInput_2fa} onFocus={() => setFocusedInput("two_fa")} onBlur={() => setFocusedInput(null)} style={{ flex: 1, fontSize: 15, fontWeight: "500", height: 44 }} placeholder="Nhập 2FA..." secureTextEntry={true} />
                    </Pressable>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
                        <TouchableOpacity style={[styles.button, { flex: 1 }]} activeOpacity={0.7} onPress={closeConfirmModal}>
                            <Text style={{ textAlign: "center", fontWeight: "600", fontSize: 16 }}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{ flex: 1 }]} activeOpacity={0.7} onPress={senTwoFactors}>
                            <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12, justifyContent: "center", alignItems: "center" }}>
                                <Text style={[styles.button, { fontWeight: "600", fontSize: 16, color: "#fff" }]}>Xác nhận</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ModalCustom>
        </>
    )
}

// Tạo một component DeviceList riêng biệt
const DeviceList = ({ devices, onLogoutDevice }: { devices: any[]; onLogoutDevice?: (device: any) => void }) => {
    return (
        <FlatList
            data={devices}
            renderItem={({ item }) => (
                <Pressable style={styles.modal_list_device_item}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <IconMonitor focused={item.isCurrent} />
                        <View>
                            <Text style={{ fontSize: 15, fontWeight: "500", lineHeight: 21 }}>{item.name}</Text>
                            <Text style={{ fontSize: 15, fontWeight: "500", lineHeight: 21, color: "#A0AEC0" }}>Đăng nhập: {item.lastLogin}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            backgroundColor: item.is_session ? "#F1F2F4" : "#fff",
                            borderRadius: 25,
                            borderWidth: 1,
                            borderColor: item.is_session ? "#E1E1E1" : "#CCE4FF"
                        }}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (item.is_session) {
                                Alert.alert("Đây là thiết bị bạn đang sử dụng")
                            } else {
                                onLogoutDevice && onLogoutDevice(item)
                            }
                        }}>
                        <IconLogout color={item.is_session ? "#ED1723" : undefined} />
                    </TouchableOpacity>
                </Pressable>
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: 10 }}
        />
    )
}

// Modal xác nhận đăng xuất
const LogoutConfirmModal = ({ visible, onClose, onLogout }: { visible: boolean; onClose: () => void; onLogout: () => void }) => {
    return (
        <ModalCustom visible={visible} onClose={onClose} padding={0}>
            <ImageBackground source={require("../assets/account/bgr_modal.png")} style={{ padding: 20, overflow: "hidden" }} imageStyle={{ borderRadius: 20 }}>
                <Image source={require("../assets/account/logout.png")} />
                <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 10, marginLeft: 20 }}>Đăng xuất tài khoản</Text>
                <Text style={{ fontSize: 15, fontWeight: "400", marginBottom: 30, marginLeft: 20 }}>Tài khoản sẽ được đăng xuất khỏi thiết bị, vẫn tiếp tục?</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 10 }]} activeOpacity={0.7} onPress={onClose}>
                        <Text style={{ textAlign: "center", fontWeight: "600", fontSize: 16 }}>Hủy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { flex: 1, marginTop: 0, backgroundColor: "#FDECED" }]} activeOpacity={0.7} onPress={onLogout}>
                        <Text style={{ textAlign: "center", color: "#ED1723", fontWeight: "600", fontSize: 16 }}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </ModalCustom>
    )
}

// Thêm hàm định dạng thời gian
const formatLastActivity = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000)
    const diffSeconds = now - timestamp

    if (diffSeconds < 60) {
        return "Vừa xong"
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60)
        return `${minutes} phút trước`
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600)
        return `${hours} giờ trước`
    } else {
        const days = Math.floor(diffSeconds / 86400)
        return `${days} ngày trước`
    }
}

// fomart name thiết bị đăng nhập
const getDeviceName = (userAgent: string): string => {
    if (!userAgent) return "Thiết bị không xác định"

    // Kiểm tra iOS/iPhone
    if (userAgent.includes("AppSmit") && userAgent.includes("Darwin")) {
        return "iPhone"
    }

    // Kiểm tra macOS
    if (userAgent.includes("Macintosh") && userAgent.includes("Mac OS X")) {
        return "Mac OS"
    }

    // Kiểm tra Android
    if (userAgent.includes("okhttp")) {
        return "Android"
    }

    // Kiểm tra các trình duyệt phổ biến trên Windows
    if (userAgent.includes("Windows")) {
        if (userAgent.includes("Chrome")) {
            return "Windows (Chrome)"
        } else if (userAgent.includes("Firefox")) {
            return "Windows (Firefox)"
        } else if (userAgent.includes("Edge")) {
            return "Windows (Edge)"
        } else {
            return "Windows"
        }
    }

    // Trường hợp không xác định được
    return "Thiết bị khác"
}

function AccountScreen() {
    const [modal_visible, setModalVisible] = React.useState(false)
    const [modal_mk, setModalMK] = React.useState(false)
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
    const [logout_modal_visible, setLogoutModalVisible] = React.useState(false)
    const [device_count, setDeviceCount] = React.useState(0)

    const infoUser = global.authState?.user

    // Lấy dữ liệu thiết bị khi component mount
    React.useEffect(() => {
        const initializeDevices = async () => {
            await DeviceService.fetchDevices()
            // Cập nhật deviceCount từ service
            setDeviceCount(DeviceService.getCount())
        }

        initializeDevices()
    }, [])

    // Hàm cập nhật số thiết bị khi có thay đổi
    const updateDeviceCount = () => {
        setDeviceCount(DeviceService.getCount())
    }

    // Lấy thông tin user từ global.authState
    const logout = async () => {
        const res = await api({
            url: "/dashboard/user/logout",
            method: "DELETE"
        })
        if (res.error) return Alert.alert(res.message || "Đăng xuất thất bại")
        await setLogoutModalVisible(false)
        setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: "auth" }]
            })
        }, 50)
    }

    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container}>
            {/* Modall thiết bị */}
            <DevicesModal visible={modal_visible} onClose={() => setModalVisible(false)} onDeviceDataChanged={updateDeviceCount} />
            <DevicesModalMK visible={modal_mk} onClose={() => setModalMK(false)} />
            <LogoutConfirmModal visible={logout_modal_visible} onClose={() => setLogoutModalVisible(false)} onLogout={logout} />

            <Image source={require("../assets/account/avatar.png")} />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 25 }}>{infoUser?.name}</Text>
            <Text style={{ fontSize: 15, fontWeight: "500", marginTop: 8, color: "#718096" }}>Đã tham gia {dayjs(infoUser?.created_at).format("DD.MM.YYYY")}</Text>
            <View style={styles.container_detail}>
                <View style={styles.container_item}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 5 }}>
                        <IconEmail />
                        <Text style={styles.container_item_title}>Email</Text>
                    </View>
                    <Text style={styles.container_item_text}>{infoUser?.email}</Text>
                </View>
                <View style={[styles.container_item, { marginTop: 15 }]}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 5 }}>
                        <IconPhone />
                        <Text style={styles.container_item_title}>Phone</Text>
                    </View>
                    <Text style={styles.container_item_text}>{infoUser?.phone_number || "Chưa liên kết SĐT"}</Text>
                </View>
                <Pressable style={[styles.container_item, { marginTop: 15 }]} onPress={() => setModalMK(true)}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 5 }}>
                            <IconPasswork />
                            <Text style={styles.container_item_title}>Mật khẩu</Text>
                        </View>
                        <IconEdit />
                    </View>
                    <Text style={styles.container_item_text}>**********</Text>
                </Pressable>

                <Pressable style={[styles.container_item, { marginTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]} onPress={() => setModalVisible(true)}>
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 5 }}>
                            <IconMonitor />
                            <Text style={styles.container_item_title}>Thiết bị</Text>
                        </View>
                        <Text style={[styles.container_item_text, { color: "#07B77A" }]}>Đang đăng: {device_count} thiết bị</Text>
                    </View>
                    <IconChevronRight width={26} height={26} />
                </Pressable>

                <View onTouchEnd={() => setLogoutModalVisible(true)} style={[styles.container_item, styles.btn_logout]}>
                    <Text style={{ color: "#ED1723", fontSize: 16, fontWeight: "600" }}>Đăng xuất</Text>
                </View>
            </View>
        </ImageBackground>
    )
}

export default AccountScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "cover",
        backgroundColor: "#F5FAFF",
        paddingHorizontal: 40
    },

    container_detail: {
        width: "100%",
        marginTop: 30
    },

    container_item: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#CCE4FF"
    },

    container_item_title: {
        fontSize: 14,
        fontWeight: "500",
        color: "#718096"
    },

    container_item_text: {
        fontSize: 15,
        fontWeight: "600"
    },

    // Thêm styles cho Modal
    centeredView: {
        flex: 1,
        justifyContent: "flex-end", // Thay đổi từ "center" thành "flex-end"
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalView: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20, // Chỉ bo góc phía trên
        borderTopRightRadius: 20, // Chỉ bo góc phía trên

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2 // Đổi chiều bóng đổ
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: "100%", // Chiếm toàn bộ chiều rộng
        paddingHorizontal: 20, // Thêm padding ở dưới để có không gian
        paddingVertical: 25
    },

    button: {
        borderRadius: 8,
        padding: 10
    },
    buttonClose: {
        backgroundColor: "#ED1723",
        marginTop: 13,
        alignItems: "center",
        height: 40
    },

    buttonSearch: {
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#CCE4FF",
        gap: 4
    },

    buttonConfirm: {
        color: "#fff",
        fontWeight: "500",
        textAlign: "center",
        fontSize: 14
    },

    textStyle: {
        color: "white",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 15
    },

    modal_list_device: {
        maxHeight: 450,
        marginTop: 14,
        marginRight: -7
    },

    modal_list_device_item: {
        padding: 12,
        borderRadius: 16,
        backgroundColor: "#F5FAFF",
        borderWidth: 1,
        borderColor: "#CCE4FF",
        height: 70,
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 7
    },
    btn_logout: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        justifyContent: "center",
        backgroundColor: "#FDECED",
        borderRadius: 12,
        borderWidth: 0,
        borderColor: "#CCE4FF"
    }
})
