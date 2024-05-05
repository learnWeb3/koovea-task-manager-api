db = db.getSiblingDB('koovea-task-manager'); // we can not use "use" statement here to switch db

// backend server api
db.createUser({
  user: 'koovea-data-admin',
  pwd: '8C4PkW9kukHZ',
  roles: [{ role: 'readWrite', db: 'koovea-task-manager' }],
  passwordDigestor: 'server',
});
