import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface IconLockProps {
  width?: number;
  height?: number;
  focused?: boolean;
  [key: string]: any;
}

const IconLock: React.FC<IconLockProps> = ({ focused = false, ...props }) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.6023 6.16342V7.4412C16.0376 7.88921 17.0834 9.18853 17.0834 10.7404V14.8545C17.0834 16.7757 15.4906 18.3334 13.5269 18.3334H6.47408C4.50955 18.3334 2.91675 16.7757 2.91675 14.8545V10.7404C2.91675 9.18853 3.96337 7.88921 5.39782 7.4412V6.16342C5.40629 3.67907 7.46397 1.66675 9.98738 1.66675C12.5447 1.66675 14.6023 3.67907 14.6023 6.16342ZM10.0043 3.11595C11.7233 3.11595 13.1205 4.48234 13.1205 6.16342V7.2615H6.87969V6.14686C6.88816 4.47406 8.28535 3.11595 10.0043 3.11595ZM10.741 13.7125C10.741 14.1183 10.4108 14.4413 9.99585 14.4413C9.58939 14.4413 9.25915 14.1183 9.25915 13.7125V11.8741C9.25915 11.4766 9.58939 11.1536 9.99585 11.1536C10.4108 11.1536 10.741 11.4766 10.741 11.8741V13.7125Z"
      fill={focused ? "url(#paint0_linear_2026_517)" : "#130F26"}
    />
    {focused && (
      <Defs>
        <LinearGradient
          id="paint0_linear_2026_517"
          x1={10.0001}
          y1={1.66675}
          x2={10.0001}
          y2={18.3334}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#00C7DE" />
          <Stop offset={0.55} stopColor="#1A8CFF" />
          <Stop offset={1} stopColor="#0071F2" />
        </LinearGradient>
      </Defs>
    )}
  </Svg>
);

export default IconLock;
