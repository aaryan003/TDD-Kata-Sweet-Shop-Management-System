import request from 'supertest';
import app from '../../app';
import User from '../../models/User';
import Sweet from '../../models/Sweet';
import AuthService from '../../services/auth.service';

describe('Sweet Controller', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;

  beforeEach(async () => {
    const user = await AuthService.register({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });
    userToken = user.token;
    userId = user.user._id;

    const admin = await AuthService.register({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = admin.token;
    adminId = admin.user._id;
  });

  describe('POST /api/sweets', () => {
    it('should create a sweet as admin', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sweetData.name);
      expect(response.body.data.price).toBe(sweetData.price);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({ name: 'Candy', category: 'Hard Candy', price: 1.50, quantity: 50 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail as regular user', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Candy', category: 'Hard Candy', price: 1.50, quantity: 50 })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Candy' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.00, quantity: 50 },
        { name: 'Milk Chocolate', category: 'Chocolate', price: 2.50, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummies', price: 2.00, quantity: 75 }
      ]);
    });

    it('should get all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(3);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.00, quantity: 50 },
        { name: 'Milk Chocolate', category: 'Chocolate', price: 2.50, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummies', price: 2.00, quantity: 75 }
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2.50&maxPrice=3.00')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Original Sweet',
        category: 'Candy',
        price: 1.50,
        quantity: 50
      });
      sweetId = sweet._id.toString();
    });

    it('should update sweet as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Sweet', price: 2.00 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Sweet');
      expect(response.body.data.price).toBe(2.00);
    });

    it('should fail as regular user', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Sweet' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid id', async () => {
      const response = await request(app)
        .put('/api/sweets/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Sweet' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Delete',
        category: 'Candy',
        price: 1.50,
        quantity: 50
      });
      sweetId = sweet._id.toString();
    });

    it('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should fail as regular user', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Purchase',
        category: 'Candy',
        price: 1.50,
        quantity: 10
      });
      sweetId = sweet._id.toString();
    });

    it('should purchase sweet', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(7);
    });

    it('should fail with insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 0 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Restock',
        category: 'Candy',
        price: 1.50,
        quantity: 10
      });
      sweetId = sweet._id.toString();
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(60);
    });

    it('should fail as regular user', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});