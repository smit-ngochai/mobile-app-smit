import * as React from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, ScrollView, Image, FlatList, Modal, TouchableWithoutFeedback, Pressable } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { createStackNavigator } from "@react-navigation/stack"
import { IconSearch, IconFolder, IconMoreVert, IconChevronLeft, IconFilter, IconMain, IconChevronRight, IconCloud, IconWatch, IconSend, IconDelete, IconVerify, IconCode } from "../assets"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import GradientText from "../components/GradientText"
import CustomRadio from "../components/CustomRadio"
import ModalCustom from "../components/ModalCustom"

type RootStackParamList = {
    NotifyList: undefined
    GroupDetail: { groupName: string; hasData: boolean }
    ConnectionDetail: { title: string; count: number; lastUpdate: string; icon: string }
}

// Tạo Context để quản lý trạng thái modal
const ModalContext = React.createContext<{
    modalFiller: boolean
    setModalFiller: React.Dispatch<React.SetStateAction<boolean>>
    modalOptions: boolean
    setModalOptions: React.Dispatch<React.SetStateAction<boolean>>
    modalAddGroup: boolean
    setModalAddGroup: React.Dispatch<React.SetStateAction<boolean>>
    modalConnect: boolean
    setModalConnect: React.Dispatch<React.SetStateAction<boolean>>
}>({
    modalFiller: false,
    setModalFiller: () => {},
    modalOptions: false,
    setModalOptions: () => {},
    modalAddGroup: false,
    setModalAddGroup: () => {},
    modalConnect: false,
    setModalConnect: () => {}
})

const Stack = createStackNavigator<RootStackParamList>()

// Modal filler
const DevicesModaFiller = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [selectedFilter, setSelectedFilter] = React.useState("all")

    return (
        <ModalCustom visible={visible} onClose={onClose} height={200}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <IconFilter />

                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Bộ lọc hiển thị thông báo</Text>
            </View>

            <Pressable onPress={() => setSelectedFilter("all")} style={[styles.button, styles.buttonSearch, { marginBottom: 10, borderRadius: 16 }, selectedFilter === "all" && { borderColor: "#1A8CFF" }]}>
                <CustomRadio selected={selectedFilter === "all"} label="Toàn bộ thông báo" color="#1A8CFF" />
            </Pressable>

            <Pressable onPress={() => setSelectedFilter("unread")} style={[styles.button, styles.buttonSearch, { marginBottom: 10, borderRadius: 16 }, selectedFilter === "unread" && { borderColor: "#1A8CFF" }]}>
                <CustomRadio selected={selectedFilter === "unread"} label="Hiển thị thông báo chưa đọc" color="#1A8CFF" />
            </Pressable>
        </ModalCustom>
    )
}

// Modal Options
const DevicesModalOptions = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    return (
        <ModalCustom visible={visible} onClose={onClose} height={270}>
            <Text style={[{ fontWeight: "500", fontSize: 15, marginBottom: 18, color: "#A0AEC0" }]}>Tùy chọn</Text>

            <Pressable style={[styles.button, styles.buttonSearch, styles.button_options, { marginBottom: 10 }]}>
                <IconSend />
                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Xuất ID tài khoản</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.buttonSearch, styles.button_options, { marginBottom: 10 }]}>
                <IconVerify />
                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Đánh dấu tất cả là đã đọc</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonSearch, styles.button_options, { marginBottom: 10 }]}>
                <IconDelete />
                <Text style={[{ fontWeight: "500", fontSize: 15, color: "#ED1723" }]}>Xóa toàn bộ tin trong mục này</Text>
            </Pressable>
        </ModalCustom>
    )
}

// Modal Tạo nhóm mới
const DevicesModalAddGroup = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const inputRefAddGroup = React.useRef<TextInput>(null)

    return (
        <ModalCustom visible={visible} onClose={onClose} height={200} useKeyboardAvoidingView={true}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <IconFolder width={20} height={20} color="black" />
                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Tạo nhóm mới</Text>
            </View>
            <Pressable
                style={[styles.inputContainer, { borderWidth: 1, marginBottom: 20, height: 45 }]}
                onPress={() => {
                    inputRefAddGroup.current?.focus()
                }}>
                <TextInput ref={inputRefAddGroup} style={styles.input} placeholder="Điền tên nhóm..." />
            </Pressable>
            <TouchableOpacity activeOpacity={0.7}>
                <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.linearGradient, { height: 40 }]}>
                    <Text style={[styles.buttonText, { borderRadius: 10 }]}>Xác nhận</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ModalCustom>
    )
}

// Modal Điền mã liên kết
const DevicesModalConnect = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const inputRef = React.useRef<TextInput>(null)

    return (
        <ModalCustom visible={visible} onClose={onClose} height={200} useKeyboardAvoidingView={true}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <IconCode width={24} height={24} />
                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Nhập mã nhận cấu hình</Text>
            </View>
            <Pressable
                style={[styles.inputContainer, { borderWidth: 1, marginBottom: 20, height: 45 }]}
                onPress={() => {
                    inputRef.current?.focus()
                }}>
                <TextInput ref={inputRef} style={styles.input} placeholder="Điền mã tại đây..." />
            </Pressable>
            <TouchableOpacity activeOpacity={0.7}>
                <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.linearGradient, { height: 40 }]}>
                    <Text style={[styles.buttonText, { borderRadius: 10 }]}>Xác nhận</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ModalCustom>
    )
}

// Component cho màn hình chi tiết kết nối
const ConnectionDetailScreen = ({ route }: { route: any }) => {
    const navigation = useNavigation()
    const { title, count, lastUpdate, icon } = route.params || {}
    const { modalFiller, setModalFiller } = React.useContext(ModalContext)
    const { modalOptions, setModalOptions } = React.useContext(ModalContext)

    const notificationData = [
        {
            id: "1",
            message: "Tk Facebook Anna Zahna - 123456789 đã bị mất kết nối nâng cao",
            time: "16:30"
        },
        {
            id: "2",
            message: "Tk Facebook Anna Zahna - 123456789 đã bị mất kết nối nâng cao",
            time: "16:30"
        },
        {
            id: "3",
            message: "Tk Facebook John Doe - 987654321 đã bị mất kết nối nâng cao",
            time: "15:45"
        },
        {
            id: "4",
            message: "Tk Facebook Sarah Smith - 456789123 đã bị mất kết nối nâng cao",
            time: "14:20"
        },
        {
            id: "5",
            message: "Tk Facebook Michael Brown - 789123456 đã bị mất kết nối nâng cao",
            time: "13:10"
        },
        {
            id: "6",
            message: "Tk Facebook Emily Davis - 321654987 đã bị mất kết nối nâng cao",
            time: "12:05"
        },
        {
            id: "7",
            message: "Tk Facebook David Wilson - 654987321 đã bị mất kết nối nâng cao",
            time: "11:30"
        },
        {
            id: "8",
            message: "Tk Facebook Lisa Taylor - 159753468 đã bị mất kết nối nâng cao",
            time: "10:15"
        },
        {
            id: "9",
            message: "Tk Facebook Lisa Taylor - 159753468 đã bị mất kết nối nâng cao",
            time: "10:15"
        },
        {
            id: "10",
            message: "Tk Facebook Lisa Taylor - 159753468 đã bị mất kết nối nâng cao",
            time: "10:15"
        },
        {
            id: "11",
            message: "Tk Facebook Lisa Taylor - 159753468 đã bị mất kết nối nâng cao",
            time: "10:15"
        }
    ]

    // Hàm render item cho FlatList
    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={styles.item_flastlist_container}>
            <View style={styles.item_flastlist}>
                <View style={styles.notificationDotContainer}>
                    <View style={styles.notificationDot}></View>
                </View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
            </View>
            {index < notificationData.length - 1 && <View style={styles.dashedBorder} />}
        </View>
    )

    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IconChevronLeft width={26} height={26} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 5 }}>{title}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                <TouchableOpacity style={[styles.inputContainer, { flex: 1 }]} activeOpacity={0.8} onPress={() => {}}>
                    <IconSearch width={20} height={20} />
                    <TextInput style={styles.input} placeholder="Tìm kiếm tên hoặc ID .." />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setModalFiller(true)
                    }}
                    style={[styles.inputContainer, { height: 44, width: 44, alignItems: "center", justifyContent: "center" }]}
                    activeOpacity={0.8}>
                    <IconFilter width={16} height={16} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setModalOptions(true)
                    }}
                    style={[styles.inputContainer, { height: 44, width: 44, alignItems: "center", justifyContent: "center" }]}
                    activeOpacity={0.8}>
                    <IconMoreVert width={24} height={24} />
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>Tổng cộng {notificationData.length}</Text>
                <Text style={{ width: 5.5, height: 5.5, borderRadius: 50, backgroundColor: "#A0AEC0" }}></Text>
                <GradientText text="230 mới" style={{ fontSize: 14, fontWeight: "600", marginTop: 2 }} colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} />
            </View>
            <FlatList data={notificationData} renderItem={renderItem} style={{ marginBottom: 12 }} showsVerticalScrollIndicator={false} />
        </ImageBackground>
    )
}

// Component cho màn hình chi tiết nhóm
const GroupDetailScreen = ({ route }: { route: any }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const groupName = route.params?.groupName || "No group name provided"
    const hasData = route.params?.hasData || false
    const { modalFiller, setModalFiller } = React.useContext(ModalContext)
    const { modalConnect, setModalConnect } = React.useContext(ModalContext)

    // Dữ liệu kết nối
    const connectData = [
        {
            id: 1,
            title: "Mất kết nối nâng cao",
            count: 12909,
            lastUpdate: "Gần nhất: 3 phút trước",
            icon: "IconMain",
            backgroundColor: "rgba(102, 182, 255, 0.13)"
        },
        {
            id: 2,
            title: "Mất kết nối cơ bản",
            count: 0,
            lastUpdate: "Gần nhất: 3 phút trước",
            icon: "IconCloud",
            backgroundColor: "rgba(92, 243, 79, 0.13)"
        },
        {
            id: 3,
            title: "Trạng thái TKQC",
            count: 12,
            lastUpdate: "Gần nhất: 3 phút trước",
            icon: "IconWatch",
            backgroundColor: "rgba(243, 210, 79, 0.13)"
        }
    ]

    // Hàm render icon dựa trên tên
    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case "IconMain":
                return <IconMain width={32} height={32} />
            case "IconCloud":
                return <IconCloud width={32} height={32} />
            case "IconWatch":
                return <IconWatch width={32} height={32} />
            default:
                return null
        }
    }

    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IconChevronLeft width={26} height={26} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 5 }}>{hasData ? groupName : "Nhóm"}</Text>
            </View>

            {hasData ? (
                <>
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                        <TouchableOpacity style={[styles.inputContainer, { flex: 1 }]} activeOpacity={0.8} onPress={() => {}}>
                            <IconSearch width={20} height={20} />
                            <TextInput style={styles.input} placeholder="Tìm kiếm thông báo.." />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setModalFiller(true)
                            }}
                            style={[styles.inputContainer, { height: 44, width: 44, alignItems: "center", justifyContent: "center" }]}
                            activeOpacity={0.8}>
                            <IconFilter width={16} height={16} />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 25 }}>Kết nối & đồng bộ tài sản</Text>

                    <ScrollView style={{ marginTop: 15, marginBottom: 10, marginRight: -10, paddingRight: 10, paddingTop: 5 }}>
                        {connectData.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.item_connect, index < connectData.length - 1 && { marginBottom: 10 }]}
                                onPress={() =>
                                    navigation.navigate("ConnectionDetail", {
                                        title: item.title,
                                        count: item.count,
                                        lastUpdate: item.lastUpdate,
                                        icon: item.icon
                                    })
                                }>
                                <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: item.backgroundColor, borderRadius: 12, height: 64, width: 64 }}>{renderIcon(item.icon)}</View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: "500", lineHeight: 20, color: "#718096" }}> {item.title}</Text>
                                        <Text style={{ marginTop: 2, fontSize: 18, fontWeight: "700", lineHeight: 20 }}> {item.count.toLocaleString()}</Text>
                                        <Text style={{ marginTop: 7, lineHeight: 20, fontSize: 13, fontWeight: "500", color: "#66ADFF" }}> {item.lastUpdate}</Text>
                                    </View>
                                    <IconChevronRight width={20} height={20} />
                                </View>

                                <View style={styles.cycle}></View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </>
            ) : (
                <View style={styles.noDataContainer}>
                    <Image source={require("../assets/notify/no_data.png")} />
                    <View style={{ marginTop: 15, maxWidth: 270 }}>
                        <Text style={styles.noDataText}>Nhóm này chưa liên kết với cấu hình nào</Text>
                        <Text style={{ fontSize: 15, fontWeight: "500", lineHeight: 20, color: "#718096", marginTop: 8, textAlign: "center" }}>Hãy truy cập vào SMIT Gate để cài đặt cấu hình nhận thông báo</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                setModalConnect(true)
                            }}
                            style={{ alignItems: "center", justifyContent: "center" }}>
                            <View>
                                <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.linearGradient, { marginTop: 40, alignSelf: "flex-start" }]}>
                                    <Text style={[styles.buttonText, { paddingHorizontal: 12 }]}>Điền mã liên kết</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ImageBackground>
    )
}

// Component cho màn hình danh sách nhóm
const NotifyListScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const usernameInputRef = React.useRef<TextInput>(null)
    const { modalAddGroup, setModalAddGroup } = React.useContext(ModalContext)
    const groupData = [
        { name: "Nhóm nhận thông báo A", data: true },
        { name: "Nhóm nhận thông báo B", data: false },
        { name: "Nhóm nhận thông báo C", data: true }
    ]

    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Danh sách nhóm</Text>
            <View style={{ flexDirection: "row", gap: 13, marginTop: 20 }}>
                <TouchableOpacity
                    style={[styles.inputContainer, { flex: 1 }]}
                    activeOpacity={0.8}
                    onPress={() => {
                        usernameInputRef.current?.focus()
                    }}>
                    <IconSearch width={20} height={20} />
                    <TextInput ref={usernameInputRef} style={styles.input} placeholder="Tài khoản..." />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        setModalAddGroup(true)
                    }}>
                    <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                        <Text style={[styles.buttonText, { paddingHorizontal: 10 }]}>Tạo group</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ marginTop: 23, marginBottom: 10 }}>
                {groupData.map((group, index) => (
                    <TouchableOpacity key={index} style={[styles.item_folder, index < groupData.length - 1 && { marginBottom: 15 }]} onPress={() => navigation.navigate("GroupDetail", { groupName: group.name, hasData: group.data })}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                            <IconFolder width={24} height={24} />
                            <Text style={{ fontSize: 15, fontWeight: "700" }}>{group.name}</Text>
                        </View>
                        <IconMoreVert width={24} height={24} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ImageBackground>
    )
}

// Component chính sử dụng Stack Navigator
function NotifyScreen() {
    // Khai báo state ở đây để chia sẻ giữa các màn hình
    const [modalFiller, setModalFiller] = React.useState(false)
    const [modalOptions, setModalOptions] = React.useState(false)
    const [modalAddGroup, setModalAddGroup] = React.useState(false)
    const [modalConnect, setModalConnect] = React.useState(false)

    return (
        <ModalContext.Provider value={{ modalFiller, setModalFiller, modalOptions, setModalOptions, modalAddGroup, setModalAddGroup, modalConnect, setModalConnect }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="NotifyList" component={NotifyListScreen} />
                <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
                <Stack.Screen name="ConnectionDetail" component={ConnectionDetailScreen} />
            </Stack.Navigator>

            {/* Modal được render ở đây để có thể hiển thị trên tất cả các màn hình */}
            <DevicesModaFiller visible={modalFiller} onClose={() => setModalFiller(false)} />
            <DevicesModalOptions visible={modalOptions} onClose={() => setModalOptions(false)} />
            <DevicesModalAddGroup visible={modalAddGroup} onClose={() => setModalAddGroup(false)} />
            <DevicesModalConnect visible={modalConnect} onClose={() => setModalConnect(false)} />
        </ModalContext.Provider>
    )
}

export default NotifyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70,
        paddingHorizontal: 25,
        resizeMode: "cover",
        backgroundColor: "#F5FAFF"
    },

    linearGradient: {
        height: 44,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center"
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
        borderColor: "#DCE3EA",
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        backgroundColor: "rgba(255, 255, 255, 0.56)"
    },

    input: {
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
        marginLeft: 8
    },

    item_folder: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
        backgroundColor: "#fff",
        borderColor: "#EBF4FF",
        minHeight: 60,
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1
    },

    backButtonText: {
        fontSize: 16,
        color: "#1A8CFF",
        fontWeight: "500"
    },

    item_connect: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        padding: 20,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderWidth: 1,
        borderColor: "rgba(204, 228, 255, 0.60)",
        shadowColor: "rgba(0, 0, 0, 0.07)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 1,
        position: "relative"
    },

    cycle: {
        backgroundColor: "#FF2D55",
        borderRadius: 50,
        width: 12,
        height: 12,
        borderWidth: 3,
        borderColor: "#C7E2FE",
        position: "absolute",
        top: -4,
        right: -4
    },

    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    noDataText: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center"
    },

    item_flastlist_container: {
        paddingTop: 12
    },

    item_flastlist: {
        flexDirection: "row"
    },

    dashedBorder: {
        borderStyle: "dashed",
        borderWidth: 0.5,
        borderColor: "#CCE4FF",
        marginTop: 12
    },

    notificationDotContainer: {
        width: 16,
        alignItems: "center",
        paddingTop: 8
    },

    notificationDot: {
        width: 5.5,
        height: 5.5,
        borderRadius: 50,
        backgroundColor: "#ED1723"
    },

    notificationContent: {
        flex: 1,
        paddingLeft: 8
    },

    notificationMessage: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2D3748",
        lineHeight: 20
    },

    notificationTime: {
        marginTop: 4,
        fontSize: 12,
        color: "#718096"
    },

    button: {
        borderRadius: 8,
        padding: 10
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
    button_options: {
        borderRadius: 16,
        height: 54,
        gap: 12
    }
})
