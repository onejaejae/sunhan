const serviceError = (error) => {
  const err = new Error(error.message);
  err.status = error.status || 500;
  return err;
};

export default serviceError;
