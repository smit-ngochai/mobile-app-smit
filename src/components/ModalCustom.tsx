import React, { useEffect, useRef, useState } from "react"
import { Modal, View, TouchableWithoutFeedback, Animated, StyleSheet, Platform, Dimensions, KeyboardAvoidingView } from "react-native"
import Orientation, { OrientationType } from "react-native-orientation-locker"

type AnimatedModalProps = {
    visible: boolean
    onClose: () => void
    children: React.ReactNode // giống Slot của vue
    animationType?: "slide" | "fade"
    height?: number
    duration?: number
    backgroundColor?: string
    borderRadius?: number
    useKeyboardAvoidingView?: boolean // Thêm thuộc tính này
    closeOnBackdropPress?: boolean
    padding?: number
    handleCloseRef?: React.MutableRefObject<(() => void) | null>
}

const AnimatedModal = ({ visible, onClose, children, animationType = "slide", height = 650, duration = 300, backgroundColor = "white", borderRadius = 20, useKeyboardAvoidingView = false, closeOnBackdropPress = true, padding = 20, handleCloseRef }: AnimatedModalProps) => {
    const slideAnim = useRef(new Animated.Value(height)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

    // Xử lý animation khi hiển thị
    useEffect(() => {
        if (visible) {
            // Reset animation values
            if (animationType === "slide") {
                slideAnim.setValue(height)
            } else {
                fadeAnim.setValue(0)
            }

            // Start animation
            Animated.timing(animationType === "slide" ? slideAnim : fadeAnim, {
                toValue: animationType === "slide" ? 0 : 1,
                duration: duration,
                useNativeDriver: true
            }).start()
        }
    }, [visible])

    // Xử lý đóng modal an toàn
    const handleClose = () => {
        Animated.timing(animationType === "slide" ? slideAnim : fadeAnim, {
            toValue: animationType === "slide" ? height : 0,
            duration: duration,
            useNativeDriver: true
        }).start(() => {
            // Khôi phục orientation ban đầu nếu cần
            if (Platform.OS === "ios" && Orientation) {
                // Đợi một chút trước khi đóng để đảm bảo animation hoàn thành
                setTimeout(() => {
                    onClose()
                }, 50)
            } else {
                onClose()
            }
        })
    }

    const handleBackdropPress = () => {
        if (closeOnBackdropPress) {
            handleClose()
        }
    }

    // Gán hàm handleClose vào ref nếu được cung cấp
    React.useEffect(() => {
        if (handleCloseRef) {
            handleCloseRef.current = handleClose
        }
    }, [handleCloseRef])

    const modalStyle = animationType === "slide" ? { transform: [{ translateY: slideAnim }] } : { opacity: fadeAnim }

    // Tính toán chiều cao modal dựa trên orientation

    return (
        <Modal transparent={true} visible={visible} onRequestClose={handleClose} animationType="none" supportedOrientations={["portrait", "landscape"]}>
            <View style={styles.centeredView} onTouchEnd={handleBackdropPress}>
                {useKeyboardAvoidingView ? (
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: "flex-end" }}>
                        <Animated.View
                            onStartShouldSetResponder={() => true}
                            onTouchEnd={e => e.stopPropagation()}
                            style={[
                                styles.modalView,
                                modalStyle,
                                {
                                    backgroundColor,
                                    borderTopLeftRadius: borderRadius,
                                    borderTopRightRadius: borderRadius,
                                    padding: padding
                                }
                            ]}>
                            {children}
                        </Animated.View>
                    </KeyboardAvoidingView>
                ) : (
                    <Animated.View
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={e => e.stopPropagation()}
                        style={[
                            styles.modalView,
                            modalStyle,
                            {
                                backgroundColor,
                                borderTopLeftRadius: borderRadius,
                                borderTopRightRadius: borderRadius,
                                padding: padding
                            }
                        ]}>
                        {children}
                    </Animated.View>
                )}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end"
    },
    modalView: {
        // padding: 20
    }
})

export default AnimatedModal
