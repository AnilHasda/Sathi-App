function wrapper(func) {
  return (req, resp, next) => {
    Promise.resolve(func(req, resp, next)).catch(next);
  };
}
export default wrapper;