import Button from "@/components/Buttons/Button/Button";
import { getAllSmartBills } from "@/services/database/queries";
import { theme } from "@/theme/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import styles from "./styleCalendarModal";

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  onDateRangeSelected: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
};

export default function CalendarModal({
  visible,
  onClose,
  onDateRangeSelected,
  initialStartDate,
  initialEndDate,
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

  // Função para definir o estado do calendário inicial
  const [startDate, setStartDate] = React.useState<string | null>(
    initialStartDate || null
  );

  // Função para definir o estado do calendário final
  const [endDate, setEndDate] = React.useState<string | null>(
    initialEndDate || null
  );

  // Função para definir o estado das datas das smartbills
  const [billDates, setBillDates] = useState<{ [key: string]: any }>({});

  // Função para definir o estado das datas selecionadas
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const bills = await getAllSmartBills();
        const dates: { [key: string]: any } = {};

        bills.forEach((bill) => {
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

        // Inicializa as datas selecionadas com o intervalo inicial se fornecido
        const initialDates = { ...dates };
        if (initialStartDate && initialEndDate) {
          const start = new Date(initialStartDate);
          const end = new Date(initialEndDate);
          const current = new Date(start);

          while (current <= end) {
            const currentDate = current.toISOString().split("T")[0];
            initialDates[currentDate] = {
              ...initialDates[currentDate],
              selected: true,
              color: "#F47A64",
              textColor: "white",
              startingDay: currentDate === initialStartDate,
              endingDay: currentDate === initialEndDate,
            };
            current.setDate(current.getDate() + 1);
          }
        }

        setSelectedDates(initialDates);
      } catch (error) {
        console.error("Error fetching SmartBills:", error);
      }
    };

    if (visible) {
      fetchBills();
    }
  }, [visible, initialStartDate, initialEndDate]);

  // Função para lidar com a seleção de uma data
  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    const newSelectedDates = { ...billDates };

    if (!startDate || (startDate && endDate)) {
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
      const start = new Date(startDate);
      const end = new Date(date);

      const actualStart = start < end ? start : end;
      const actualEnd = start < end ? end : start;

      const rangeSelection: any = {};
      const current = new Date(actualStart);

      const formatDate = (d: Date) => d.toISOString().split("T")[0];

      while (current <= actualEnd) {
        const currentDate = formatDate(new Date(current));
        rangeSelection[currentDate] = {
          ...billDates[currentDate],
          selected: true,
          color: "#F47A64",
          textColor: "white",
          startingDay: currentDate === formatDate(actualStart),
          endingDay: currentDate === formatDate(actualEnd),
        };
        current.setDate(current.getDate() + 1);
      }

      setSelectedDates({ ...billDates, ...rangeSelection });
      setStartDate(formatDate(actualStart));
      setEndDate(formatDate(actualEnd));
    }
  };

  // Função para aplicar a seleção
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
              calendarBackground: theme.colors.secondary,
              textSectionTitleColor: theme.button.text.color,
              selectedDayBackgroundColor: theme.button.color.primary,
              selectedDayTextColor: theme.button.text.color,
              todayTextColor: theme.button.color.primary,
              dayTextColor: theme.button.text.color,
              textDisabledColor: theme.button.text.color,
              dotColor: theme.button.color.primary,
              selectedDotColor: theme.button.text.color,
              arrowColor: theme.button.color.primary,
              monthTextColor: theme.button.color.primary,
              textMonthFontFamily: theme.fonts.bold,
              textDayFontSize: theme.button.text.medium,
              textMonthFontSize: theme.button.text.large,
              textDayHeaderFontSize: theme.button.text.medium,
              textDayFontFamily: theme.fonts.primary,
              textDayHeaderFontFamily: theme.fonts.bold,
            }}
          />

          <View style={styles.buttonContainer}>
            <View style={styles.resetButton}>
              <Button
                title="Redefinir"
                onPress={handleReset}
                variant="secondary"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Aplicar" onPress={handleApply} variant="primary" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
