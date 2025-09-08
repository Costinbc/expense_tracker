namespace MobyLabWebProgramming.Core.DataTransferObjects;

public record FeedbackDTO(
    Guid   Id,
    Guid?  UserId,
    string Category,
    string ExperienceRating,
    bool   WouldRecommend,
    string Comment,
    DateTime CreatedAt
);