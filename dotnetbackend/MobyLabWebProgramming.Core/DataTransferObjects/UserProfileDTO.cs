namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class UserProfileDTO
{
    public Guid Id { get; set; }
    public string Bio { get; set; } = string.Empty;
    public DateTime? Birthday { get; set; }
    public Guid UserId { get; set; }
}
