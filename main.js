const jsonServer = require('json-server');
const server = jsonServer.create();
const queryString = require('query-string');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  next();
});

router.render = (req, res) => {
  // Check GET with pagination
  //If yes, custom output

  const headers = res.getHeaders();
  const totalCountHeader = headers['x-total-count'];
  if (req.method === 'GET' && totalCountHeader) {
    const queryParams = queryString.parse(req?._parsedOriginalUrl?.query);
    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCountHeader),
      },
    };
    return res.jsonp(result);
  }
  // Otherwise, keep default behavior
  res.jsonp(res.locals.data);
};

// Use default router
const PORT = process.env.PORT || 3000;

// start server
server.use('/api', router);
server.listen(PORT, () => {
  console.log('JSON Server is running');
});
