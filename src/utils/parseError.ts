const parseError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : '🛠️'
    };
  }
  return error;
};

export default parseError;
