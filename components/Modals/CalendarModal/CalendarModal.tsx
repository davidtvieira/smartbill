import Button from "@/components/Buttons/Button/Button";
import { getAllSmartBills } from "@/services/database/queries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import styles from "./styleCalendarModal";

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  onDateRangeSelected: (startDate: string, endDate: string) => void;
};

export default function CalendarModal({
  visible,
  onClose,
  onDateRangeSelected,
}: CalendarModalProps) {
  const [selectedDates, setSelectedDates] = React.useState<{
    [key: string]: {
      selected?: boolean;
      startingDay?: boolean;
      endingDay?: boolean;
      color?: string;
      textColor?: string;
      marked?: boolean;
      dotColor?: string;
    };
  }>({});
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);
  const [billDates, setBillDates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const bills = await getAllSmartBills();
        const dates: { [key: string]: any } = {};

        bills.forEach((bill) => {
          // Use the purchase_date as the key
          const date = bill.purchase_date;
          if (date) {
            dates[date] = {
              ...dates[date],
              marked: true,
              dotColor: "#F47A64",
            };
          }
        });

        setBillDates(dates);
      } catch (error) {
        console.error("Error fetching SmartBills:", error);
      }
    };

    if (visible) {
      fetchBills();
    }
  }, [visible]);

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    const newSelectedDates = { ...billDates };

    if (!startDate || (startDate && endDate)) {
      // Start new
      setStartDate(date);
      setEndDate(null);
      newSelectedDates[date] = {
        ...newSelectedDates[date],
        selected: true,
        startingDay: true,
        endingDay: true,
        color: "#F47A64",
        textColor: "white",
      };
      setSelectedDates(newSelectedDates);
    } else {
      const rangeSelection: any = {};
      const start = new Date(startDate);
      const end = new Date(date);

      if (start > end) {
        start.setDate(end.getDate());
        end.setDate(start.getDate());
      }

      const formatDate = (d: Date) => d.toISOString().split("T")[0];

      const current = new Date(start);
      while (current <= end) {
        const currentDate = formatDate(new Date(current));
        rangeSelection[currentDate] = {
          ...billDates[currentDate],
          selected: true,
          color: "#F47A64",
          textColor: "white",
          startingDay: currentDate === formatDate(start),
          endingDay: currentDate === formatDate(end),
        };
        current.setDate(current.getDate() + 1);
      }

      setSelectedDates({ ...billDates, ...rangeSelection });
      setEndDate(date);
    }
  };

  const handleApply = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        onDateRangeSelected(endDate, startDate);
      } else {
        onDateRangeSelected(startDate, endDate);
      }
    } else if (startDate) {
      onDateRangeSelected(startDate, startDate);
    }
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDates({});
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Data</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            markingType="period"
            theme={{
              calendarBackground: "#273C47",
              textSectionTitleColor: "#ffffff",
              selectedDayBackgroundColor: "#F47A64",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#F47A64",
              dayTextColor: "#ffffff",
              textDisabledColor: "#666666",
              dotColor: "#F47A64",
              selectedDotColor: "#ffffff",
              arrowColor: "#F47A64",
              monthTextColor: "#F47A64",
              textMonthFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
              textDayFontWeight: "500",
              textDayHeaderFontWeight: "400",
            }}
          />

          <View style={styles.buttonContainer}>
            <View style={{ flex: 1 }}>
              <Button
                title="Redefinir"
                onPress={handleReset}
                variant="secondary"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Aplicar"
                onPress={handleApply}
                variant="primary"
                disabled={!startDate}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
