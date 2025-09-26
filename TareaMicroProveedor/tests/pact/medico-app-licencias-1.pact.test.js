const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

// Configuración del mock server
const provider = new Pact({
  consumer: 'Médico App',
  provider: 'Licencias',
  port: 3005,
  host: '0.0.0.0',
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO',
  spec: 2
});

describe('Médico App - Licencias API - Test 1', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('should create a valid license', async () => {
    await provider
      .addInteraction({
        state: 'issued license days>0 is creatable',
        uponReceiving: 'a request to create a valid license',
        withRequest: {
          method: 'POST',
          path: '/licenses',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            patientId: '11111111-1',
            doctorId: 'D-001',
            diagnosis: 'Gripe común',
            startDate: '2024-01-15',
            days: 7
          }
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            folio: 'L-1001',
            patientId: '11111111-1',
            doctorId: 'D-001',
            diagnosis: 'Gripe común',
            startDate: '2024-01-15',
            days: 7,
            status: 'issued'
          }
        }
      });

    const response = await axios.post('http://0.0.0.0:3005/licenses', {
      patientId: '11111111-1',
      doctorId: 'D-001',
      diagnosis: 'Gripe común',
      startDate: '2024-01-15',
      days: 7
    });
    
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      folio: 'L-1001',
      patientId: '11111111-1',
      doctorId: 'D-001',
      diagnosis: 'Gripe común',
      startDate: '2024-01-15',
      days: 7,
      status: 'issued'
    });
  });
});
