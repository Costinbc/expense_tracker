using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public record CategoryUpdateDTO(
    Guid Id,
    string? Name = null,
    CategoryTypeEnum? Type = null
);
