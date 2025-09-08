namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class UserProfileUpdateDTO
{
    public Guid Id { get; set; }
    public string? Bio { get; set; }
    public DateTime? Birthday { get; set; }
}
