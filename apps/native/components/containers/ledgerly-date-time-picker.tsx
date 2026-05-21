import React, { useState } from "react";
import { View, Text, Pressable, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ONBOARDING_FONT_FAMILY } from "@/lib/constants/onboarding-typography";
import { useThemeColors } from "@/hooks/use-theme-colors";

export interface LedgerlyDateTimePickerProps {
  visible: boolean;
  value: Date;
  onDateChange: (date: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

type DateTimePickerOnValueChange = NonNullable<
  React.ComponentProps<typeof DateTimePicker>["onValueChange"]
>;

export const LedgerlyDateTimePicker: React.FC<LedgerlyDateTimePickerProps> = ({
  visible,
  value,
  onDateChange,
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useThemeColors();
  const insets = useSafeAreaInsets();

  const [androidMode, setAndroidMode] = useState<"date" | "time">("date");
  const [pendingDate, setPendingDate] = useState<Date>(value);

  if (!visible) return null;

  // ─── Android ───────────────────────────────────────────────────────────────
  if (Platform.OS === "android") {
    const handleAndroidChange: DateTimePickerOnValueChange = (_, date) => {
      // No date means user dismissed
      if (!date) {
        onCancel();
        setAndroidMode("date");
        return;
      }

      if (androidMode === "date") {
        setPendingDate(date);
        setAndroidMode("time");
      } else {
        const finalDate = new Date(pendingDate);
        finalDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
        onDateChange(finalDate);
        onConfirm();
        setAndroidMode("date");
      }
    };

    return (
      <DateTimePicker
        value={androidMode === "date" ? value : pendingDate}
        mode={androidMode}
        onValueChange={handleAndroidChange}
      />
    );
  }

  // ─── iOS ───────────────────────────────────────────────────────────────────
  const handleIOSChange: DateTimePickerOnValueChange = (_, date) => {
    if (date) onDateChange(date);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-[#2222224d] justify-end">
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0"
          onPress={onCancel}
        />
        <View className="w-full bg-brand-white dark:bg-dark-charcoal-green rounded-t-[20px]">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-[#444]">
            <Pressable onPress={onCancel} className="py-1 px-2">
              <Text
                className="text-[16px] text-brand-black dark:text-brand-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.regular }}
              >
                Cancel
              </Text>
            </Pressable>
            <Text
              className="text-[16px] text-brand-black dark:text-brand-white"
              style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
            >
              Select Date & Time
            </Text>
            <Pressable onPress={onConfirm} className="py-1 px-2">
              <Text
                className="text-[16px] text-brand-green-500 dark:text-brand-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
              >
                Done
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 216 }}>
            <DateTimePicker
              value={value}
              mode="datetime"
              display="spinner"
              onValueChange={handleIOSChange}
              themeVariant={isDark ? "dark" : "light"}
              style={{ height: 216 }}
            />
          </View>

          <View style={{ height: insets.bottom + 16 }} />
        </View>
      </View>
    </Modal>
  );
};
