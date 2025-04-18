import * as React from "react"
import Svg, { Rect, Mask, G, Path, Defs, LinearGradient, Stop } from "react-native-svg"
const Icon2Fa = (props: any) => (
    <Svg width={76} height={76} viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Rect width={76} height={76} rx={20} fill="url(#paint0_linear_487_563)" />
        <Mask
            id="mask0_487_563"
            style={{
                maskType: "alpha"
            }}
            maskUnits="userSpaceOnUse"
            x={14}
            y={14}
            width={48}
            height={48}>
            <Rect x={14} y={14} width={48} height={48} fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0_487_563)">
            <Path
                d="M28 44C26.3333 44 24.9167 43.4167 23.75 42.25C22.5833 41.0833 22 39.6667 22 38C22 36.3333 22.5833 34.9167 23.75 33.75C24.9167 32.5833 26.3333 32 28 32C29.6667 32 31.0833 32.5833 32.25 33.75C33.4167 34.9167 34 36.3333 34 38C34 39.6667 33.4167 41.0833 32.25 42.25C31.0833 43.4167 29.6667 44 28 44ZM28 50C30.5667 50 32.8833 49.2667 34.95 47.8C37.0167 46.3333 38.4667 44.4 39.3 42H40L42.6 44.6C42.8 44.8 43.0167 44.9417 43.25 45.025C43.4833 45.1083 43.7333 45.15 44 45.15C44.2667 45.15 44.5167 45.1083 44.75 45.025C44.9833 44.9417 45.2 44.8 45.4 44.6L48 42L51.5 44.75C51.7 44.9167 51.925 45.0417 52.175 45.125C52.425 45.2083 52.6833 45.2333 52.95 45.2C53.2167 45.1667 53.4583 45.0917 53.675 44.975C53.8917 44.8583 54.0833 44.7 54.25 44.5L58.75 39.35C58.9167 39.15 59.0417 38.9333 59.125 38.7C59.2083 38.4667 59.25 38.2167 59.25 37.95C59.25 37.6833 59.2 37.4417 59.1 37.225C59 37.0083 58.8667 36.8167 58.7 36.65L56.65 34.6C56.45 34.4 56.225 34.25 55.975 34.15C55.725 34.05 55.4667 34 55.2 34H39.3C38.5 31.7333 37.0917 29.8333 35.075 28.3C33.0583 26.7667 30.7 26 28 26C24.6667 26 21.8333 27.1667 19.5 29.5C17.1667 31.8333 16 34.6667 16 38C16 41.3333 17.1667 44.1667 19.5 46.5C21.8333 48.8333 24.6667 50 28 50Z"
                fill="white"
            />
        </G>
        <Defs>
            <LinearGradient id="paint0_linear_487_563" x1={0} y1={0} x2={76} y2={76} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#00C7DE" />
                <Stop offset={0.549} stopColor="#1A8CFF" />
                <Stop offset={1} stopColor="#0071F2" />
            </LinearGradient>
        </Defs>
    </Svg>
)
export default Icon2Fa
