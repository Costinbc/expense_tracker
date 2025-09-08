using System.Net;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class UserProfileService(IRepository<WebAppDatabaseContext> repo) : IUserProfileService
{
    public async Task<ServiceResponse<UserProfileDTO>> GetProfile(Guid userId, CancellationToken ct = default)
    {
        var profile = await repo.GetAsync(new UserProfileSpec(userId), ct);
        if (profile == null) return ServiceResponse.FromError<UserProfileDTO>(CommonErrors.EntityNotFound);

        return ServiceResponse.ForSuccess(new UserProfileDTO
        {
            Id = profile.Id,
            Bio = profile.Bio,
            Birthday = profile.Birthday,
            UserId = profile.UserId
        });
    }

    public async Task<ServiceResponse> AddProfile(UserProfileAddDTO dto, CancellationToken ct = default)
    {
        var existing = await repo.GetAsync(new UserProfileSpec(dto.UserId), ct);
        if (existing != null)
            return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "Profile already exists."));

        await repo.AddAsync(new UserProfile
        {
            Bio = dto.Bio,
            Birthday = dto.Birthday,
            UserId = dto.UserId
        }, ct);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateProfile(UserProfileUpdateDTO dto, CancellationToken ct = default)
    {
        var profile = await repo.GetAsync<UserProfile>(dto.Id, ct);
        if (profile == null)
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Profile not found."));

        profile.Bio = dto.Bio ?? profile.Bio;
        profile.Birthday = dto.Birthday ?? profile.Birthday;

        await repo.UpdateAsync(profile, ct);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteProfile(Guid id, CancellationToken ct = default)
    {
        await repo.DeleteAsync<UserProfile>(id, ct);
        return ServiceResponse.ForSuccess();
    }
}
