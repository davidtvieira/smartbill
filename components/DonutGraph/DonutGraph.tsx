import React from "react";
import { Text, View } from "react-native";
import PieChart from "react-native-pie-chart";
import styles from "./styleDonutGraph";

interface DonutGraphProps {
  totalSpent: number;
  size: number;
  content: Array<{
    total_spent: number;
  }>;
}

const DonutGraph = ({ totalSpent, size, content }: DonutGraphProps) => {
  const generateColor = (
    index: number,
    baseColor: string = "#F47A64"
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

  const series = content.map((item, index) => ({
    value: item.total_spent,
    color: generateColor(index),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {series.length > 0 && (
          <PieChart widthAndHeight={size} series={series} cover={0.6} />
        )}
        <View style={styles.numberContainer}>
          <Text
            style={{ fontSize: size / 10, fontWeight: "bold", color: "white" }}
          >
            {totalSpent.toFixed(2)}€
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DonutGraph;
