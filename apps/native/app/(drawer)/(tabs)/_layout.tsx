import { Platform } from "react-native";
import { useState } from "react";
// import LedgerlyAddTransactionModal from "@/components/containers/ledgerly-add-transaction-modal";

import AndroidTabs from "@/components/navigation/_android-tabs";
import IOSTabs from "@/components/navigation/_ios-tabs";
import LedgerlyAddTransactionModal from "@/components/containers/ledgerly-add-transaction-modal";

const TabLayout = () => {
  const [isAddTransactionVisible, setAddTransactionVisible] = useState(false);

  // The FAB callbacks are passed down so both platforms handle them identically.
  const fabProps = {
    onFabPress: () => setAddTransactionVisible(true),
  };

  return (
    <>
      {Platform.OS === "ios" ? (
        <IOSTabs onFabPress={() => setAddTransactionVisible(true)} />
      ) : (
        <AndroidTabs onFabPress={() => setAddTransactionVisible(true)} />
      )}

      {/* Modal is platform-agnostic, lives here once */}
      <LedgerlyAddTransactionModal
        visible={isAddTransactionVisible}
        onClose={() => setAddTransactionVisible(false)}
        onCreate={() => setAddTransactionVisible(false)}
      />
    </>
  );
};

export default TabLayout;
