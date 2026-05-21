import { View, Text } from "react-native";
import React from "react";
import { Card, Switch } from "heroui-native";

interface LedgerlyNotificationItemProps {
  title: string;
  description: string;
  isSelected: boolean;
  onValueChange?: (isSelected: boolean) => void;
  className?: string;
}

export default function LedgerlyNotificationItem({
  title,
  description,
  isSelected,
  onValueChange,
  className = "",
}: LedgerlyNotificationItemProps) {
  return (
    <Card
      className={`rounded-[15px] bg-brand-white/50 dark:bg-accent-card/15 py-4.5 px-5 flex-row items-center justify-between border-0 w-full ${className}`}
      style={{ borderCurve: "continuous" }}
    >
      <View className="flex-col items-start gap-y-1 flex-1 pr-6">
        <Card.Title
          className="text-base leading-4.5 text-brand-black dark:text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          numberOfLines={1}
        >
          {title}
        </Card.Title>
        <Card.Description
          className="text-body-xs leading-normal text-brand-black dark:text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          numberOfLines={2}
        >
          {description}
        </Card.Description>
      </View>

      <Switch isSelected={isSelected} onSelectedChange={onValueChange} />
    </Card>
  );
}
