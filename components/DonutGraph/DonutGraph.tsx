import {
  getCurrentMonthCategorySpending,
  getCurrentMonthTotalSpent,
} from "@/services/database/queries";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import PieChart from "react-native-pie-chart";
import styles from "./styleDonutGraph";

const DonutGraph = () => {
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [series, setSeries] = useState<{ value: number; color: string }[]>([]);

  const generateColor = (
    index: number,
    baseColor: string = "#F47A64"
  ): string => {
    const hex = baseColor.replace("#", "");
    const factor = 1 - index * 0.09;

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

  useEffect(() => {
    const fetchCategorySpending = async () => {
      try {
        const categories = await getCurrentMonthCategorySpending();
        const total = categories.reduce(
          (sum, item) => sum + item.total_spent,
          0
        );

        if (total > 0) {
          const formattedSeries = categories.map((item, index) => ({
            value: item.total_spent,
            color: generateColor(index),
          }));

          setSeries(formattedSeries);
        }
      } catch (error) {
        console.error("Error fetching category spending:", error);
      }
    };

    fetchCategorySpending();
  }, []);

  useEffect(() => {
    const fetchCurrentMonthTotal = async () => {
      try {
        const total = await getCurrentMonthTotalSpent();
        setTotalSpent(total);
      } catch (error) {
        console.error("Error fetching current month total:", error);
      }
    };

    fetchCurrentMonthTotal();
  }, []);

  const size = 250;
  const formattedTotal = totalSpent.toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {series.length > 0 && (
          <PieChart widthAndHeight={size} series={series} cover={0.6} />
        )}
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{formattedTotal}€</Text>
        </View>
      </View>
    </View>
  );
};

export default DonutGraph;
