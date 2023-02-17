require('dotenv').config();
const Express = require('express');
const env = process.env.NODE_ENV;
const PORT = parseInt(process.env.PORT, 10) || 8081;
const isDev = env === "development";
const { resolve } = require('path');

const createServer = async (root = process.cwd()) => {
  const app = Express();

  app.use(Express.json());
  // Configuring Passport
  const passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());
  require('./config/passport')(passport);
  const routes = require('./routes/index')(passport);
  app.use('/api', routes);
  
  let vite;
  if (isDev) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isDev ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${root}/dist/client/index.html`));
    });
  }

  return { app, vite };
};

createServer().then(({ app }) => {
  app.listen(PORT, () => {
    console.log(`--> Running on ${PORT}`);
  });
});