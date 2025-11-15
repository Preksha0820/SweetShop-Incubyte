import request from 'supertest';
import app from '../src/index.js';
import User from '../src/models/User.js';
import Sweet from '../src/models/Sweet.js';
import mongoose from 'mongoose';

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';

let adminToken;
let userToken;
let adminUser;
let regularUser;

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);

  // Create admin user
  const adminResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123'
    });

  adminToken = adminResponse.body.token;
  adminUser = adminResponse.body.user;

  // Manually set admin role
  await User.findByIdAndUpdate(adminUser.id, { role: 'admin' });

  // Create regular user
  const userResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123'
    });

  userToken = userResponse.body.token;
  regularUser = userResponse.body.user;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

//
// ✅ FIXED afterEach
// Clears sweets AND resets all user orders so tests don't interfere
//
afterEach(async () => {
  await Sweet.deleteMany({});
  await User.updateMany({}, { $set: { orders: [] } });
});

describe('Sweets API', () => {

  describe('POST /api/sweets', () => {
    it('should create a new sweet as admin', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.category).toBe(sweetData.category);
      expect(response.body.price).toBe(sweetData.price);
      expect(response.body.quantity).toBe(sweetData.quantity);
      expect(response.body).toHaveProperty('_id');
    });

    it('should not create sweet without authentication', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);
    });

    it('should not create sweet as regular user', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.99, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 50 },
        { name: 'Lollipop', category: 'Candy', price: 0.99, quantity: 200 }
      ]);
    });

    it('should get all sweets without authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.99, quantity: 100 },
        { name: 'Milk Chocolate', category: 'Chocolate', price: 2.99, quantity: 50 },
        { name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 200 }
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Gummy')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('Gummy');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=4')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should update sweet as admin', async () => {
      const updateData = {
        name: 'Dark Chocolate Bar',
        price: 3.99
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
    });

    it('should not update sweet without authentication', async () => {
      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ name: 'Updated' })
        .expect(401);
    });

    it('should not update sweet as regular user', async () => {
      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated' })
        .expect(403);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should delete sweet as admin', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should not delete sweet without authentication', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .expect(401);
    });

    it('should not delete sweet as regular user', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10
      });
      sweetId = sweet._id;
    });

    it('should purchase sweet successfully', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 })
        .expect(200);

      expect(response.body.message).toBe('Purchase successful');
      expect(response.body.sweet.quantity).toBe(8);

      const user = await User.findById(regularUser.id);
      expect(user.orders).toHaveLength(1);
      expect(user.orders[0].quantity).toBe(2);
    });

    it('should not purchase more than available quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 })
        .expect(400);

      expect(response.body.message).toBe('Not enough stock');
    });

    it('should not purchase without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 1 })
        .expect(401);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10
      });
      sweetId = sweet._id;
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(60);
    });

    it('should not restock without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .send({ quantity: 50 })
        .expect(401);
    });

    it('should not restock as regular user', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);
    });
  });

  describe('GET /api/sweets/my-orders', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      });
      sweetId = sweet._id;

      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });
    });

    it('should get user orders', async () => {
      const response = await request(app)
        .get('/api/sweets/my-orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].sweetName).toBe('Chocolate Bar');
      expect(response.body[0].quantity).toBe(2);
      expect(response.body[0].totalPrice).toBe(5.98);
    });

    it('should not get orders without authentication', async () => {
      await request(app)
        .get('/api/sweets/my-orders')
        .expect(401);
    });
  });

});
