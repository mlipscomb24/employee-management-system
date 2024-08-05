const { Client } = require('pg');

class DB {
  constructor(config) {
    this.client = new Client(config);
  }

  async connect() {
    await this.client.connect();
  }

  async close() {
    await this.client.end();
  }

  async viewAllDepartments() {
    const query = 'SELECT * FROM department ORDER BY id';
    const result = await this.client.query(query);
    return result.rows;
  }

  async viewAllRoles() {
    const query = `
      SELECT r.id, r.title, r.salary, d.name AS department
      FROM role r
      JOIN department d ON r.department_id = d.id
      ORDER BY r.id
    `;
    const result = await this.client.query(query);
    return result.rows;
  }

  async viewAllEmployees() {
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name AS department, 
        r.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY e.id
    `;
    const result = await this.client.query(query);
    return result.rows;
  }

  async addDepartment(name) {
    const query = 'INSERT INTO department (name) VALUES ($1) RETURNING *';
    const result = await this.client.query(query, [name]);
    return result.rows[0];
  }

  async addRole(title, salary, departmentId) {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *';
    const result = await this.client.query(query, [title, salary, departmentId]);
    return result.rows[0];
  }

  async addEmployee(firstName, lastName, roleId, managerId) {
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await this.client.query(query, [firstName, lastName, roleId, managerId]);
    return result.rows[0];
  }

  async updateEmployeeRole(employeeId, roleId) {
    const query = 'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *';
    const result = await this.client.query(query, [roleId, employeeId]);
    return result.rows[0];
  }

  async getDepartments() {
    const query = 'SELECT id, name FROM department ORDER BY name';
    const result = await this.client.query(query);
    return result.rows;
  }

  async getRoles() {
    const query = 'SELECT id, title FROM role ORDER BY title';
    const result = await this.client.query(query);
    return result.rows;
  }

  async getEmployees() {
    const query = 'SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee ORDER BY last_name, first_name';
    const result = await this.client.query(query);
    return result.rows;
  }
}

module.exports = DB;