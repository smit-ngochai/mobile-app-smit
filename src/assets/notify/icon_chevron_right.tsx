import * as React from "react"
import Svg, { Mask, Rect, G, Path } from "react-native-svg"
const IconChevronRight = (props: any) => (
    <Svg width={21} height={21} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Mask
            id="mask0_11_956"
            style={{
                maskType: "alpha"
            }}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={21}
            height={21}>
            <Rect x={0.5} y={0.534424} width={20} height={20} fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0_11_956)">
            <Path d="M11 10.5344L7.74996 7.28442C7.42779 6.96226 7.42779 6.43992 7.74996 6.11776C8.07213 5.79559 8.59446 5.79559 8.91663 6.11776L12.6262 9.82732C13.0167 10.2178 13.0167 10.851 12.6262 11.2415L8.91662 14.9511C8.59446 15.2733 8.07213 15.2733 7.74996 14.9511C7.42779 14.6289 7.42779 14.1066 7.74996 13.7844L11 10.5344Z" fill="#718096" />
        </G>
    </Svg>
)
export default IconChevronRight
