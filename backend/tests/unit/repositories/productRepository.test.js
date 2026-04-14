const { initialize, close } = require('../../../src/db/connection');
const productRepository = require('../../../src/db/productRepository');
const fs = require('fs');
const path = require('path');

describe('ProductRepository', () => {
  beforeAll(() => {
    // Usar base de datos en memoria para tests
    const dbPath = path.join(__dirname, '../../../database/jereshop.db');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    initialize();
  });

  afterAll(() => {
    close();
  });

  beforeEach(() => {
    // Limpiar tabla antes de cada test
    const { getDb } = require('../../../src/db/connection');
    const db = getDb();
    db.prepare('DELETE FROM products').run();
  });

  describe('create', () => {
    it('should create a product with all fields', () => {
      const productData = {
        name: 'iPhone 15',
        price: 999.99,
        image_url: 'https://example.com/iphone15.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      };

      const product = productRepository.create(productData);

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.image_url).toBe(productData.image_url);
      expect(product.whatsapp_link).toBe(productData.whatsapp_link);
    });

    it('should throw error when price is not positive', () => {
      const productData = {
        name: 'iPhone 15',
        price: -100,
        image_url: 'https://example.com/iphone15.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      };

      expect(() => productRepository.create(productData)).toThrow();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no products exist', () => {
      const products = productRepository.findAll();
      expect(products).toEqual([]);
    });

    it('should return all products', () => {
      const product1 = productRepository.create({
        name: 'iPhone 15',
        price: 999.99,
        image_url: 'https://example.com/iphone15.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      });

      const product2 = productRepository.create({
        name: 'Samsung Galaxy S24',
        price: 899.99,
        image_url: 'https://example.com/galaxy.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      });

      const products = productRepository.findAll();
      expect(products).toHaveLength(2);
      expect(products[0].id).toBe(product1.id);
      expect(products[1].id).toBe(product2.id);
    });
  });

  describe('findById', () => {
    it('should return null when product does not exist', () => {
      const product = productRepository.findById(999);
      expect(product).toBeNull();
    });

    it('should return product when it exists', () => {
      const created = productRepository.create({
        name: 'iPhone 15',
        price: 999.99,
        image_url: 'https://example.com/iphone15.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      });

      const product = productRepository.findById(created.id);
      expect(product).toBeDefined();
      expect(product.id).toBe(created.id);
      expect(product.name).toBe(created.name);
    });
  });

  describe('update', () => {
    it('should return null when product does not exist', () => {
      const result = productRepository.update(999, { name: 'Updated' });
      expect(result).toBeNull();
    });

    it('should update all fields', () => {
      const created = productRepository.create({
        name: 'iPhone 15',
        price: 999.99,
        image_url: 'https://example.com/iphone15.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      });

      const updated = productRepository.update(created.id, {
        name: 'iPhone 15 Pro',
        price: 1099.99,
        image_url: 'https://example.com/iphone15pro.jpg',
        whatsapp_link: 'https://wa.me/9876543210'
      });

      expect(updated.name).toBe('iPhone 15 Pro');
      expect(updated.price).toBe(1099.99);
      expect(updated.image_url).toBe('https://example.com/iphone15pro.jpg');
      expect(updated.whatsapp_link).toBe('https://wa.me/9876543210');
    });

    it('should update only provided fields', () => {
      const created = productRepository.create({
        name: 'iPhone 15',
        price: 999.99,
        image_url: 'https://example.com/iphone15.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      });

      const updated = productRepository.update(created.id, {
        price: 899.99
      });

      expect(updated.name).toBe('iPhone 15');
      expect(updated.price).toBe(899.99);
      expect(updated.image_url).toBe('https://example.com/iphone15.jpg');
      expect(updated.whatsapp_link).toBe('https://wa.me/1234567890');
    });
  });

  describe('delete', () => {
    it('should return false when product does not exist', () => {
      const result = productRepository.delete(999);
      expect(result).toBe(false);
    });

    it('should delete product and return true', () => {
      const created = productRepository.create({
        name: 'iPhone 15',
        price: 999.99,
        image_url: 'https://example.com/iphone15.jpg',
        whatsapp_link: 'https://wa.me/1234567890'
      });

      const result = productRepository.delete(created.id);
      expect(result).toBe(true);

      const product = productRepository.findById(created.id);
      expect(product).toBeNull();
    });
  });
});
