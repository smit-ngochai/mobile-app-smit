import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const IconCloud = (props: any) => (
    <Svg width={32} height={33} viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path d="M25.5999 20.3881C24.4532 21.4414 22.9332 22.0281 21.3732 22.0147H8.49321C3.06655 21.6281 3.05321 13.7481 8.49321 13.3614H8.54655C4.82655 3.01474 20.5465 -1.10526 22.3465 9.74807C27.3732 10.3881 29.4132 17.0681 25.5999 20.3881Z" fill="url(#paint0_linear_11_1025)" />
        <Path
            d="M25 28.6814C25 29.2281 24.5467 29.6814 24 29.6814H18.6667C18.6 29.6814 18.5467 29.6814 18.48 29.6548C18.0933 30.6414 17.12 31.3481 16 31.3481C14.88 31.3481 13.9067 30.6414 13.52 29.6548C13.4533 29.6814 13.4 29.6814 13.3333 29.6814H8C7.45333 29.6814 7 29.2281 7 28.6814C7 28.1348 7.45333 27.6814 8 27.6814H13.3333C13.4 27.6814 13.4533 27.6814 13.52 27.7081C13.7867 27.0148 14.3333 26.4681 15.0267 26.2014C15 26.1348 15 26.0814 15 26.0148V22.0148H17V26.0148C17 26.0814 17 26.1348 16.9733 26.2014C17.6667 26.4681 18.2133 27.0148 18.48 27.7081C18.5467 27.6814 18.6 27.6814 18.6667 27.6814H24C24.5467 27.6814 25 28.1348 25 28.6814Z"
            fill="url(#paint1_linear_11_1025)"
        />
        <Defs>
            <LinearGradient id="paint0_linear_11_1025" x1={6.98732} y1={-1.56669} x2={13.037} y2={30.5874} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#17E180" />
                <Stop offset={1} stopColor="#009883" />
            </LinearGradient>
            <LinearGradient id="paint1_linear_11_1025" x1={8.99688} y1={19.5584} x2={10.9821} y2={35.9627} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#17E180" />
                <Stop offset={1} stopColor="#009883" />
            </LinearGradient>
        </Defs>
    </Svg>
)
export default IconCloud
