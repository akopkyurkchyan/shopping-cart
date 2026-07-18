import { shoppingCartSchema } from '../src/utils/validation';

describe('shopping cart validation', () => {
  it('accepts a valid shopping cart', () => {
    const result = shoppingCartSchema.safeParse({
      date: '2026-07-16',
      products: [
        {
          id: '1',
          price: '2.50',
          quantity: '3',
          title: 'Milk',
        },
      ],
      title: '',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe('');
      expect(result.data.products[0].price).toBe(2.5);
      expect(result.data.products[0].quantity).toBe(3);
    }
  });

  it('rejects carts with no products', () => {
    const result = shoppingCartSchema.safeParse({
      date: '2026-07-16',
      products: [],
      title: 'Weekly Shopping',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid product values', () => {
    const result = shoppingCartSchema.safeParse({
      date: '2026-07-16',
      products: [
        {
          id: '1',
          price: '-1',
          quantity: '0',
          title: '',
        },
      ],
      title: 'Weekly Shopping',
    });

    expect(result.success).toBe(false);
  });

  it('rejects quantity above 100', () => {
    const result = shoppingCartSchema.safeParse({
      date: '2026-07-16',
      products: [
        {
          id: '1',
          price: '2.50',
          quantity: '101',
          title: 'Milk',
        },
      ],
      title: 'Weekly Shopping',
    });

    expect(result.success).toBe(false);
  });

  it('accepts multiple titled extras', () => {
    const result = shoppingCartSchema.safeParse({
      date: '2026-07-16',
      products: [
        {
          extras: [
            { amount: '1.50', id: 'e1', title: 'Tax' },
            { amount: '0.75', id: 'e2', title: 'Bottle fee' },
          ],
          id: '1',
          price: '2.50',
          quantity: '3',
          title: 'Milk',
        },
      ],
      title: 'Weekly Shopping',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.products[0].extras).toHaveLength(2);
      expect(result.data.products[0].extras[0].title).toBe('Tax');
      expect(result.data.products[0].extras[0].amount).toBe(1.5);
    }
  });
});
