import request from 'supertest';

import app from '../../app';

const aboutJSONKeys = [
  'name',
  'description',
  'author',
  'license',
  'version',
  'releaseNotes'
];

describe('About', () => {
  it('should return the about page', async () => {
    const response = await request(app).get('/about');
    expect(response.status).toBe(200);
    expect(Object.keys(response.body)).toStrictEqual(aboutJSONKeys);
  });
});
