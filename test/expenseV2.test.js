const request = require('supertest');
const app = require('../server');
const chai = require('chai');
const expect = chai.expect;

describe('Expense API', () => {
  let expenseId;

  // Test POST route to create an expense
  describe('POST /expense/create', () => {
    it('should create a new expense', async () => {
      const expense = {
        title: 'test',
        price: 1111.11,
        category: 'testCat',
        essential: true,
        created_at: '2012-12-06 10:40',
      };
      const res = await request(app).post('/api/expense/create').send(expense);
      expect(res.status).to.equal(201);
      expenseId = res.text.split(" ")[2].split(",")[0];
    });

    it('should return 400 if one of the properties is null or undefined', async() => {
      //no price property
      const expense = {
        title: 'test',
        category: 'testCat',
        essential: true,
        created_at: '2012-12-06 10:40',
      };
      const res = await request(app).post('/api/expense/create').send(expense);
      expect(res.status).to.equal(400);
    })
  });
  
  
  // Test GET route to read an expense
  describe('GET /expense/:id', () => {
    it('should read an existing expense', (done) => {
      request(app)
        .get(`/api/expense/${expenseId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body[0]).to.include({
            title: 'test',
            category: 'testCat',
            essential: true,
          });
          done();
        });
    });
  });

  // Test PUT route to update an expense
  describe('PUT /expense/:id', () => {
    it('should update an existing expense', (done) => {
      const expense = {
        title: 'updatedTest',
        price: 1111.11,
        category: 'testCat',
        essential: true,
        created_at: '2012-12-06 10:40',
      };
      request(app)
        .put(`/api/expense/${expenseId}`)
        .send(expense)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.contain(expenseId);
          done();
        });
    });
  });

    // Test GET route to read a list of expenses
    describe('GET /expense/list/:expenseDate', () => {
      it('should read a list of expenses for a given date', (done) => {
        request(app)
          .get('/api/expense/list/2012-12-06')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            done();
          });
      });
    });

  // Test DELETE route to remove an expense
  describe('DELETE /expense/:id', () => {
    it('should remove an existing expense', (done) => {
      request(app)
        .delete(`/api/expense/${expenseId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.include(
            'User deleted with ID:',
            expenseId
          );
          done();
        });
      });
    });
    


});
