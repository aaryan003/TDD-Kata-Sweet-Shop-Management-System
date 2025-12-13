import Sweet, { ISweet } from '../../models/Sweet';

describe('Sweet Model', () => {
  describe('Sweet Creation', () => {
    it('should create a sweet with valid data', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      };

      const sweet = await Sweet.create(sweetData);

      expect(sweet.name).toBe(sweetData.name);
      expect(sweet.category).toBe(sweetData.category);
      expect(sweet.price).toBe(sweetData.price);
      expect(sweet.quantity).toBe(sweetData.quantity);
    });

    it('should fail without required fields', async () => {
      const sweet = new Sweet({});
      let error;

      try {
        await sweet.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should fail with negative price', async () => {
      const sweetData = {
        name: 'Candy',
        category: 'Hard Candy',
        price: -5,
        quantity: 50
      };

      let error;
      try {
        await Sweet.create(sweetData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should fail with negative quantity', async () => {
      const sweetData = {
        name: 'Gummy Bears',
        category: 'Gummies',
        price: 3.50,
        quantity: -10
      };

      let error;
      try {
        await Sweet.create(sweetData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });
  });

  describe('Sweet Update', () => {
    it('should update sweet quantity', async () => {
      const sweet = await Sweet.create({
        name: 'Lollipop',
        category: 'Hard Candy',
        price: 1.00,
        quantity: 50
      });

      sweet.quantity = 75;
      await sweet.save();

      const updated = await Sweet.findById(sweet._id);
      expect(updated?.quantity).toBe(75);
    });
  });

  describe('Sweet Search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.00, quantity: 50 },
        { name: 'Milk Chocolate', category: 'Chocolate', price: 2.50, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummies', price: 2.00, quantity: 75 }
      ]);
    });

    it('should find sweets by category', async () => {
      const chocolates = await Sweet.find({ category: 'Chocolate' });
      expect(chocolates.length).toBe(2);
    });

    it('should find sweets by price range', async () => {
      const sweets = await Sweet.find({ price: { $gte: 2.50, $lte: 3.00 } });
      expect(sweets.length).toBe(2);
    });
  });
});