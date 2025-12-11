import * as React from "react"
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, ScrollView, Image, FlatList, Modal, TouchableWithoutFeedback, Pressable, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { createStackNavigator } from "@react-navigation/stack"
import { IconSearch, IconFolder, IconMoreVert, IconChevronLeft, IconFilter, IconMain, IconChevronRight, IconCloud, IconWatch, IconSend, IconDelete, IconVerify, IconCode } from "../assets"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import GradientText from "../components/GradientText"
import CustomRadio from "../components/CustomRadio"
import ModalCustom from "../components/ModalCustom"
import { useNotification } from "../components/NotificationProvider"
import { useToast } from "../components/UseToast"
import api from "../globall/globall"

const toast = useToast()

type RootStackParamList = {
    NotifyList: undefined
    GroupDetail: { group: any }
    ConnectionDetail: { title: string; detail_group: any; option_id: string }
}

// Tạo Context để quản lý trạng thái modal
const ModalContext = React.createContext<{
    modal_filler: boolean
    setModalFiller: React.Dispatch<React.SetStateAction<boolean>>
    modal_options: boolean
    setModalOptions: React.Dispatch<React.SetStateAction<boolean>>
    modal_add_group: boolean
    setModalAddGroup: React.Dispatch<React.SetStateAction<boolean>>
    group_data?: any[]
    setGroupData?: React.Dispatch<React.SetStateAction<any[]>>
}>({
    modal_filler: false,
    setModalFiller: () => {},
    modal_options: false,
    setModalOptions: () => {},
    modal_add_group: false,
    setModalAddGroup: () => {}
})

declare global {
    var device_token: string | null
}
global.device_token = null

const formatTimeAgo = (dateString: string) => {
    try {
        const now = new Date()
        const past = new Date(dateString)
        if (isNaN(past.getTime())) return "Không xác định"

        const diffInMs = now.getTime() - past.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`
        } else if (diffInHours < 24) {
            return `${diffInHours} giờ trước`
        } else {
            return `${diffInDays} ngày trước`
        }
    } catch (error) {
        return "Không xác định"
    }
}

const Stack = createStackNavigator<RootStackParamList>()

// Modal filler
const DevicesModaFiller = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [selected_filter, setSelectedFilter] = React.useState("all")

    return (
        <ModalCustom visible={visible} onClose={onClose} height={200}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <IconFilter />

                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Bộ lọc hiển thị thông báo</Text>
            </View>

            <Pressable onPress={() => setSelectedFilter("all")} style={[styles.button, styles.buttonSearch, { marginBottom: 10, borderRadius: 16 }, selected_filter === "all" && { borderColor: "#1A8CFF" }]}>
                <CustomRadio selected={selected_filter === "all"} label="Toàn bộ thông báo" color="#1A8CFF" />
            </Pressable>

            <Pressable onPress={() => setSelectedFilter("unread")} style={[styles.button, styles.buttonSearch, { marginBottom: 10, borderRadius: 16 }, selected_filter === "unread" && { borderColor: "#1A8CFF" }]}>
                <CustomRadio selected={selected_filter === "unread"} label="Hiển thị thông báo chưa đọc" color="#1A8CFF" />
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
const DevicesModalAddGroup = ({ visible, onClose, onAddGroup }: { visible: boolean; onClose: () => void; onAddGroup: (group: { gr_name: string; config_id: null; platform_id: null; id: string }) => void }) => {
    const input_ref_add_group = React.useRef<TextInput>(null)
    const [group_name_focused, setGroupNameFocused] = React.useState(false)
    const [group_name, setGroupName] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    // Hàm thêm nhóm mới
    const handleAddGroup = async () => {
        if (group_name.trim() === "") {
            Alert.alert("Nhập tên nhóm bạn muốn tạo")
            return
        }
        setLoading(true)
        const res = (await api({
            url: `/gate/me/noti/groups`,
            method: "POST",
            data: {
                group_name
            }
        })) as any
        setLoading(false)
        if (res.success) {
            // Gọi callback để thêm nhóm mới
            onAddGroup({ gr_name: group_name, config_id: null, platform_id: null, id: res.id })

            // Reset form và đóng modal
            setGroupName("")
            onClose()
            toast.showSuccess("Thêm nhóm thành công")
        } else {
            toast.showError(res.message || "Lỗi")
            return
        }
    }

    // Reset form khi modal đóng
    React.useEffect(() => {
        if (!visible) {
            setGroupName("")
        }
    }, [visible])

    return (
        <ModalCustom visible={visible} onClose={onClose} height={200} useKeyboardAvoidingView={true}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <IconFolder width={20} height={20} color="black" />
                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Tạo nhóm mới</Text>
            </View>
            <Pressable
                style={[
                    styles.inputContainer,
                    {
                        borderWidth: 1,
                        marginBottom: 20,
                        height: 45,
                        borderColor: group_name_focused ? "#1A8CFF" : "#CCE4FF"
                    }
                ]}
                onPress={() => {
                    input_ref_add_group.current?.focus()
                    setGroupNameFocused(true)
                }}>
                <TextInput ref={input_ref_add_group} style={styles.input} placeholder="Điền tên nhóm..." onFocus={() => setGroupNameFocused(true)} onBlur={() => setGroupNameFocused(false)} value={group_name} onChangeText={setGroupName} />
            </Pressable>
            <TouchableOpacity activeOpacity={0.7} onPress={handleAddGroup} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.linearGradient, { height: 40 }]}>
                    <Text style={[styles.buttonText, { borderRadius: 10 }]}>Xác nhận</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ModalCustom>
    )
}

// Modal Điền mã liên kết
const DevicesModalConnect = ({ visible, onClose, detail_group, onSuccess }: { visible: boolean; onClose: () => void; detail_group: any; onSuccess: () => void }) => {
    const input_ref = React.useRef<TextInput>(null)
    const [code_focused, setCodeFocused] = React.useState(false)
    const [code, setCode] = React.useState("")
    const { group_data, setGroupData } = React.useContext(ModalContext)

    const handleConfirm = async () => {
        const res = (await api({
            url: `/gate/me/noti/connect`,
            method: "POST",
            data: {
                group_id: detail_group.id,
                code: code,
                // device_token: global.device_token
                device_token: "d8KZdfSfGUQKtxmsxNHVdt:APA91bHFK2J1tC3g3GSi0u_1H43T6IUHUVBx6GJYpIOPQ4he8iHD-A23L4krchYLzlXFy1gWFHb1jVVoePN5pX9NdnAdfzj9bVExy5DKZyuyLsod7JKdGVA"
            }
        })) as any
        if (res.success) {
            // Cập nhật trực tiếp vào detail_group
            detail_group.config_id = res.config_id
            detail_group.platform_id = res.platform_id

            if (setGroupData && group_data) {
                const updatedGroups = group_data.map(group => {
                    // Kiểm tra nếu group có id trùng với detail_group.id
                    if (group.id === detail_group.id) {
                        // Cập nhật config_id và platform_id
                        return {
                            ...group,
                            config_id: res.config_id,
                            platform_id: res.platform_id
                        }
                    }
                    return group
                })

                // Cập nhật state với mảng đã được cập nhật
                setGroupData(updatedGroups)
            }

            onSuccess()
            onClose()
            setCode("")
            toast.showSuccess("Liên kết thành công")
        } else {
            toast.showError(res.message || "Lỗi")
        }
    }

    return (
        <ModalCustom visible={visible} onClose={onClose} height={200} useKeyboardAvoidingView={true}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <IconCode width={24} height={24} />
                <Text style={[{ fontWeight: "500", fontSize: 15 }]}>Nhập mã nhận cấu hình</Text>
            </View>
            <Pressable
                style={[styles.inputContainer, { borderWidth: 1, marginBottom: 20, height: 45, borderColor: code_focused ? "#1A8CFF" : "#CCE4FF" }]}
                onPress={() => {
                    input_ref.current?.focus()
                    setCodeFocused(true)
                }}>
                <TextInput ref={input_ref} style={styles.input} placeholder="Điền mã tại đây..." onFocus={() => setCodeFocused(true)} onBlur={() => setCodeFocused(false)} value={code} onChangeText={setCode} />
            </Pressable>
            <TouchableOpacity activeOpacity={0.7} onPress={handleConfirm}>
                <LinearGradient colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.linearGradient, { height: 40 }]}>
                    <Text style={[styles.buttonText, { borderRadius: 10 }]}>Xác nhận</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ModalCustom>
    )
}

// Component cho màn hình danh sách thông báo
const ConnectionDetailScreen = ({ route }: { route: any }) => {
    interface type_flatlist {
        id: number
        is_read: boolean | null
        message: string
        created_at: string
    }
    const navigation = useNavigation()
    const { title, detail_group, option_id } = route.params || {}
    const { modal_filler, setModalFiller } = React.useContext(ModalContext)
    const { modal_options, setModalOptions } = React.useContext(ModalContext)
    const [search_focused, setSearchFocused] = React.useState(false)
    const search_name_id = React.useRef<TextInput>(null)
    const [search_text, setSearchText] = React.useState("")
    const [new_notifications, setNewNotifications] = React.useState(0)
    const [notification_data, setNotificationData] = React.useState<type_flatlist[]>([])

    const listNotification = async () => {
        const res = (await api({
            url: `/gate/me/noti/list`,
            method: "GET",
            params: {
                platform_id: detail_group.platform_id,
                option_id: option_id,
                page: 1,
                limit: 50
            }
        })) as any
        if (res.success) {
            console.log(res)

            setNotificationData(res.data)
            setNewNotifications(res.count_unread)
        } else {
            toast.showError(res.message || "Lỗi")
        }
    }

    React.useEffect(() => {
        listNotification()
    }, [])

    // Tính toán danh sách đã lọc trực tiếp từ searchText và notificationData
    const filtered_notifications = React.useMemo(() => {
        if (!search_text.trim()) {
            return notification_data
        }

        const search_lower = search_text.toLowerCase()

        return notification_data.filter(item => {
            // Tìm trong message
            const message_matches = item.message.toLowerCase().includes(search_lower)

            // Tìm trong ID - đảm bảo chuyển thành string
            const id_string = String(item.id)
            const id_matches = id_string.includes(search_lower)

            return message_matches || id_matches
        })
    }, [notification_data, search_text])

    // Hàm xử lý tìm kiếm
    const handleSearch = (text: string) => {
        setSearchText(text)
    }

    const stripHtmlTags = (html: string) => {
        return html.replace(/<\/?[^>]+(>|$)/g, "")
    }

    // Hàm render item cho FlatList
    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={styles.item_flastlist_container}>
            <View style={styles.item_flastlist}>
                <View style={styles.notificationDotContainer}>
                    <View style={styles.notificationDot}></View>
                </View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationMessage}>{stripHtmlTags(item.message)}</Text>
                    <Text style={styles.notificationTime}>{formatTimeAgo(item.created_at)}</Text>
                </View>
            </View>
            {index < filtered_notifications.length - 1 && <View style={styles.dashedBorder} />}
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
                <TouchableOpacity
                    style={[
                        styles.inputContainer,
                        {
                            flex: 1,
                            borderColor: search_focused ? "#1A8CFF" : "#DCE3EA"
                        }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                        search_name_id.current?.focus()
                        setSearchFocused(true)
                    }}>
                    <IconSearch width={20} height={20} focused={search_focused} />
                    <TextInput ref={search_name_id} style={styles.input} placeholder="Tìm kiếm tên hoặc ID .." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} value={search_text} onChangeText={handleSearch} />
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
                <Text style={{ fontSize: 14, fontWeight: "600" }}>Tổng cộng {filtered_notifications.length}</Text>
                <Text style={{ width: 5.5, height: 5.5, borderRadius: 50, backgroundColor: "#A0AEC0" }}></Text>
                <GradientText text={`${new_notifications} mới`} style={{ fontSize: 14, fontWeight: "600", marginTop: 2 }} colors={["#00C7DE", "#1A8CFF", "#0071F2"]} locations={[0, 0.549, 1]} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} />
            </View>

            <FlatList
                data={filtered_notifications}
                renderItem={renderItem}
                style={{ marginBottom: 12 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: "center", padding: 20 }}>
                        <Text style={{ fontSize: 16, color: "#718096" }}>Không tìm thấy thông báo phù hợp</Text>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />
        </ImageBackground>
    )
}

// Component cho màn hình chi tiết nhóm
const GroupDetailScreen = ({ route }: { route: any }) => {
    interface NotificationItem {
        option_id: string
        type: {
            key: string
            name: {
                vi: string
                en: string
            }
        }
        count: string
        last_time: string
        noti: boolean
    }
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [detail_group, setDetailGroup] = React.useState(route.params?.group || {})
    const [modal_connect, setModalConnect] = React.useState(false)
    const [search_text, setSearchText] = React.useState("")
    const { modal_filler, setModalFiller } = React.useContext(ModalContext)
    const [search_focused, setSearchFocused] = React.useState(false)
    const search_name_id = React.useRef<TextInput>(null)

    // Dữ liệu kết nối
    const [connect_data, setConnectData] = React.useState<NotificationItem[]>([])

    React.useEffect(() => {
        // Chỉ gọi API khi detail_group có config_id
        if (detail_group.config_id) {
            detailGroup()
        }
    }, [detail_group.id])

    const getIconByType = (typeKey: string) => {
        switch (typeKey) {
            case "via-basic-connect-error":
                return <IconMain width={32} height={32} />
            case "stt-adaccount":
                return <IconCloud width={32} height={32} />
            default:
                return <IconWatch width={32} height={32} />
        }
    }

    const detailGroup = async () => {
        const res = await api({
            url: `/gate/me/noti/group/detail`,
            method: "GET",
            params: {
                group_id: detail_group.id
            }
        })
        if (res.success) {
            setConnectData(res.data)
            setModalConnect(false)
        } else {
            toast.showError(res.message || "Lỗi")
        }
    }

    const getBackgroundColor = (typeKey: string) => {
        switch (typeKey) {
            case "via-basic-connect-error":
                return "rgba(102, 182, 255, 0.13)" // Màu cho IconMain
            case "stt-adaccount":
                return "rgba(92, 243, 79, 0.13)" // Màu cho IconCloud
            default:
                return "rgba(243, 210, 79, 0.13)" // Màu cho IconWatch
        }
    }

    const filtered_connect_data = React.useMemo(() => {
        if (!search_text.trim()) {
            return connect_data
        }

        const search_lower = search_text.toLowerCase()

        return connect_data.filter(item => {
            // Tìm kiếm trong type?.name?.vi
            const name_vi = item.type?.name?.vi || ""
            return name_vi.toLowerCase().includes(search_lower)
        })
    }, [connect_data, search_text])

    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IconChevronLeft width={26} height={26} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 5 }}>{detail_group.gr_name}</Text>
            </View>

            {detail_group.config_id ? (
                <>
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                        <TouchableOpacity
                            style={[styles.inputContainer, { flex: 1 }]}
                            activeOpacity={0.8}
                            onPress={() => {
                                setSearchFocused(true)
                            }}>
                            <IconSearch width={20} height={20} focused={search_focused} />
                            <TextInput ref={search_name_id} style={styles.input} placeholder="Tìm kiếm thông báo.." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} onChangeText={setSearchText} />
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
                        {filtered_connect_data.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.item_connect, index < connect_data.length - 1 && { marginBottom: 10 }]}
                                onPress={() =>
                                    navigation.navigate("ConnectionDetail", {
                                        title: item.type?.name?.vi || "Không có tiêu đề",
                                        detail_group: detail_group,
                                        option_id: item.option_id
                                    })
                                }>
                                <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: getBackgroundColor(item.type?.key || ""), borderRadius: 12, height: 64, width: 64 }}>{getIconByType(item.type?.key || "")}</View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: "500", lineHeight: 20, color: "#718096" }}> {item.type?.name?.vi || "Không có tiêu đề"}</Text>
                                        <Text style={{ marginTop: 2, fontSize: 18, fontWeight: "700", lineHeight: 20 }}> {parseInt(item.count || "0").toLocaleString()}</Text>
                                        <Text style={{ marginTop: 7, lineHeight: 20, fontSize: 13, fontWeight: "500", color: "#66ADFF" }}> Gần nhất: {formatTimeAgo(item.last_time || "")}</Text>
                                    </View>
                                    <IconChevronRight width={20} height={20} />
                                </View>

                                {item.noti && <View style={styles.cycle}></View>}
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

            <DevicesModalConnect visible={modal_connect} onClose={() => setModalConnect(false)} detail_group={detail_group} onSuccess={detailGroup} />
        </ImageBackground>
    )
}

// Component cho màn hình danh sách nhóm
const NotifyListScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const username_input_ref = React.useRef<TextInput>(null)

    const { modal_add_group, setModalAddGroup, group_data, setGroupData } = React.useContext(ModalContext)
    const [search_focused, setSearchFocused] = React.useState(false)
    const [search_text, setSearchText] = React.useState("")
    const [filtered_group_data, setFilteredGroupData] = React.useState<any[]>([])
    const { resetBadge } = useNotification()

    // Cập nhật filteredGroupData khi groupData thay đổi
    React.useEffect(() => {
        if (!group_data) return

        if (search_text.trim() === "") {
            setFilteredGroupData(group_data) // group_data có thể là undefined
        } else {
            const filtered = group_data?.filter(group => group.gr_name.toLowerCase().includes(search_text.toLowerCase()))
            setFilteredGroupData(filtered) // filtered có thể là undefined
        }
    }, [group_data, search_text])

    const handleAddGroup = (newGroup: { gr_name: string; config_id: null; platform_id: null; id: string }) => {
        if (setGroupData && group_data) {
            setGroupData([newGroup, ...group_data])
        }
    }

    const handleSearch = (text: string) => {
        setSearchText(text)
        if (!group_data) return // Kiểm tra group_data tồn tại

        if (text.trim() === "") {
            setFilteredGroupData(group_data)
        } else {
            const filtered = group_data.filter(group => group.gr_name.toLowerCase().includes(text.toLowerCase()))
            setFilteredGroupData(filtered)
        }
    }

    const handleResetBadge = async () => {
        toast.showCustommm("Đây là custom toast màu hồng!", {
            title: "Custom Pink Toast",
            duration: 4000
        })
        return
        // await resetBadge()
    }

    return (
        <ImageBackground source={require("../assets/bgr2.png")} style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Danh sách nhóm</Text>
            <View style={{ flexDirection: "row", gap: 13, marginTop: 20 }}>
                <TouchableOpacity
                    style={[
                        styles.inputContainer,
                        {
                            flex: 1,
                            borderColor: search_focused ? "#1A8CFF" : "#DCE3EA"
                        }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                        username_input_ref.current?.focus()
                        setSearchFocused(true)
                    }}>
                    <IconSearch focused={search_focused} />
                    <TextInput ref={username_input_ref} style={styles.input} placeholder="Tìm kiếm nhóm..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} value={search_text} onChangeText={handleSearch} />
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
                <Pressable onPress={handleResetBadge}>
                    <Text style={[{ fontWeight: "500", fontSize: 15, color: "#ED1723" }]}>Tắt thông báo</Text>
                </Pressable>
            </View>
            <ScrollView style={{ marginTop: 23, marginBottom: 10 }}>
                {filtered_group_data.length > 0 ? (
                    filtered_group_data.map((group, index) => (
                        <TouchableOpacity key={index} style={[styles.item_folder, index < filtered_group_data.length - 1 && { marginBottom: 15 }]} onPress={() => navigation.navigate("GroupDetail", { group })}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                                <IconFolder width={24} height={24} />
                                <Text style={{ fontSize: 15, fontWeight: "700" }}>{group.gr_name}</Text>
                            </View>
                            <IconMoreVert width={24} height={24} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
                        <Text style={{ fontSize: 16, color: "#718096" }}>Không tìm thấy nhóm nào</Text>
                    </View>
                )}
            </ScrollView>
            <DevicesModalAddGroup visible={modal_add_group} onClose={() => setModalAddGroup(false)} onAddGroup={handleAddGroup} />
        </ImageBackground>
    )
}

// Component chính sử dụng Stack Navigator
function NotifyScreen() {
    // Khai báo state ở đây để chia sẻ giữa các màn hình
    const [modal_filler, setModalFiller] = React.useState(false)
    const [modal_options, setModalOptions] = React.useState(false)
    const [modal_add_group, setModalAddGroup] = React.useState(false)
    const [group_data, setGroupData] = React.useState<any[]>([])

    React.useEffect(() => {
        const getGroup = async () => {
            const res = await api({
                url: `/gate/me/noti/groups`,
                method: "GET",
                params: {
                    search: null
                }
            })
            if (res.error) {
                toast.showError(res.message || "Lỗi")
                return
            }

            setGroupData(res.data)
        }

        getGroup()
    }, [])

    return (
        <ModalContext.Provider
            value={{
                modal_filler,
                setModalFiller,
                modal_options,
                setModalOptions,
                modal_add_group,
                setModalAddGroup,
                group_data,
                setGroupData
            }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="NotifyList" component={NotifyListScreen} />
                <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
                <Stack.Screen name="ConnectionDetail" component={ConnectionDetailScreen} />
            </Stack.Navigator>
            {/* Modal được render ở đây để có thể hiển thị trên tất cả các màn hình */}
            <DevicesModaFiller visible={modal_filler} onClose={() => setModalFiller(false)} />
            <DevicesModalOptions visible={modal_options} onClose={() => setModalOptions(false)} />
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
