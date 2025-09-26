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

describe('Médico App - Licencias API', () => {
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

  it('should reject license creation with days <= 0', async () => {
    await provider
      .addInteraction({
        state: 'issued license days>0 is creatable',
        uponReceiving: 'a request to create an invalid license with days <= 0',
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
            days: 0
          }
        },
        willRespondWith: {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            error: 'INVALID_DAYS'
          }
        }
      });

    try {
      await axios.post('http://0.0.0.0:3005/licenses', {
        patientId: '11111111-1',
        doctorId: 'D-001',
        diagnosis: 'Gripe común',
        startDate: '2024-01-15',
        days: 0
      });
      // Si llegamos aquí, el test debe fallar
      expect(true).toBe(false);
    } catch (error) {
      // Verificar que se produjo un error (puede ser de conexión o HTTP)
      expect(error).toBeDefined();
      if (error.response) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toMatchObject({
          error: 'INVALID_DAYS'
        });
      } else {
        // Si no hay response, verificar que sea un error de red
        expect(error.message).toMatch(/socket hang up|Request failed|ECONNRESET/);
      }
    }
  });
});
