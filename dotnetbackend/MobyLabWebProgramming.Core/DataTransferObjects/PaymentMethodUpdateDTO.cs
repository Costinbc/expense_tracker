namespace MobyLabWebProgramming.Core.DataTransferObjects;

public record PaymentMethodUpdateDTO(
    Guid Id,
    string? Name = null
);
