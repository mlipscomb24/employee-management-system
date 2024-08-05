

INSERT INTO department (name) VALUES
('Potions'),
('Dark Magic'),
('Charms'),
('History of Magic');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
('Professor', 300000, 1),
('Teacher Assist', 80000, 1),
('Grounds Keeper', 100000, 2),
('Student', 1200, 2),
('Headmaster', 425000, 3),
('Sennior Professor', 350000, 4),
('Caretaker', 90000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Hermione', 'Granger', 1, NULL),
('Draco', 'Malfoy', 2, 1),
('Severus', 'Snape', 3, NULL),
('Ron', 'Weasley', 4, 3),
('Rubeus', 'Hagrid', 5, NULL),
('Harry', 'Potter', 6, NULL),
('Luna', 'Lovegood', 7, 6);