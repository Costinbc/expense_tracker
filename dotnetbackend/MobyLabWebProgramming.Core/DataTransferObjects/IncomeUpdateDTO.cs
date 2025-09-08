namespace MobyLabWebProgramming.Core.DataTransferObjects;

public record IncomeUpdateDTO(
    Guid Id,
    decimal? Amount = null,
    string? Description = null,
    DateTime? Date = null,
    Guid? CategoryId = null,
    Guid? PaymentMethodId = null
);