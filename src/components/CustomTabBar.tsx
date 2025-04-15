import React, { useRef, useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from "react-native"

interface CustomTabBarProps {
    state: any
    descriptors: any
    navigation: any
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { width } = Dimensions.get("window")
    const tabWidth = width / state.routes.length
    const sliderWidth = width / state.routes.length // Width chia đều theo số lượng tab (25% cho 4 tab)
    const sliderPosition = useRef(new Animated.Value(0)).current

    useEffect(() => {
        // Tính toán vị trí của slider dựa trên tab đang active
        const activeTabIndex = state.index
        const targetPosition = activeTabIndex * tabWidth

        // Animation cho slider - thay đổi từ spring sang timing để tránh hiệu ứng trượt quá
        Animated.timing(sliderPosition, {
            toValue: targetPosition,
            useNativeDriver: true,
            duration: 250,
            easing: Easing.out(Easing.cubic)
        }).start()
    }, [state.index, sliderPosition, tabWidth])

    return (
        <View style={[styles.tabBarContainer, { backgroundColor: "#F5FAFF" }]}>
            {/* Thanh slider */}
            <Animated.View
                style={[
                    styles.slider,
                    {
                        width: sliderWidth,
                        transform: [{ translateX: sliderPosition }]
                    }
                ]}
            />

            {/* Các tab */}
            <View style={styles.tabsContainer}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key]
                    const label = options.tabBarLabel || options.title || route.name
                    const isFocused = state.index === index

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true
                        })

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name)
                        }
                    }

                    return (
                        <View key={index} style={[styles.tabItem, { width: tabWidth }]}>
                            <View style={styles.tabContent}>
                                {options.tabBarIcon &&
                                    options.tabBarIcon({
                                        focused: isFocused,
                                        color: isFocused ? "#007CFA" : "gray",
                                        size: 24,
                                        route
                                    })}
                                <Text style={[styles.tabLabel, { color: isFocused ? "#007CFA" : "gray" }]}>{label}</Text>
                            </View>
                            <View style={styles.tabTouchable} onTouchEnd={onPress} />
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "column",
        height: 90, // Tăng chiều cao từ 70 lên 80
        borderTopWidth: 1,
        borderTopColor: "#E5E5E5",
        position: "relative"
    },
    tabsContainer: {
        flexDirection: "row",
        height: "100%"
    },
    tabItem: {
        height: "100%",
        position: "relative"
    },
    tabContent: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%"
    },
    tabTouchable: {
        ...StyleSheet.absoluteFillObject
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: "700",
        marginTop: 6
    },
    slider: {
        height: 2,
        backgroundColor: "#007CFA",
        position: "absolute",
        top: -1,
        borderRadius: 3,
        elevation: 1 // Thêm đổ bóng nhẹ cho slider
    }
})

export default CustomTabBar
