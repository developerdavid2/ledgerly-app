import { Container } from "@/components/container";
import LedgerlyBudgetPlanCard from "@/components/containers/ledgerly-budget-plan";
import LedgerlyCardBalance from "@/components/containers/ledgerly-card-balance";
import LedgerlyIncomeExpense from "@/components/containers/ledgerly-income-expense";
import LedgerlyInvoiceCard from "@/components/containers/ledgerly-invoice-card";
import SafeArea from "@/components/safe-area";
import { GeneralAlarm } from "@/components/ui/icons/GeneralAlarm";
import { GeneralSearch } from "@/components/ui/icons/GeneralSearch";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useInvoices } from "@/hooks/use-invoice";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useTransactionSummary } from "@/hooks/use-transactions";
import { useWallets } from "@/hooks/use-wallet";
import { mapStatus, MONTH_ABBRS } from "@/lib/constants";
import { ONBOARDING_FONT_FAMILY } from "@/lib/constants/onboarding-typography";
import { Link, router } from "expo-router";
import { Avatar, useThemeColor } from "heroui-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const themeColorBackground = useThemeColor("background");
  const currentMonthAbbr = MONTH_ABBRS[new Date().getMonth()];
  const [budgetMonth, setBudgetMonth] = useState(currentMonthAbbr);
  const { data: sessionData } = useAuthSession();
  const user = sessionData?.data?.user;
  const userName = user?.name || "User";
  const userImage = user?.image;
  const { iconColor } = useThemeColors();

  const monthDateRange = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, []);

  const { data: summaryResponse } = useTransactionSummary(monthDateRange);
  const summary = (summaryResponse as any)?.data as
    | {
        income: number;
        expense: number;
        balance: number;
        transactionCount: number;
      }
    | undefined;

  const monthlyIncome = summary?.income ?? 0;
  const monthlyExpense = summary?.expense ?? 0;

  const { data: walletsResponse } = useWallets();
  const wallets = walletsResponse?.data ?? [];

  const totalBalance = useMemo(() => {
    return wallets.reduce(
      (sum: number, w: any) => sum + Number(w.balance ?? 0),
      0,
    );
  }, [wallets]);

  const budgetDateRange = useMemo(() => {
    const monthIndex = MONTH_ABBRS.indexOf(budgetMonth);
    if (monthIndex === -1) return undefined;

    const year = new Date().getFullYear();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, [budgetMonth]);

  const { data: budgetSummaryResponse } =
    useTransactionSummary(budgetDateRange);
  const budgetSummary = budgetSummaryResponse?.data as
    | { income: number; expense: number; balance: number }
    | undefined;
  const budgetAvailable =
    (budgetSummary?.income ?? 0) - (budgetSummary?.expense ?? 0);

  const { data: invoicesResponse, isLoading: isLoadingInvoices } = useInvoices({
    limit: 3,
  });
  const recentInvoices = invoicesResponse?.data ?? [];

  return (
    <SafeArea style={{ backgroundColor: themeColorBackground }}>
      <Container className="p-4 md:p-6" isScrollable={false}>
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between mb-8 w-full pt-1">
            <View className="flex-row items-center gap-2.5">
              <Avatar className="size-10" alt="Profile Avatar">
                {userImage ? (
                  <Avatar.Image source={{ uri: userImage }} asChild>
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </Avatar.Image>
                ) : (
                  <Avatar.Fallback>
                    <Text
                      className="text-[22px] text-brand-white"
                      style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </Text>
                  </Avatar.Fallback>
                )}
              </Avatar>
              <View className="flex-col justify-center gap-y-1">
                <Text
                  className="text-[14px] leading-3.5 text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                >
                  Welcome,
                </Text>
                <Text
                  className="text-h6 leading-5 text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  {userName}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-x-2.5">
              <Pressable className="w-12.5 h-12.5 rounded-[40px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center">
                <GeneralSearch color={iconColor} width={23} height={23} />
              </Pressable>
              <Link href="/notifications" asChild>
                <Pressable className="w-12.5 h-12.5 rounded-[40px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center">
                  <GeneralAlarm color={iconColor} width={23} height={23} />
                </Pressable>
              </Link>
            </View>
          </View>
          <View className="flex-col w-full gap-y-2.5 mb-7">
            <LedgerlyCardBalance
              totalBalance={totalBalance}
              earned={monthlyIncome}
              spent={monthlyExpense}
              available={totalBalance}
              savings={monthlyIncome - monthlyExpense}
            />
            <Pressable
              className="w-full bg-brand-green-500 items-center justify-center p-4 min-h-14.25"
              style={{ borderRadius: 50 }}
            >
              <Text
                className="text-[16px] leading-4.75 text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                Scan here
              </Text>
            </Pressable>
          </View>

          <View className="flex-col w-full gap-y-2.5 mb-7">
            <LedgerlyIncomeExpense
              incomeAmount={monthlyIncome}
              expenseAmount={monthlyExpense}
              dateLabel="This month"
            />
            <LedgerlyBudgetPlanCard
              month={budgetMonth}
              onMonthChange={setBudgetMonth}
              availableCash={budgetAvailable}
            />
          </View>

          <View className="flex-col w-full gap-y-2.5 mb-7">
            <View className="flex-row items-end justify-between w-full mb-1">
              <Text
                className="text-lg leading leading-6.25 text-brand-black dark:text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                Invoice
              </Text>

              <Link href="/invoices" asChild>
                <Pressable>
                  <Text
                    className="text-[14px] leading-3.75 text-brand-black dark:text-brand-white"
                    style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                  >
                    See all
                  </Text>
                </Pressable>
              </Link>
            </View>

            {isLoadingInvoices ? (
              <View className="items-center py-6">
                <ActivityIndicator size="small" />
              </View>
            ) : recentInvoices.length === 0 ? (
              <View className="items-center py-6">
                <Text
                  className="text-[13px] text-brand-grey dark:text-gray-400"
                  style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                >
                  No invoices yet
                </Text>
              </View>
            ) : (
              recentInvoices.map((inv: any) => (
                <LedgerlyInvoiceCard
                  key={inv.id}
                  title={inv.clientName || inv.invoiceNumber}
                  datetime={format(new Date(inv.createdAt), "yyyy-MM-dd HH:mm")}
                  amount={inv.total}
                  status={mapStatus(inv.status)}
                  onPress={() => router.push(`/invoice/${inv.id}`)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </Container>
    </SafeArea>
  );
}
