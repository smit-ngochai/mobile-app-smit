import * as React from "react"
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg"

const IconSearch = ({ focused, ...props }: { focused?: boolean } & any) => (
    <Svg width={18} height={19} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {focused ? (
            <>
                <Circle cx={8.25} cy={8.67334} r={5.25} stroke="url(#paint0_linear_search)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M12 13.1733L14.25 15.4233" stroke="url(#paint0_linear_search)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <Defs>
                    <LinearGradient id="paint0_linear_search" x1={8.25} y1={3.42334} x2={8.25} y2={15.4233} gradientUnits="userSpaceOnUse">
                        <Stop stopColor="#00C7DE" />
                        <Stop offset={0.55} stopColor="#1A8CFF" />
                        <Stop offset={1} stopColor="#0071F2" />
                    </LinearGradient>
                </Defs>
            </>
        ) : (
            <>
                <Circle cx={8.25} cy={8.67334} r={5.25} stroke="#1F2937" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M12 13.1733L14.25 15.4233" stroke="#1F2937" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </>
        )}
    </Svg>
)

export default IconSearch
