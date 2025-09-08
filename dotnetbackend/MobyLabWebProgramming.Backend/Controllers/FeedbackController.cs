using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

[ApiController]
[Route("api/[controller]/[action]")]
public class FeedbackController(IFeedbackService feedback, IUserService userService) : AuthorizedController(userService)
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<RequestResponse>> Add([FromBody] FeedbackAddDTO dto)
    {
        Guid? userId = (await GetCurrentUser()).Result?.Id;
        return FromServiceResponse(await feedback.AddFeedback(dto, userId));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RequestResponse<PagedResponse<FeedbackDTO>>>> GetPage(
        [FromQuery] PaginationSearchQueryParams query)
    {
        return FromServiceResponse(await feedback.GetFeedbacks(query));
    }
}