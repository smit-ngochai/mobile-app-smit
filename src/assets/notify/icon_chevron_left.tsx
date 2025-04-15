import * as React from "react"
import Svg, { Mask, Rect, G, Path } from "react-native-svg"
const IconChevronLeft = (props: any) => (
    <Svg width={27} height={27} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Mask
            id="mask0_56_719"
            style={{
                maskType: "alpha"
            }}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={27}
            height={27}>
            <Rect width={26} height={26} transform="matrix(-1 0 0 1 26.5 0.949463)" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0_56_719)">
            <Path d="M12.8499 13.9495L17.0749 9.72446C17.4937 9.30565 17.4937 8.62661 17.0749 8.2078C16.6561 7.78898 15.9771 7.78898 15.5583 8.2078L10.5237 13.2424C10.1332 13.6329 10.1332 14.266 10.5237 14.6566L15.5583 19.6911C15.9771 20.1099 16.6561 20.1099 17.0749 19.6911C17.4937 19.2723 17.4937 18.5933 17.0749 18.1745L12.8499 13.9495Z" fill="#1F2937" />
        </G>
    </Svg>
)
export default IconChevronLeft
