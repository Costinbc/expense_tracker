using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Backend.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class UserProfileController(
    IUserProfileService profileService,
    IUserService userService
) : AuthorizedController(userService)
{
    [HttpGet]
    public async Task<ActionResult<RequestResponse<UserProfileDTO>>> GetMyProfile()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await profileService.GetProfile(currentUser.Result.Id))
            : ErrorMessageResult<UserProfileDTO>(currentUser.Error);
    }

    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Add([FromBody] UserProfileAddDTO dto)
    {
        var currentUser = await GetCurrentUser();
        
        if (currentUser.Result != null)
            dto.UserId = currentUser.Result.Id;

        return currentUser.Result != null
            ? FromServiceResponse(await profileService.AddProfile(dto))
            : ErrorMessageResult(currentUser.Error);
    }

    [HttpPut]
    public async Task<ActionResult<RequestResponse>> Update([FromBody] UserProfileUpdateDTO dto)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await profileService.UpdateProfile(dto))
            : ErrorMessageResult(currentUser.Error);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Delete(Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await profileService.DeleteProfile(id))
            : ErrorMessageResult(currentUser.Error);
    }
}
