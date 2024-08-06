const express = require("express"); // Import express
const inquirer = require("inquirer");
const DB = require("./db");


// Database connection
const db = new DB({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Hwiwzfn@36",
  port: 5432,
});

const app = express();
const port = process.env.PORT || 4000;

// Express route for health check or basic response
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Main menu options
const menuChoices = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
  "Exit",
];

// Main menu function
function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: menuChoices,
      },
    ])
    .then((answer) => {
      switch (answer.choice) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          db.close().then(() => {
            console.log("Goodbye!");
            process.exit(0);
          });
          break;
      }
    });
}

// View all departments
function viewAllDepartments() {
  db.viewAllDepartments()
    .then((departments) => {
      console.table(departments);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error viewing departments:", error);
      mainMenu();
    });
}

// View all roles
function viewAllRoles() {
  db.viewAllRoles()
    .then((roles) => {
      console.table(roles);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error viewing roles:", error);
      mainMenu();
    });
}

// View all employees
function viewAllEmployees() {
  db.viewAllEmployees()
    .then((employees) => {
      console.table(employees);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error viewing employees:", error);
      mainMenu();
    });
}

// Add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the new department:",
      },
    ])
    .then((answer) => {
      db.addDepartment(answer.name)
        .then((newDepartment) => {
          console.log(`Added new department: ${newDepartment.name}`);
          mainMenu();
        })
        .catch((error) => {
          console.error("Error adding department:", error);
          mainMenu();
        });
    });
}

// Add a role
function addRole() {
  db.getDepartments().then((departments) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for this role:",
          validate: (input) => !isNaN(input) || "Please enter a valid number",
        },
        {
          type: "list",
          name: "department_id",
          message: "Select the department for this role:",
          choices: departments.map((dept) => ({
            name: dept.name,
            value: dept.id,
          })),
        },
      ])
      .then((answers) => {
        db.addRole(answers.title, answers.salary, answers.department_id)
          .then((newRole) => {
            console.log(`Added new role: ${newRole.title}`);
            mainMenu();
          })
          .catch((error) => {
            console.error("Error adding role:", error);
            mainMenu();
          });
      });
  });
}

// Add an employee
function addEmployee() {
  Promise.all([db.getRoles(), db.getEmployees()]).then(([roles, employees]) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Enter the employee's first name:",
        },
        {
          type: "input",
          name: "last_name",
          message: "Enter the employee's last name:",
        },
        {
          type: "list",
          name: "role_id",
          message: "Select the employee's role:",
          choices: roles.map((role) => ({ name: role.title, value: role.id })),
        },
        {
          type: "list",
          name: "manager_id",
          message: "Select the employee's manager:",
          choices: [
            { name: "None", value: null },
            ...employees.map((emp) => ({ name: emp.name, value: emp.id })),
          ],
        },
      ])
      .then((answers) => {
        db.addEmployee(
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id
        )
          .then((newEmployee) => {
            console.log(
              `Added new employee: ${newEmployee.first_name} ${newEmployee.last_name}`
            );
            mainMenu();
          })
          .catch((error) => {
            console.error("Error adding employee:", error);
            mainMenu();
          });
      });
  });
}

// Update an employee role
function updateEmployeeRole() {
  Promise.all([db.getEmployees(), db.getRoles()]).then(([employees, roles]) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select the employee to update:",
          choices: employees.map((emp) => ({ name: emp.name, value: emp.id })),
        },
        {
          type: "list",
          name: "role_id",
          message: "Select the new role:",
          choices: roles.map((role) => ({ name: role.title, value: role.id })),
        },
      ])
      .then((answers) => {
        db.updateEmployeeRole(answers.employee_id, answers.role_id)
          .then((updatedEmployee) => {
            console.log(
              `Updated role for employee: ${updatedEmployee.first_name} ${updatedEmployee.last_name}`
            );
            mainMenu();
          })
          .catch((error) => {
            console.error("Error updating employee role:", error);
            mainMenu();
          });
      });
  });
}

// Start the application
db.connect()
  .then(() => {
    console.log("Connected to the database.");
    mainMenu();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });
