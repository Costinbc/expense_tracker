namespace MobyLabWebProgramming.Core.DataTransferObjects;

public record ExpenseUpdateDTO(
    Guid Id,
    Guid UserId,
    decimal? Amount = null,
    string? Description = null,
    DateTime? Date = null,
    Guid? CategoryId = null,
    Guid? PaymentMethodId = null
);