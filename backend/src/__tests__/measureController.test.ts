import { uploadMeasure, confirmMeasure, listMeasures } from '../controllers/measureController';
import { Request, Response } from 'express';

describe('Measure Controller', () => {
  it('should return 400 if required fields are missing', async () => {
    const req = {
      body: {}
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await uploadMeasure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error_code: 'INVALID_DATA' }));

    await confirmMeasure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error_code: 'INVALID_DATA' }));

    await listMeasures(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error_code: 'INVALID_DATA' }));
  });

});
