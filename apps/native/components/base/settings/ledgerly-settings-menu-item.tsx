import { View, Text, Pressable } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Card, cn } from "heroui-native";
import { User } from "@/components/ui/icons/User";
import { GeneralChevronRi } from "@/components/ui/icons/GeneralChevronRi";

export interface LedgerlySettingsMenuItemProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export default function LedgerlySettingsMenuItem({
  label,
  icon,
  onPress,
  className = "",
}: LedgerlySettingsMenuItemProps) {
  const { isDark } = useAuthTheme();
  const arrowColor = isDark ? "#FFFFFF" : "#6B6B6C";
  const fallbackIconColor = isDark ? "#FFFFFF" : "#6B6B6C";
  return (
    <Pressable onPress={onPress}>
      <Card
        className={cn(
          "rounded-[15px] bg-white/60 dark:bg-accent-card/15 py-4.5 px-5 flex-row items-center justify-between border-0 w-full",
          className,
        )}
        style={{ borderCurve: "continuous" }}
      >
        <View className="flex-row items-center gap-x-3.75 flex-1">
          <View className="size-10 rounded-full items-center justify-center bg-accent-card/10 dark:bg-accent-card">
            {icon ? (
              icon
            ) : (
              <User color={fallbackIconColor} width={18} height={18} />
            )}
          </View>
          <Card.Title
            className="text-[14px] leading-4.5 text-brand-black dark:text-brand-white flex-1"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            numberOfLines={1}
          >
            {label}
          </Card.Title>
        </View>

        <GeneralChevronRi color={arrowColor} width={24} height={24} />
      </Card>
    </Pressable>
  );
}
