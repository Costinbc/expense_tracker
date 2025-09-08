namespace MobyLabWebProgramming.Core.Entities;

public class UserProfile : BaseEntity
{
    public string Bio { get; set; } = string.Empty;
    public DateTime? Birthday { get; set; }

    public Guid UserId { get; set; } // Foreign key
    public User User { get; set; } = null!;
}
