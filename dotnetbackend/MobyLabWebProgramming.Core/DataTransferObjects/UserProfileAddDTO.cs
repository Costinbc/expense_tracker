namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class UserProfileAddDTO
{
    public string Bio { get; set; } = string.Empty;
    public DateTime? Birthday { get; set; }
    public Guid UserId { get; set; }
}
