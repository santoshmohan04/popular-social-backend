export function successResponse(data) {
  return {
    success: true,
    data
  };
}

export function errorResponse(message, code = "INTERNAL_SERVER_ERROR") {
  return {
    success: false,
    error: {
      code,
      message
    }
  };
}
