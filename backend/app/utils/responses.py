class ApiResponse:
    def __init__(self,data,message,statusCode):
        self.data = data,
        self.message = message,
        self.statusCode = statusCode
        self.success = statusCode > 400
        
        
