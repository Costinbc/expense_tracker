using System.Net;

namespace MobyLabWebProgramming.Core.Errors;

/// <summary>
/// Common error messages that may be reused in various places in the code.
/// </summary>
public static class CommonErrors
{
    public static ErrorMessage UserNotFound => new(HttpStatusCode.NotFound, "User doesn't exist!", ErrorCodes.EntityNotFound);
    public static ErrorMessage FileNotFound => new(HttpStatusCode.NotFound, "File not found on disk!", ErrorCodes.PhysicalFileNotFound);
    public static ErrorMessage EntityNotFound => new(HttpStatusCode.NotFound, "Entity not found!", ErrorCodes.EntityNotFound);
    public static ErrorMessage IncomeNotFound => new(HttpStatusCode.NotFound, "Income not found!", ErrorCodes.IncomeNotFound);
    public static ErrorMessage ExpenseNotFound => new(HttpStatusCode.NotFound, "Expense not found!", ErrorCodes.ExpenseNotFound);
    public static ErrorMessage CategoryNotFound => new(HttpStatusCode.NotFound, "Category not found!", ErrorCodes.CategoryNotFound);
    public static ErrorMessage PaymentMethodNotFound => new(HttpStatusCode.NotFound, "Payment method not found!", ErrorCodes.PaymentMethodNotFound);
    
    public static ErrorMessage AccessDenied => new(HttpStatusCode.Forbidden, "You don't have permission to access this resource!", ErrorCodes.AccessDenied);
    
    public static ErrorMessage EmailNotificationFailes => new(HttpStatusCode.InternalServerError, "Email notification failed!", ErrorCodes.EmailNotificationFailed);
    
    public static ErrorMessage TechnicalSupport => new(HttpStatusCode.InternalServerError, "An unknown error occurred, contact technical support!", ErrorCodes.TechnicalError);
}
