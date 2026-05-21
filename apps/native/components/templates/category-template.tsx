import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Dialog, Spinner, useThemeColor } from "heroui-native";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { LedgerlyButton } from "../ui/ledgerly-button";
import LedgerlyScreenHeader from "../base/ledgerly-screen-header";
import { Container } from "../container";
import CategoryItem from "../containers/category/category-item";
import AddCategoryDialog from "../containers/category/add-category-dialog";

export default function CategoryTemplate() {
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor("default-foreground");

  const { data: categoriesData, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData || [];

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteCategoryId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteCategoryId) {
      deleteCategory.mutate(deleteCategoryId);
      setDeleteModalVisible(false);
      setDeleteCategoryId(null);
    }
  };

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
      <View className="px-5 w-full">
        <LedgerlyScreenHeader
          title="Categories"
          showBack={true}
          rightElement={
            <Button
              onPress={() => setAddModalVisible(true)}
              isIconOnly
              variant="secondary"
              className="rounded-[40px] w-12.5 h-12.5"
            >
              <Ionicons name="add" size={24} color={iconColor} />
            </Button>
          }
        />
      </View>

      <Container className="px-5 pt-2 flex-1" isScrollable={false}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="lg" color="success" />
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryItem item={item} onDelete={handleDelete} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <Text
                className="text-center text-brand-silver mt-10"
                style={{ fontFamily: "PlusJakartaSans_500Medium" }}
              >
                No categories found. Start by adding one.
              </Text>
            }
          />
        )}
      </Container>

      <AddCategoryDialog
        isOpen={isAddModalVisible}
        onOpenChange={setAddModalVisible}
      />

      {/* Delete Dialog */}
      <Dialog
        isOpen={isDeleteModalVisible}
        onOpenChange={setDeleteModalVisible}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/40" />
          <Dialog.Content className="bg-brand-white dark:bg-[#101c18]">
            <Dialog.Title className="font-bold">Delete Category</Dialog.Title>
            <Dialog.Description className="text-gray-500">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </Dialog.Description>
            <View className="flex-row items-center justify-end gap-3 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeleteCategoryId(null);
                }}
              >
                Cancel
              </Button>
              <LedgerlyButton
                variant="solid"
                color="danger"
                size="sm"
                onPress={confirmDelete}
                isLoading={deleteCategory.isPending}
              >
                Delete
              </LedgerlyButton>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  );
}
