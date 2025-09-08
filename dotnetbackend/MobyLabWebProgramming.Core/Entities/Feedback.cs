namespace MobyLabWebProgramming.Core.Entities;

public class Feedback : BaseEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public string Category { get; set; } = "";
    public string ExperienceRating { get; set; } = "";
    public bool WouldRecommend { get; set; }
    public string Comment { get; set; } = "";
}