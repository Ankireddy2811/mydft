const isRootPath = window.location.pathname === '/';

  return (
    <Switch>
      <Route path="/A" component={AC} />
      <Route path="/B" component={BC} />
      <Route path="/C" component={CC} />
      {isRootPath ? (
        <Route path="/" component={Home} />
      ) : (
        <Route path="/" component={NotFound} />
      )}
    </Switch>
  );