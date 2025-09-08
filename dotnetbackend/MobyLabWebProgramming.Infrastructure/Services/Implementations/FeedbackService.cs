using System.Net;
using MobyLabWebProgramming.Core.Constants;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class FeedbackService(IRepository<WebAppDatabaseContext> repo) : IFeedbackService
{
    public async Task<ServiceResponse> AddFeedback(FeedbackAddDTO dto, Guid? userId, CancellationToken ct = default)
    {
        await repo.AddAsync(new Feedback
        {
            UserId          = userId,           // may be null for guests
            Category        = dto.Category,
            ExperienceRating= dto.ExperienceRating,
            WouldRecommend  = dto.WouldRecommend,
            Comment         = dto.Comment
        }, ct);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<PagedResponse<FeedbackDTO>>> GetFeedbacks(
            PaginationSearchQueryParams page,
            CancellationToken ct = default)
    {
        var result = await repo.PageAsync(page, new FeedbackProjectionSpec(page.Search), ct);
        return ServiceResponse.ForSuccess(result);
    }
}