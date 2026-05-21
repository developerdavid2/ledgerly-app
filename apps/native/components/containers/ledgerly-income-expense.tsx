import { View, Text, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { Card, cn } from "heroui-native";
import useAuthTheme from "@/hooks/use-auth-theme";
import { GeneralArrowUpRi } from "../ui/icons/GeneralArrowUpRi";
import { GeneralArrowUpLe } from "../ui/icons/GeneralArrowUpLe";

interface LedgerlyIncomeExpenseProps {
  incomeAmount: number;
  expenseAmount: number;
  dateLabel?: string;
  className?: string;
}

export default function LedgerlyIncomeExpense({
  incomeAmount,
  expenseAmount,
  dateLabel = "This month",
  className = "",
}: LedgerlyIncomeExpenseProps) {
  const { isDark } = useAuthTheme();

  // Light mode custom shadow from Figma: -1px -5px 61px 0px #8b8a8a1f (rgba(139,138,138,0.12))
  const shadowStyle: StyleProp<ViewStyle> = !isDark
    ? {
        shadowColor: "rgba(139, 138, 138, 0.12)",
        shadowOffset: { width: -1, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 61,
        elevation: 10, // approximate elevation for Android
      }
    : {};

  return (
    <View
      className={cn(
        "flex-row items-center justify-between w-full gap-x-2.5",
        className,
      )}
    >
      <Card
        className="flex-1 flex-row items-start bg-white/60 dark:bg-accent-card/15 rounded-2xl p-[13px_16px] gap-x-3 border-0"
        style={[{ borderCurve: "continuous" }, shadowStyle]}
      >
        <View style={{ transform: [{ rotate: "0deg" }] }}>
          <GeneralArrowUpRi color={"#2c6658"} width={20} height={20} />
        </View>
        <Card.Body className="flex-col items-start gap-y-3.5 flex-1 p-0">
          <View className="flex-col items-start w-full">
            <Card.Title
              className="text-sm leading-4.25 text-brand-black/80 dark:text-brand-white/80"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Income
            </Card.Title>
            <Card.Title
              className="text-[16px] leading-5 text-brand-black/80 dark:text-brand-white/80"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              numberOfLines={1}
            >
              {typeof incomeAmount === "number"
                ? `$${incomeAmount.toLocaleString()}`
                : incomeAmount}
            </Card.Title>
          </View>
          <Card.Description
            className="text-xs leading-3.25 text-brand-black dark:text-brand-white/80"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            numberOfLines={1}
          >
            {dateLabel}
          </Card.Description>
        </Card.Body>
      </Card>
      <Card
        className="flex-1 flex-row items-start bg-white/60 dark:bg-accent-card/15 rounded-2xl p-[13px_16px] gap-x-3 border-0"
        style={[{ borderCurve: "continuous" }, shadowStyle]}
      >
        <View style={{ transform: [{ rotate: "180deg" }] }}>
          <GeneralArrowUpRi
            color={isDark ? "#FF4B51" : "#E9383E"}
            width={20}
            height={20}
          />
        </View>
        <Card.Body className="flex-col items-start gap-y-3.5 flex-1 p-0">
          <View className="flex-col items-start w-full">
            <Card.Title
              className="text-sm leading-4.25 text-brand-black/80 dark:text-brand-white/80"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Expense
            </Card.Title>
            <Card.Title
              className="text-[16px] leading-5 text-brand-black/80 dark:text-brand-white/80"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              numberOfLines={1}
            >
              {typeof expenseAmount === "number"
                ? `$${expenseAmount.toLocaleString()}`
                : expenseAmount}
            </Card.Title>
          </View>
          <Card.Description
            className="text-xs leading-3.25 text-brand-black/80 dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            numberOfLines={1}
          >
            {dateLabel}
          </Card.Description>
        </Card.Body>
      </Card>
    </View>
  );
}
