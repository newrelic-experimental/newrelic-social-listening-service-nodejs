class ApiError extends Error {
  /**
   * Create an Error Object
   * status - The HTTP Status Code (e.g. 404)
   * title - The title corresponding to the Status Code (e.g. Bad Request)
   * message - Specific information about what caused the error
   */
  status: number;
  title: string;
  message: string;
  constructor(
    status = 500,
    title = 'Internal Server Error',
    message = 'Unknown server error occurred',
  ) {
    super(message);
    this.status = status;
    this.title = title;
    this.message = message;
  }

  toJSON(): Error {
    const { status, title, message } = this;
    return {
      status,
      title,
      message,
    };
  }
}

type Error = { status: number; title: string; message: string };

export { ApiError };
