import * as React from "react"
import Svg, { Mask, Rect, G, Path, Defs, LinearGradient, Stop } from "react-native-svg"

const IconFolder = (props: any) => {
    // Kiểm tra xem có màu được truyền vào không
    const useColor = props.color !== undefined

    return (
        <Svg width={24} height={25} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Mask
                id="mask0_56_547"
                style={{
                    maskType: "alpha"
                }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={24}
                height={25}>
                <Rect y={0.42334} width={24} height={24} fill="#D9D9D9" />
            </Mask>
            <G mask="url(#mask0_56_547)">
                <Path d="M4 20.4233C3.45 20.4233 2.97917 20.2275 2.5875 19.8358C2.19583 19.4442 2 18.9733 2 18.4233V6.42334C2 5.87334 2.19583 5.40251 2.5875 5.01084C2.97917 4.61917 3.45 4.42334 4 4.42334H10L12 6.42334H20C20.55 6.42334 21.0208 6.61917 21.4125 7.01084C21.8042 7.40251 22 7.87334 22 8.42334V18.4233C22 18.9733 21.8042 19.4442 21.4125 19.8358C21.0208 20.2275 20.55 20.4233 20 20.4233H4Z" fill={useColor ? props.color : "url(#paint0_linear_56_547)"} />
            </G>
            {!useColor && (
                <Defs>
                    <LinearGradient id="paint0_linear_56_547" x1={2} y1={4.42334} x2={17.6098} y2={23.9355} gradientUnits="userSpaceOnUse">
                        <Stop stopColor="#00C7DE" />
                        <Stop offset={0.549} stopColor="#1A8CFF" />
                        <Stop offset={1} stopColor="#0071F2" />
                    </LinearGradient>
                </Defs>
            )}
        </Svg>
    )
}

export default IconFolder
