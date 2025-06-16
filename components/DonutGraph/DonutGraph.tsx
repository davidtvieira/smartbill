import { theme } from "@/theme/theme";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import styles from "./styleDonutGraph";

interface DonutGraphProps {
  totalSpent: number;
  size: number;
  content: Array<{
    total_spent: number;
  }>;
}

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${x} ${y}`,
    "Z",
  ].join(" ");

  return d;
};

const DonutGraph = ({ totalSpent, size, content }: DonutGraphProps) => {
  const generateColor = (
    index: number,
    baseColor: string = theme.colors.primary
  ): string => {
    const hex = baseColor.replace("#", "");
    const factor = 1 - index * 0.035;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const clamp = (val: number) => Math.max(0, Math.min(255, val));

    const rDark = clamp(r * factor);
    const gDark = clamp(g * factor);
    const bDark = clamp(b * factor);

    const toHex = (x: number) => Math.round(x).toString(16).padStart(2, "0");

    return `#${toHex(rDark)}${toHex(gDark)}${toHex(bDark)}`;
  };

  const radius = size / 2;
  const innerRadius = radius * 0.6;

  const total = content.reduce((acc, cur) => acc + cur.total_spent, 0);

  let startAngle = 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation={0} origin={`${radius}, ${radius}`}>
            {content.length === 1 ? (
              <Circle
                cx={radius}
                cy={radius}
                r={radius}
                fill={generateColor(0)}
              />
            ) : content.length > 1 ? (
              content.map((item, index) => {
                const value = item.total_spent;
                const angle = (value / total) * 360;
                const path = describeArc(
                  radius,
                  radius,
                  radius,
                  startAngle,
                  startAngle + angle
                );

                const slice = (
                  <Path key={index} d={path} fill={generateColor(index)} />
                );

                startAngle += angle;
                return slice;
              })
            ) : (
              <Circle
                cx={radius}
                cy={radius}
                r={radius}
                fill={theme.button.color.secondary} // efeito donut
              />
            )}

            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill={theme.colors.secondary} // efeito donut
            />
          </G>
        </Svg>

        <View style={styles.numberContainer}>
          <Text style={[styles.number, { fontSize: size / 10 }]}>
            {totalSpent.toFixed(2)}€
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DonutGraph;
