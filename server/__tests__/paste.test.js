const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Paste = require('../models/pasteModel');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    await Paste.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST /api/pastes', () => {
    it('should create a new paste with default values', async () => {
        const res = await request(app)
            .post('/api/pastes')
            .send({ content: 'console.log("Hello World");' });

        expect(res.status).toBe(201);
        expect(res.body.content).toBe('console.log("Hello World");');
        expect(res.body.title).toBe('Untitled');
        expect(res.body.language).toBe('plaintext');
        expect(res.body.expiresIn).toBe('1w');
        expect(res.body.views).toBe(0);
        expect(res.body._id).toBeDefined();
        expect(res.body.expiresAt).toBeDefined();
    });

    it('should create a paste with custom title and language', async () => {
        const res = await request(app)
            .post('/api/pastes')
            .send({
                content: 'function test() {}',
                title: 'My Function',
                language: 'javascript'
            });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('My Function');
        expect(res.body.language).toBe('javascript');
    });

    it('should create a paste with custom expiration (hours)', async () => {
        const res = await request(app)
            .post('/api/pastes')
            .send({
                content: 'test content',
                expiresIn: '12h'
            });

        expect(res.status).toBe(201);
        expect(res.body.expiresIn).toBe('12h');

        // Check that expiresAt is approximately 12 hours from now
        const expiresAt = new Date(res.body.expiresAt);
        const now = new Date();
        const hoursDiff = (expiresAt - now) / (1000 * 60 * 60);
        expect(hoursDiff).toBeGreaterThan(11.9);
        expect(hoursDiff).toBeLessThan(12.1);
    });

    it('should create a paste with custom expiration (days)', async () => {
        const res = await request(app)
            .post('/api/pastes')
            .send({
                content: 'test content',
                expiresIn: '3d'
            });

        expect(res.status).toBe(201);
        expect(res.body.expiresIn).toBe('3d');
    });

    it('should reject paste with empty content', async () => {
        const res = await request(app)
            .post('/api/pastes')
            .send({ content: '' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Content is required');
    });

    it('should reject paste with invalid expiration format', async () => {
        const res = await request(app)
            .post('/api/pastes')
            .send({
                content: 'test',
                expiresIn: 'invalid'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Invalid expiration format');
    });

    it('should reject paste with expiration exceeding max hours', async () => {
        const res = await request(app)
            .post('/api/pastes')
            .send({
                content: 'test',
                expiresIn: '30h'
            });

        expect(res.status).toBe(400);
    });
});

describe('GET /api/pastes/:id', () => {
    it('should retrieve a paste by ID', async () => {
        // Create a paste first
        const createRes = await request(app)
            .post('/api/pastes')
            .send({
                content: 'test content',
                title: 'Test Paste',
                language: 'python'
            });

        const pasteId = createRes.body._id;

        // Retrieve the paste
        const res = await request(app)
            .get(`/api/pastes/${pasteId}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(pasteId);
        expect(res.body.content).toBe('test content');
        expect(res.body.title).toBe('Test Paste');
        expect(res.body.language).toBe('python');
    });

    it('should increment view count on retrieval', async () => {
        const createRes = await request(app)
            .post('/api/pastes')
            .send({ content: 'view test' });

        const pasteId = createRes.body._id;

        // First view
        const res1 = await request(app).get(`/api/pastes/${pasteId}`);
        expect(res1.body.views).toBe(1);

        // Second view
        const res2 = await request(app).get(`/api/pastes/${pasteId}`);
        expect(res2.body.views).toBe(2);
    });

    it('should return 404 for non-existent paste', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/pastes/${fakeId}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('not found');
    });

    it('should return 404 for invalid ID format', async () => {
        const res = await request(app)
            .get('/api/pastes/invalid-id');

        expect(res.status).toBe(404);
        expect(res.body.message).toContain('Invalid paste ID');
    });
});

describe('GET /api/pastes/:id/raw', () => {
    it('should return raw paste content as plain text', async () => {
        const createRes = await request(app)
            .post('/api/pastes')
            .send({
                content: 'raw content here',
                title: 'Raw Test'
            });

        const pasteId = createRes.body._id;

        const res = await request(app)
            .get(`/api/pastes/${pasteId}/raw`);

        expect(res.status).toBe(200);
        expect(res.type).toBe('text/plain');
        expect(res.text).toBe('raw content here');
    });

    it('should return 404 for non-existent paste', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/pastes/${fakeId}/raw`);

        expect(res.status).toBe(404);
        expect(res.type).toBe('text/plain');
    });
});

describe('GET /api/pastes/:id/analytics', () => {
    it('should return paste analytics', async () => {
        const createRes = await request(app)
            .post('/api/pastes')
            .send({ content: 'analytics test', title: 'Analytics Paste' });

        const pasteId = createRes.body._id;

        // View the paste a few times
        await request(app).get(`/api/pastes/${pasteId}`);
        await request(app).get(`/api/pastes/${pasteId}`);

        const res = await request(app)
            .get(`/api/pastes/${pasteId}/analytics`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(pasteId);
        expect(res.body.title).toBe('Analytics Paste');
        expect(res.body.views).toBe(2);
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.expiresAt).toBeDefined();
        expect(res.body.expiresIn).toBeDefined();
    });
});

describe('DELETE /api/pastes/:id', () => {
    it('should delete a paste', async () => {
        const createRes = await request(app)
            .post('/api/pastes')
            .send({ content: 'to be deleted' });

        const pasteId = createRes.body._id;

        const deleteRes = await request(app)
            .delete(`/api/pastes/${pasteId}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toContain('deleted');

        // Verify it's gone
        const getRes = await request(app)
            .get(`/api/pastes/${pasteId}`);

        expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent paste', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/pastes/${fakeId}`);

        expect(res.status).toBe(404);
    });
});

describe('GET /api/pastes/search', () => {
    beforeEach(async () => {
        // Create some test pastes
        await request(app)
            .post('/api/pastes')
            .send({ content: 'hello world', title: 'Greeting' });
        await request(app)
            .post('/api/pastes')
            .send({ content: 'goodbye world', title: 'Farewell' });
        await request(app)
            .post('/api/pastes')
            .send({ content: 'javascript code', title: 'JS Sample' });
    });

    it('should search pastes by content', async () => {
        const res = await request(app)
            .get('/api/pastes/search?q=world');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should search pastes by title', async () => {
        const res = await request(app)
            .get('/api/pastes/search?q=Greeting');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Greeting');
    });

    it('should return empty array for no matches', async () => {
        const res = await request(app)
            .get('/api/pastes/search?q=nonexistent');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });

    it('should require search query', async () => {
        const res = await request(app)
            .get('/api/pastes/search');

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('query is required');
    });
});

describe('GET /health', () => {
    it('should return health status', async () => {
        const res = await request(app)
            .get('/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.timestamp).toBeDefined();
        expect(res.body.cache).toBeDefined();
    });
});
