import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

interface IconProfileProps {
    focused: boolean
    width: number
    height: number
}

const IconProfile: React.FC<IconProfileProps> = ({ focused, width, height }) => {
    const fillColor = focused ? "url(#paint0_linear)" : "#130F26" // Màu sắc động

    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
            <Path fillRule="evenodd" clipRule="evenodd" d="M14.4118 6.07584C14.4118 8.52336 12.4494 10.4859 10.0002 10.4859C7.55174 10.4859 5.58851 8.52336 5.58851 6.07584C5.58851 3.62831 7.55174 1.66663 10.0002 1.66663C12.4494 1.66663 14.4118 3.62831 14.4118 6.07584ZM10.0002 18.3333C6.38547 18.3333 3.3335 17.7458 3.3335 15.4791C3.3335 13.2116 6.40465 12.6449 10.0002 12.6449C13.6157 12.6449 16.6668 13.2324 16.6668 15.4991C16.6668 17.7666 13.5957 18.3333 10.0002 18.3333Z" fill={fillColor} />
            <Defs>
                <LinearGradient id="paint0_linear" x1={10} y1={1.66675} x2={10} y2={18.3334} gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#00C7DE" />
                    <Stop offset={0.55} stopColor="#1A8CFF" />
                    <Stop offset={1} stopColor="#0071F2" />
                </LinearGradient>
            </Defs>
        </Svg>
    )
}

export default IconProfile
