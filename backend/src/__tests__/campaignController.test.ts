import request from 'supertest';
import app from '../app';
import { db } from '../config/database';
import * as campaignQueries from '../db/queries/campaigns';

describe('Campaign Controller', () => {
  beforeEach(() => {
    // Clear database before each test
    db.exec('DELETE FROM contributions');
    db.exec('DELETE FROM withdrawals');
    db.exec('DELETE FROM campaigns');
  });

  describe('POST /api/campaigns', () => {
    it('should create a new campaign', async () => {
      const campaignData = {
        title: 'Test Campaign',
        description: 'Test Description',
        goalAmount: '1000000000000000000', // 1 ETH in Wei
        deadline: Math.floor(Date.now() / 1000) + 86400,
        contractAddress: '0x1234567890123456789012345678901234567890',
        creatorAddress: '0x0987654321098765432109876543210987654321',
      };

      const response = await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(campaignData.title);
      expect(response.body.contractAddress).toBe(campaignData.contractAddress);
    });

    it('should reject invalid contract address', async () => {
      const campaignData = {
        title: 'Test Campaign',
        goalAmount: '1000000000000000000',
        deadline: Math.floor(Date.now() / 1000) + 86400,
        contractAddress: 'invalid-address',
        creatorAddress: '0x0987654321098765432109876543210987654321',
      };

      await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .expect(400);
    });
  });

  describe('GET /api/campaigns', () => {
    it('should return all campaigns', async () => {
      // Create test campaigns
      campaignQueries.createCampaign(db, {
        contract_address: '0x1111111111111111111111111111111111111111',
        creator_address: '0x2222222222222222222222222222222222222222',
        title: 'Campaign 1',
        description: 'Description 1',
        goal_amount: '1000000000000000000',
        deadline: Math.floor(Date.now() / 1000) + 86400,
      });

      const response = await request(app)
        .get('/api/campaigns')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/campaigns/:id', () => {
    it('should return campaign by id', async () => {
      const campaignId = campaignQueries.createCampaign(db, {
        contract_address: '0x3333333333333333333333333333333333333333',
        creator_address: '0x4444444444444444444444444444444444444444',
        title: 'Test Campaign',
        description: 'Test Description',
        goal_amount: '1000000000000000000',
        deadline: Math.floor(Date.now() / 1000) + 86400,
      });

      const response = await request(app)
        .get(`/api/campaigns/${campaignId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', campaignId);
      expect(response.body.title).toBe('Test Campaign');
    });

    it('should return 404 for non-existent campaign', async () => {
      await request(app)
        .get('/api/campaigns/99999')
        .expect(404);
    });
  });
});

