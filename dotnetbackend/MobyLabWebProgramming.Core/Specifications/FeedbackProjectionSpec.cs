using Ardalis.Specification;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class FeedbackProjectionSpec : Specification<Feedback, FeedbackDTO>
{
    public FeedbackProjectionSpec(string? search = null)
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();
            Query.Where(f =>
                f.Category.ToLower().Contains(search) ||
                f.Comment.ToLower().Contains(search));
        }

        Query.OrderByDescending(f => f.CreatedAt);

        Query.Select(f => new FeedbackDTO(
            f.Id,
            f.UserId,
            f.Category,
            f.ExperienceRating,
            f.WouldRecommend,
            f.Comment,
            f.CreatedAt
        ));
    }
}