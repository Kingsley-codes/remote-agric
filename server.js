const http = require("http");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, "0.0.0.0", () => {
        console.log(`Frontend listening on port ${port}`);
      });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
