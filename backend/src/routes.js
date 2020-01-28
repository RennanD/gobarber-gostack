const { Router } = require("express");

const routes = new Router();

routes.get("/users", (req, res) => {
  console.log(req);

  return res.send("hello");
});

export default routes;
