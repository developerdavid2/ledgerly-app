// templates/reports-template.tsx
// Tab switching now handled by HeroUI Tabs — animated indicator included out of the box.
// The render function pattern on Tabs.Trigger gives us access to isSelected
// so we can style the label font weight without managing any active state ourselves.

import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Container } from "../container";
import { Tabs } from "heroui-native";
import { GeneralOption } from "../ui/icons/GeneralOption";
import LedgerlyScreenHeader from "../base/ledgerly-screen-header";
import DashboardOverview from "../containers/reports/dashboard-overview";
import IncomeActivity from "../containers/reports/income-activity";
// import ExpenseActivity from "../containers/reports/expense-activity";

type ReportTab = "overview" | "income" | "expense";

const TABS: { key: ReportTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "income", label: "Income" },
  { key: "expense", label: "Expense" },
];

const TITLES: Record<ReportTab, string> = {
  overview: "Your Insight",
  income: "Income Activity",
  expense: "Expense Activity",
};

export default function ReportsTemplate() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAuthTheme();
  const [activeTab, setActiveTab] = React.useState<ReportTab>("overview");

  const iconColor = isDark ? "#FFFFFF" : "#000000";

  return (
    <Container className="p-4" isScrollable={false}>
      {/* Header */}
      <View className="min-h-14 w-full">
        <LedgerlyScreenHeader
          showBack={false}
          className="pt-0"
          title={TITLES[activeTab]}
          rightElement={
            activeTab !== "overview" ? (
              <Pressable
                hitSlop={8}
                className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-brand-green-800"
              >
                <GeneralOption color={iconColor} width={24} height={24} />
              </Pressable>
            ) : undefined
          }
        />
      </View>

      {/* HeroUI Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as ReportTab)}
        variant="primary"
        className="flex-1 w-full"
      >
        {/* Tab list — styled to match your original pill row */}
        <Tabs.List className="flex-row bg-brand-flashwhite dark:bg-brand-green-800 rounded-[30px] p-1 mb-6 w-full">
          {/*
            Tabs.Indicator sits behind the triggers and animates its position
            automatically — this replaces the manual isActive bg swap you had before.
          */}
          <Tabs.Indicator className="bg-brand-green-500 dark:bg-brand-green-500 rounded-[30px]" />

          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.key}
              value={tab.key}
              className="flex-1 items-center justify-center py-3 rounded-[30px] bg-transparent"
            >
              {({ isSelected }) => (
                <Tabs.Label
                  className={
                    isSelected
                      ? "text-body-sm text-brand-white"
                      : "text-body-sm text-brand-black dark:text-brand-white"
                  }
                  style={{
                    fontFamily: isSelected
                      ? "PlusJakartaSans_700Bold"
                      : "PlusJakartaSans_400Regular",
                  }}
                >
                  {tab.label}
                </Tabs.Label>
              )}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Tab content inside a ScrollView to preserve your scroll behaviour */}
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Tabs.Content value="overview">
            <DashboardOverview />
          </Tabs.Content>

          <Tabs.Content value="income">
            <IncomeActivity />
          </Tabs.Content>

          <Tabs.Content value="expense">
            {/* <ExpenseActivity /> */}
          </Tabs.Content>
        </ScrollView>
      </Tabs>
    </Container>
  );
}
