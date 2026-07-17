import { zodResolver } from '@hookform/resolvers/zod';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import uuid from 'react-native-uuid';

import { useAppDispatch, useAppSelector } from '../app/store';
import { ProductRow } from '../components/ProductRow';
import { QuantityPicker } from '../components/QuantityPicker';
import { TotalFooter } from '../components/TotalFooter';
import { getCartById } from '../db/shoppingRepository';
import { selectShoppingSaveStatus } from '../features/shopping/shoppingSelectors';
import {
  deleteShoppingCart,
  saveShoppingCart,
} from '../features/shopping/shoppingSlice';
import type { RootStackParamList } from '../navigation/types';
import { calcCartTotal, calcRowTotal, formatCurrency } from '../utils/currency';
import {
  productSchema,
  shoppingCartSchema,
  type ShoppingCartFormData,
  type ShoppingCartFormValues,
} from '../utils/validation';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ShoppingDetails'
>;

type ExtraDraft = {
  id: string;
  title: string;
  amount: string;
};

type ProductDraft = {
  id: string;
  title: string;
  price: string;
  quantity: string;
  extras: ExtraDraft[];
};

type ProductModalState = {
  mode: 'create' | 'edit';
  index: number | null;
  draft: ProductDraft;
};

type ExtraDraftError = {
  title?: string;
  amount?: string;
};

type ProductDraftErrors = {
  title?: string;
  price?: string;
  quantity?: string;
  extras?: ExtraDraftError[];
};

const getToday = (): string => new Date().toISOString().slice(0, 10);

const createExtraDraft = (): ExtraDraft => ({
  id: String(uuid.v4()),
  title: '',
  amount: '',
});

const createProductDraft = (): ProductDraft => ({
  id: String(uuid.v4()),
  title: '',
  price: '',
  quantity: '1',
  extras: [],
});

const toProductNumber = (value: unknown): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
};

const mapExtrasForTotal = (
  extras: Array<{ amount?: unknown }> | undefined,
) =>
  (extras ?? []).map(extra => ({
    amount: toProductNumber(extra?.amount),
  }));

export function ShoppingDetailsScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const saveStatus = useAppSelector(selectShoppingSaveStatus);
  const cartId = (route.params as RootStackParamList['ShoppingDetails'] | undefined)
    ?.cartId;
  const isEditMode = Boolean(cartId);
  const isSaving = saveStatus === 'loading';
  const isAutosavingRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const [createdAt, setCreatedAt] = useState(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [productModal, setProductModal] = useState<ProductModalState | null>(
    null,
  );
  const [draftErrors, setDraftErrors] = useState<ProductDraftErrors>({});

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setError,
  } = useForm<ShoppingCartFormValues, undefined, ShoppingCartFormData>({
    defaultValues: {
      title: 'Shopping',
      date: getToday(),
      products: [],
    },
    resolver: zodResolver(shoppingCartSchema),
  });

  const { append, fields, remove, update } = useFieldArray({
    control,
    name: 'products',
  });

  const watchedProducts = useWatch({
    control,
    name: 'products',
  }) as ShoppingCartFormValues['products'];

  const watchedValues = useWatch({
    control,
  });

  const total = useMemo(() => {
    return calcCartTotal(
      (watchedProducts ?? []).map(product => ({
        price: Number(product?.price ?? 0),
        quantity: Number(product?.quantity ?? 0),
        extras: mapExtrasForTotal(product?.extras),
      })),
    );
  }, [watchedProducts]);

  const draftRowTotal = calcRowTotal(
    toProductNumber(productModal?.draft.price),
    toProductNumber(productModal?.draft.quantity),
    mapExtrasForTotal(productModal?.draft.extras),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Edit Shopping Cart' : 'Create Shopping Cart',
    });
  }, [isEditMode, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!isEditMode || hasLoadedRef.current || !cartId) {
        return undefined;
      }

      let isMounted = true;

      const loadCart = async () => {
        const cart = await getCartById(cartId);

        if (!isMounted || !cart) {
          setIsLoading(false);
          return;
        }

        setCreatedAt(cart.createdAt);
        reset({
          title: cart.title,
          date: cart.date,
          products: cart.products.map(product => ({
            id: product.id,
            title: product.title,
            price: String(product.price),
            quantity: String(product.quantity),
            extras: product.extras.map(extra => ({
              id: extra.id,
              title: extra.title,
              amount: String(extra.amount),
            })),
          })),
        });
        hasLoadedRef.current = true;
        setIsLoading(false);
      };

      loadCart();

      return () => {
        isMounted = false;
      };
    }, [cartId, isEditMode, reset]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (isAutosavingRef.current) {
        return;
      }

      const parsed = shoppingCartSchema.safeParse(watchedValues);
      const shouldAutosave = isDirty && parsed.success;

      if (!shouldAutosave) {
        return;
      }

      event.preventDefault();
      isAutosavingRef.current = true;

      dispatch(
        saveShoppingCart({
          id: cartId ?? String(uuid.v4()),
          title: parsed.data.title,
          date: parsed.data.date,
          createdAt,
          products: parsed.data.products,
        }),
      )
        .unwrap()
        .then(() => {
          navigation.dispatch(event.data.action);
        })
        .catch(() => {
          navigation.dispatch(event.data.action);
        })
        .finally(() => {
          isAutosavingRef.current = false;
        });
    });

    return unsubscribe;
  }, [cartId, createdAt, dispatch, isDirty, navigation, watchedValues]);

  const saveForm = handleSubmit(async values => {
    if (!values.products.length) {
      setError('products', {
        message: 'Add at least one product',
        type: 'manual',
      });
      Alert.alert('Cannot save', 'Add at least one product before saving.');
      return;
    }

    try {
      await dispatch(
        saveShoppingCart({
          id: cartId ?? String(uuid.v4()),
          title: values.title,
          date: values.date,
          createdAt,
          products: values.products,
        }),
      ).unwrap();

      navigation.goBack();
    } catch {
      Alert.alert('Save failed', 'Unable to save this shopping cart.');
    }
  });

  const handleDelete = useCallback(() => {
    if (!cartId) {
      return;
    }

    Alert.alert('Delete shopping cart', 'This action cannot be undone.', [
      {
        style: 'cancel',
        text: 'Cancel',
      },
      {
        style: 'destructive',
        text: 'Delete',
        onPress: () => {
          dispatch(deleteShoppingCart(cartId))
            .unwrap()
            .then(() => {
              navigation.goBack();
            })
            .catch(() => {
              Alert.alert(
                'Delete failed',
                'Unable to delete this shopping cart.',
              );
            });
        },
      },
    ]);
  }, [cartId, dispatch, navigation]);

  const closeProductModal = useCallback(() => {
    setProductModal(null);
    setDraftErrors({});
  }, []);

  const updateDraftField = useCallback(
    (field: 'title' | 'price' | 'quantity', value: string) => {
      setProductModal(current => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          draft: {
            ...current.draft,
            [field]: value,
          },
        };
      });
      setDraftErrors(current => ({
        ...current,
        [field]: undefined,
      }));
    },
    [],
  );

  const updateExtraField = useCallback(
    (extraIndex: number, field: 'title' | 'amount', value: string) => {
      setProductModal(current => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          draft: {
            ...current.draft,
            extras: current.draft.extras.map((extra, index) =>
              index === extraIndex
                ? {
                    ...extra,
                    [field]: value,
                  }
                : extra,
            ),
          },
        };
      });
      setDraftErrors(current => {
        if (!current.extras?.[extraIndex]) {
          return current;
        }

        const nextExtras = [...(current.extras ?? [])];
        nextExtras[extraIndex] = {
          ...nextExtras[extraIndex],
          [field]: undefined,
        };

        return {
          ...current,
          extras: nextExtras,
        };
      });
    },
    [],
  );

  const handleAddExtraPrice = useCallback(() => {
    setProductModal(current => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          extras: [...current.draft.extras, createExtraDraft()],
        },
      };
    });
  }, []);

  const handleRemoveExtraPrice = useCallback((extraIndex: number) => {
    setProductModal(current => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          extras: current.draft.extras.filter(
            (_, index) => index !== extraIndex,
          ),
        },
      };
    });
    setDraftErrors(current => ({
      ...current,
      extras: current.extras?.filter((_, index) => index !== extraIndex),
    }));
  }, []);

  const handleAddProduct = useCallback(() => {
    setDraftErrors({});
    setProductModal({
      mode: 'create',
      index: null,
      draft: createProductDraft(),
    });
  }, []);

  const handleEditProduct = useCallback(
    (index: number) => {
      const product = watchedProducts?.[index];

      if (!product) {
        return;
      }

      setDraftErrors({});
      setProductModal({
        mode: 'edit',
        index,
        draft: {
          id: String(product.id),
          title: String(product.title ?? ''),
          price: String(product.price ?? ''),
          quantity: String(product.quantity ?? '1'),
          extras: (product.extras ?? []).map(extra => ({
            id: String(extra.id),
            title: String(extra.title ?? ''),
            amount: String(extra.amount ?? ''),
          })),
        },
      });
    },
    [watchedProducts],
  );

  const handleDoneProduct = useCallback(() => {
    if (!productModal) {
      return;
    }

    const parsed = productSchema.safeParse(productModal.draft);

    if (!parsed.success) {
      const nextErrors: ProductDraftErrors = {
        extras: [],
      };

      for (const issue of parsed.error.issues) {
        const [first, second, third] = issue.path;

        if (first === 'title' || first === 'price' || first === 'quantity') {
          nextErrors[first] = issue.message;
          continue;
        }

        if (
          first === 'extras' &&
          typeof second === 'number' &&
          (third === 'title' || third === 'amount')
        ) {
          nextErrors.extras = nextErrors.extras ?? [];
          nextErrors.extras[second] = {
            ...nextErrors.extras[second],
            [third]: issue.message,
          };
        }
      }

      setDraftErrors(nextErrors);
      return;
    }

    const nextProduct = {
      id: parsed.data.id,
      title: parsed.data.title,
      price: String(parsed.data.price),
      quantity: String(parsed.data.quantity),
      extras: parsed.data.extras.map(extra => ({
        id: extra.id,
        title: extra.title,
        amount: String(extra.amount),
      })),
    };

    if (productModal.mode === 'create') {
      append(nextProduct);
    } else if (productModal.index !== null) {
      update(productModal.index, nextProduct);
    }

    closeProductModal();
  }, [append, closeProductModal, productModal, update]);

  const handleRemoveProduct = useCallback(() => {
    if (!productModal) {
      return;
    }

    if (productModal.mode === 'edit' && productModal.index !== null) {
      remove(productModal.index);
    }

    closeProductModal();
  }, [closeProductModal, productModal, remove]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading shopping cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Shopping Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Shopping"
              style={styles.input}
              value={value}
            />
          )}
        />

        <Text style={styles.label}>Shopping Date</Text>
        <Controller
          control={control}
          name="date"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="YYYY-MM-DD"
              style={[styles.input, errors.date && styles.inputError]}
              value={value}
            />
          )}
        />
        {errors.date?.message ? (
          <Text style={styles.errorText}>{errors.date.message}</Text>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <Pressable onPress={handleAddProduct} style={styles.addButton}>
            <Text style={styles.addButtonLabel}>+ Add Product</Text>
          </Pressable>
        </View>

        {fields.map((field, index) => (
          <ProductRow
            key={field.id}
            extras={mapExtrasForTotal(watchedProducts?.[index]?.extras)}
            onDelete={() => remove(index)}
            onPress={() => handleEditProduct(index)}
            price={toProductNumber(watchedProducts?.[index]?.price)}
            quantity={toProductNumber(watchedProducts?.[index]?.quantity)}
            rowTotal={calcRowTotal(
              toProductNumber(watchedProducts?.[index]?.price),
              toProductNumber(watchedProducts?.[index]?.quantity),
              mapExtrasForTotal(watchedProducts?.[index]?.extras),
            )}
            title={watchedProducts?.[index]?.title || ''}
          />
        ))}

        {errors.products?.message ? (
          <Text style={styles.errorText}>{errors.products.message}</Text>
        ) : null}
      </ScrollView>

      <TotalFooter
        isEditMode={isEditMode}
        isSaving={isSaving}
        onDelete={handleDelete}
        onSave={saveForm}
        total={total}
      />

      <Modal
        animationType="slide"
        onRequestClose={closeProductModal}
        transparent
        visible={productModal !== null}>
        <View style={styles.modalOverlay}>
          <Pressable onPress={closeProductModal} style={styles.modalBackdrop} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {productModal?.mode === 'edit'
                  ? `Product ${(productModal.index ?? 0) + 1}`
                  : 'New Product'}
              </Text>
              <Pressable onPress={handleRemoveProduct}>
                <Text style={styles.deleteLabel}>Delete</Text>
              </Pressable>
            </View>

            {productModal ? (
              <ScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  onChangeText={value => updateDraftField('title', value)}
                  placeholder="Milk"
                  style={[styles.input, draftErrors.title && styles.inputError]}
                  value={productModal.draft.title}
                />
                {draftErrors.title ? (
                  <Text style={styles.errorText}>{draftErrors.title}</Text>
                ) : null}

                <Text style={styles.label}>Price Per Unit</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  onChangeText={value => updateDraftField('price', value)}
                  placeholder="0.00"
                  style={[styles.input, draftErrors.price && styles.inputError]}
                  value={productModal.draft.price}
                />
                <Text style={styles.helperText}>Enter the discounted price</Text>
                {draftErrors.price ? (
                  <Text style={styles.errorText}>{draftErrors.price}</Text>
                ) : null}

                <Text style={styles.label}>Quantity</Text>
                <QuantityPicker
                  hasError={Boolean(draftErrors.quantity)}
                  onChange={value => updateDraftField('quantity', value)}
                  value={productModal.draft.quantity}
                />
                {draftErrors.quantity ? (
                  <Text style={styles.errorText}>{draftErrors.quantity}</Text>
                ) : null}

                {productModal.draft.extras.map((extra, extraIndex) => (
                  <View key={extra.id} style={styles.extraCard}>
                    <View style={styles.extraPriceHeader}>
                      <Text style={styles.extraCardTitle}>
                        Extra price {extraIndex + 1}
                      </Text>
                      <Pressable
                        onPress={() => handleRemoveExtraPrice(extraIndex)}>
                        <Text style={styles.removeExtraLabel}>Remove</Text>
                      </Pressable>
                    </View>

                    <Text style={styles.label}>Title</Text>
                    <TextInput
                      onChangeText={value =>
                        updateExtraField(extraIndex, 'title', value)
                      }
                      placeholder="Tax"
                      style={[
                        styles.input,
                        draftErrors.extras?.[extraIndex]?.title &&
                          styles.inputError,
                      ]}
                      value={extra.title}
                    />
                    {draftErrors.extras?.[extraIndex]?.title ? (
                      <Text style={styles.errorText}>
                        {draftErrors.extras[extraIndex]?.title}
                      </Text>
                    ) : null}

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                      keyboardType="decimal-pad"
                      onChangeText={value =>
                        updateExtraField(extraIndex, 'amount', value)
                      }
                      placeholder="0.00"
                      style={[
                        styles.input,
                        draftErrors.extras?.[extraIndex]?.amount &&
                          styles.inputError,
                      ]}
                      value={extra.amount}
                    />
                    <Text style={styles.helperText}>
                      Fixed amount (tax, fee, or other charge)
                    </Text>
                    {draftErrors.extras?.[extraIndex]?.amount ? (
                      <Text style={styles.errorText}>
                        {draftErrors.extras[extraIndex]?.amount}
                      </Text>
                    ) : null}
                  </View>
                ))}

                <Pressable
                  onPress={handleAddExtraPrice}
                  style={styles.extraPriceButton}>
                  <Text style={styles.extraPriceButtonLabel}>
                    + Extra price
                  </Text>
                </Pressable>

                <View style={styles.rowTotal}>
                  <Text style={styles.rowTotalLabel}>Row Total</Text>
                  <Text style={styles.rowTotalValue}>
                    {formatCurrency(draftRowTotal)}
                  </Text>
                </View>

                <Pressable onPress={handleDoneProduct} style={styles.doneButton}>
                  <Text style={styles.doneButtonLabel}>Done</Text>
                </Pressable>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonLabel: {
    color: '#111827',
    fontWeight: '700',
  },
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  deleteLabel: {
    color: '#dc2626',
    fontWeight: '600',
  },
  doneButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 14,
  },
  doneButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#dc2626',
    marginTop: 4,
  },
  extraCard: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
  },
  extraCardTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  extraPriceButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
    paddingVertical: 8,
  },
  extraPriceButtonLabel: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  extraPriceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperText: {
    color: '#6b7280',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  label: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalContent: {
    paddingBottom: 24,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalOverlay: {
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  removeExtraLabel: {
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 12,
  },
  rowTotal: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rowTotalLabel: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  rowTotalValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 24,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
});
