namespace MobyLabWebProgramming.Core.DataTransferObjects;

public record FeedbackAddDTO(
    string Category,
    string ExperienceRating,
    bool   WouldRecommend,
    string Comment
);