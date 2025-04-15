import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface IconSmitProps {
  width?: number;
  height?: number;
  focused?: boolean;
  [key: string]: any;
}

const IconSmit = ({ focused = false, ...props }: IconSmitProps) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <Path
      d="M23.768 8.08117V13.8469C23.768 14.8719 22.679 15.4911 21.8034 14.9786L16.7852 12.0958L16.8065 8.7218L21.0133 6.2874C21.4831 6.07385 22.0383 6.07385 22.5081 6.22333C22.5295 6.22333 22.5722 6.24469 22.5936 6.26604C22.7644 6.33011 22.9139 6.43687 23.042 6.54365C23.4904 6.90667 23.768 7.46189 23.768 8.08117Z"
      fill={focused ? "url(#paint0_linear_2023_505)" : "#1F2937"}
    />
    <Path
      d="M17.4471 18.4166H17.4258V18.3953L17.4471 18.4166Z"
      fill="url(#paint1_linear_2023_505)"
    />
    <Path
      d="M23.1062 18.374L22.3802 17.9469L22.3161 17.9256L16.7639 14.7224L14.1587 16.2599C12.8561 17.0287 12.8561 18.9292 14.1801 19.698L16.7426 21.1501L14.9275 22.1965C14.3509 22.5381 13.6248 22.5381 13.0269 22.1965L11.2332 21.1501V23.2642C11.2332 23.8621 11.5108 24.4387 11.9806 24.823L12.066 24.8871L12.9202 25.3783C13.5608 25.7626 14.3723 25.7626 15.0129 25.3783L16.7853 24.3532L19.54 22.7517L23.0848 20.6803C23.3411 20.5308 23.5119 20.3386 23.6187 20.1037C23.939 19.5271 23.7468 18.7584 23.1062 18.374Z"
      fill={focused ? "url(#paint2_linear_2023_505)" : "#1F2937"}
    />
    <Path
      d="M17.4471 18.4166H17.4258V18.3953L17.4471 18.4166Z"
      fill="url(#paint3_linear_2023_505)"
    />
    <Path
      d="M22.5724 6.28747C22.5511 6.26611 22.5084 6.26611 22.487 6.24476C22.0172 6.09528 21.462 6.09528 20.9922 6.30882L16.7854 8.74322L16.7 8.78593L13.6677 10.537C12.1728 11.3912 11.2546 12.9928 11.2546 14.7225V23.2642C11.2546 23.8621 11.5322 24.4387 12.002 24.8231L12.0874 24.8872L11.2332 24.396L11.1905 24.3746L5.83058 21.2783C5.80923 21.2569 5.78787 21.2569 5.76652 21.2355C4.82693 20.659 4.229 19.634 4.229 18.5235V10.7719C4.229 8.97812 5.18995 7.31248 6.74882 6.4156L13.1124 2.78535C14.1161 2.20878 15.3333 2.18742 16.3583 2.69993C16.401 2.72128 16.4437 2.74264 16.5078 2.78535L16.6786 2.89212L16.7854 2.95618L22.5724 6.28747Z"
      fill={focused ? "url(#paint4_linear_2023_505)" : "#1F2937"}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_2023_505"
        x1={20.2766}
        y1={6.11816}
        x2={20.2766}
        y2={15.1622}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00C7DE" />
        <Stop offset={0.55} stopColor="#1A8CFF" />
        <Stop offset={1} stopColor="#0071F2" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_2023_505"
        x1={17.4421}
        y1={18.4198}
        x2={17.4319}
        y2={18.4123}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#0087FC" />
        <Stop offset={1} stopColor="#00CAE6" />
      </LinearGradient>
      <LinearGradient
        id="paint2_linear_2023_505"
        x1={17.502}
        y1={14.7224}
        x2={17.502}
        y2={25.6665}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00C7DE" />
        <Stop offset={0.55} stopColor="#1A8CFF" />
        <Stop offset={1} stopColor="#0071F2" />
      </LinearGradient>
      <LinearGradient
        id="paint3_linear_2023_505"
        x1={17.4453}
        y1={18.4289}
        x2={17.4321}
        y2={18.415}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#0073E6" />
        <Stop offset={0.2003} stopColor="#007DE5" />
        <Stop offset={0.5422} stopColor="#0098E3" />
        <Stop offset={0.9818} stopColor="#00C4E0" />
        <Stop offset={1} stopColor="#00C6E0" />
      </LinearGradient>
      <LinearGradient
        id="paint4_linear_2023_505"
        x1={13.4007}
        y1={2.33325}
        x2={13.4007}
        y2={24.8872}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00C7DE" />
        <Stop offset={0.55} stopColor="#1A8CFF" />
        <Stop offset={1} stopColor="#0071F2" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default IconSmit;
