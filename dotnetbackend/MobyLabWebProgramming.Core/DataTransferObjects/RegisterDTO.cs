namespace MobyLabWebProgramming.Core.DataTransferObjects;

public record RegisterDTO(
    string Name,
    string Email,
    string Password
);
