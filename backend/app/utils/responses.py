class ApiResponse:
    def __init__(
        self,
        message: str,
        statusCode: int,
        data: dict | None = None
    ):
        self.data = data if data is not None else {}
        self.message = message
        self.statusCode = statusCode
        self.success = statusCode < 400
