const alice = {
  username: "alice",
  name: "alice test",
  email: "alice.test@gmail.com",
  password: "Superpassword123",
};

const bob = {
  username: "bob123",
  name: "bob test",
  email: "bob.test@gmail.com",
  password: "Superpassword123",
};

const charlie = {
  username: "charlie",
  name: "charlie test",
  email: "charlie.test@gmail.com",
  password: "Superpassword123",
};

const emptyUsername = {
  username: "",
  name: "testing bot",
  email: "test.bot@gmail.com",
  password: "botspassword123",
};

const emptyName = {
  username: "testbot",
  name: "",
  email: "test.bot@gmail.com",
  password: "botspassword123",
};

const emptyEmail = {
  username: "testbot",
  name: "testing bot",
  email: "",
  password: "botspassword123",
};

const emptyPassword = {
  username: "testbot",
  name: "testing bot",
  email: "test.bot@gmail.com",
  password: "",
};

const invalidUsername = {
  username: "F!",
  name: "testing bot",
  email: "test.bot@gmail.com",
  password: "botspassword123",
};

const invalidName = {
  username: "testbot",
  name: "F!",
  email: "test.bot@gmail.com",
  password: "botspassword123",
};

const invalidEmail = {
  username: "testbot",
  name: "testing bot",
  email: "F!",
  password: "botspassword123",
};

const invalidPassword = {
  username: "testbot",
  name: "testing bot",
  email: "test.bot@gmail.com",
  password: "F!",
};

module.exports = {
  alice,
  bob,
  charlie,
  emptyUsername,
  emptyName,
  emptyEmail,
  emptyPassword,
  invalidUsername,
  invalidEmail,
  invalidName,
  invalidPassword,
};
