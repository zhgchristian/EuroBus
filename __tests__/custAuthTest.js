const request = require("supertest");
const app = require("../app");
const { createCustomers, deleteCustomers } = require("../lib/customerInit");
const { createProducts, deleteProducts } = require("../lib/productsInit");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");

// seeding
beforeAll(async () => {
  // await createCustomers();
  await createProducts();
});

// cleaning
afterAll(async () => {
  await deleteCustomers();
  await deleteProducts();
});

// route for register

describe("POST /register", () => {
  it("should return register SUCCESS", async () => {
    const res = await request(app)
      .post("/pub/register")
      .send({ email: "customer@test.com", password: "12345" })
      .expect(201);

    expect(res.body.message).toBe("Account creation success");
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.email).toBe("customer@test.com");
  });

  it("should return register FAILED - email not unique", async () => {
    const res = await request(app)
      .post("/pub/register")
      .send({ email: "customer@test.com", password: "12345" })
      .expect(400);

    expect(res.body.message).toBe("email must be unique");
  });

  it("should return register FAILED - email format wrong", async () => {
    const res = await request(app)
      .post("/pub/register")
      .send({ email: "customer", password: "12345" })
      .expect(400);

    expect(res.body.message).toBe("Validation error: Email format is wrong");
  });

  it("should return register FAILED - email empty", async () => {
    const res = await request(app)
      .post("/pub/register")
      .send({ email: "", password: "12345" })
      .expect(400);

    expect(res.body.message).toBe(
      "Validation error: Email format is wrong,\n" +
        "Validation error: Email cannot be empty"
    );
  });

  it("should return register FAILED - email empty string", async () => {
    const res = await request(app)
      .post("/pub/register")
      .send({ email: " ", password: "12345" })
      .expect(400);

    expect(res.body.message).toBe(
      "Validation error: Email format is wrong,\n" +
        "Validation error: Email cannot be empty"
    );
  });

  it("should return register FAILED - password empty", async () => {
    const res = await request(app)
      .post("/pub/register")
      .send({ email: "customer@test.com", password: "" })
      .expect(400);

    expect(res.body.message).toBe("Validation error: Password cannot be empty");
  });

  it("should return register FAILED - password empty string", async () => {
    const res = await request(app)
      .post("/pub/register")
      .send({ email: "customer@test.com", password: " " })
      .expect(400);

    expect(res.body.message).toBe("Validation error: Password cannot be empty");
  });
});

// route for user login

let token = "";

describe("POST /login", () => {
  it("should return login SUCCESS", async () => {
    const res = await request(app)
      .post("/pub/login")
      .send({ email: "customer@test.com", password: "12345" })
      .expect(200);

    token = res.body.access_token;

    expect(res.body.message).toBe("Logged in successfully");
    expect(typeof res.body.access_token).toBe("string");
    expect(res.body.userdata.id).toBe(1);
    expect(res.body.userdata.role).toBe("customer");
  });

  it("should return login FAILED - wrong password", async () => {
    const res = await request(app)
      .post("/pub/login")
      .send({ email: "customer@test.com", password: "ABCDE" })
      .expect(401);

    expect(res.body.message).toBe("Unauthorized: Invalid Email or Password");
  });

  it("should return login FAILED - email does not exist", async () => {
    const res = await request(app)
      .post("/pub/login")
      .send({ email: "bapak@test.com", password: "12345" })
      .expect(401);

    expect(res.body.message).toBe("Unauthorized: Invalid Email or Password");
  });
});

// route for customer wishlist

describe("POST /wishlist/:id", () => {
  it("should return add Wishlist SUCCESS", async () => {
    const res = await request(app)
      .post(`/pub/wishlist/${179}`)
      .set("access_token", token)
      .expect(201);

    expect(res.body.message).toBe("Wishlist created");
    expect(res.body.data.customerId).toBe(1);
    expect(res.body.data.productId).toBe(179);
  });
});

describe("GET /wishlist", () => {
  it("should return an array of wishlist per user SUCCESS", async () => {
    const res = await request(app)
      .get(`/pub/wishlist`)
      .set("access_token", token)
      .expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].CustomerId).toBe(1);
    expect(res.body.data[0].ProductId).toBe(179);
    expect(res.body.data[0].Product.id).toBe(179);
    expect(res.body.data[0].Product.name).toBe("Kazio");
  });
});

describe("POST /wishlist/:id", () => {
  it("should return add Wishlist FAILED - product id does not exist", async () => {
    const res = await request(app)
      .post(`/pub/wishlist/${999}`)
      .set("access_token", token)
      .expect(404);

    expect(res.body.message).toBe("No such product exists");
  });
});

describe("POST /wishlist/:id", () => {
  it("should return add Wishlist FAILED - no access token/not logged in", async () => {
    const res = await request(app).post(`/pub/wishlist/${1}`).expect(401);

    expect(res.body.message).toBe("Authentication failed");
  });
});

let wrongToken = "thistokeniscompletelywrong";

describe("POST /wishlist/:id", () => {
  it("should return add Wishlist FAILED - invalid token", async () => {
    const res = await request(app)
      .post(`/pub/wishlist/${1}`)
      .set("access_token", wrongToken)
      .expect(401);

    expect(res.body.message).toBe("Authentication failed");
  });
});

// route for customer products

describe("GET /products", () => {
  it("should return products array", async () => {
    const res = await request(app).get("/pub/products").expect(200);

    expect(Array.isArray(res.body.data)).toBe(true); //is array of objects
    expect(res.body.data.length).toBe(12); //as per pagination limit

    expect(res.body.data[0].id).toBe(1);
    expect(res.body.data[0].name).toBe("Quamba");
    expect(res.body.data[0].description).toBe(
      "luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse"
    );
    expect(res.body.data[0].price).toBe(2604035);
    expect(res.body.data[0].imgUrl).toBe(
      "http://dummyimage.com/239x100.png/ff4444/ffffff"
    );
    expect(res.body.data[0].stock).toBe(309);
    expect(res.body.data[0].categoryId).toBe(5);
    expect(res.body.data[0].authorId).toBe(2);
    expect(res.body.data[0].status).toBe("Active");
  });

  it("should return products array per filter", async () => {
    const res = await request(app)
      .get("/pub/products")
      .query({ filter: 1 })
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true); //is array of objects
    expect(res.body.data.length).toBe(12); //as per pagination limit

    expect(res.body.data[0].id).toBe(3);
    expect(res.body.data[0].name).toBe("Oyoloo");
    expect(res.body.data[0].description).toBe(
      "odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit"
    );
    expect(res.body.data[0].price).toBe(215079);
    expect(res.body.data[0].imgUrl).toBe(
      "http://dummyimage.com/147x100.png/ff4444/ffffff"
    );
    expect(res.body.data[0].stock).toBe(280);
    expect(res.body.data[0].categoryId).toBe(1);
    expect(res.body.data[0].authorId).toBe(3);
    expect(res.body.data[0].status).toBe("Inactive");
  });

  it("should return products array per page limited to 10", async () => {
    const res = await request(app)
      .get("/pub/products")
      .query({ page: 3 })
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true); //is array of objects
    expect(res.body.data.length).toBe(12); //as per pagination limit
    expect(res.body.data[0].id).toBe(25);
  });

  it("should return an object of specific product as per id", async () => {
    const res = await request(app).get(`/pub/products/${2}`).expect(200);

    expect(res.body.data.id).toBe(2);
  });

  it("should fail to return an object specific product as per id", async () => {
    const res = await request(app).get(`/pub/products/${999}`).expect(404);

    expect(res.body.message).toBe("Error Not Found"); //only return 1 product with specific id
  });
});
