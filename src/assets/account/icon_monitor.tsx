import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

const IconMonitor = ({ focused, ...props }: { focused?: boolean } & any) => {
    return (
        <Svg width={16} height={17} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                d="M13.98 7.44629V9.57296C13.98 11.1196 12.7266 12.373 11.18 12.373H8.80665C8.43998 12.373 8.13998 12.6663 8.13998 13.0396V13.5863C8.13998 13.953 8.43998 14.253 8.80665 14.253H10.3133C10.5733 14.253 10.7866 14.4596 10.7866 14.7263C10.7866 14.9863 10.5733 15.1996 10.3133 15.1996H5.01998C4.75998 15.1996 4.54665 14.9863 4.54665 14.7263C4.54665 14.4596 4.75998 14.253 5.01998 14.253H6.52665C6.89331 14.253 7.19331 13.953 7.19331 13.5863V13.0396C7.19331 12.6663 6.89331 12.373 6.52665 12.373H4.12665C2.58665 12.373 1.33331 11.1196 1.33331 9.57296V5.32629C1.33331 3.78629 2.58665 2.53296 4.12665 2.53296H6.99998C7.36665 2.53296 7.66665 2.83296 7.66665 3.19963V4.63296C7.66665 5.91963 8.52665 6.77963 9.80665 6.77963H13.3133C13.68 6.77963 13.98 7.07963 13.98 7.44629Z"
                fill={focused ? "url(#paint0_linear_focused)" : "url(#paint0_linear_default)"}
            />
            <Path d="M14.66 2.10628L13.9067 2.63295V2.35295C13.9067 1.71962 13.3934 1.21295 12.7667 1.21295H9.91335C9.22669 1.20628 8.66669 1.76628 8.66669 2.45295V4.63962C8.66669 5.21295 8.95335 5.77962 9.80669 5.77962H12.76C13.3934 5.77962 13.9 5.26628 13.9 4.63962V4.35295L14.6534 4.87962C15.0334 5.13962 15.3334 4.97962 15.3334 4.52628V2.45962C15.3334 2.00628 15.0334 1.85295 14.66 2.10628Z" fill={focused ? "url(#paint1_linear_focused)" : "url(#paint1_linear_default)"} />
            <Defs>
                {/* Default blue gradients */}
                <LinearGradient id="paint0_linear_default" x1={1.33331} y1={2.53296} x2={14} y2={15.1796} gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#00C7DE" />
                    <Stop offset={0.549} stopColor="#1A8CFF" />
                    <Stop offset={1} stopColor="#0071F2" />
                </LinearGradient>
                <LinearGradient id="paint1_linear_default" x1={8.66669} y1={1.21289} x2={12.925} y2={7.42935} gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#00C7DE" />
                    <Stop offset={0.549} stopColor="#1A8CFF" />
                    <Stop offset={1} stopColor="#0071F2" />
                </LinearGradient>

                {/* Focused green gradients */}
                <LinearGradient id="paint0_linear_focused" x1={1.33331} y1={2.53296} x2={14} y2={15.1796} gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#1ED760" />
                    <Stop offset={1} stopColor="#0E9940" />
                </LinearGradient>
                <LinearGradient id="paint1_linear_focused" x1={8.66669} y1={1.21289} x2={12.925} y2={7.42935} gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#1ED760" />
                    <Stop offset={1} stopColor="#0E9940" />
                </LinearGradient>
            </Defs>
        </Svg>
    )
}

export default IconMonitor
