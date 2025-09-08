using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IUserProfileService
{
    Task<ServiceResponse<UserProfileDTO>> GetProfile(Guid userId, CancellationToken ct = default);
    Task<ServiceResponse> AddProfile(UserProfileAddDTO dto, CancellationToken ct = default);
    Task<ServiceResponse> UpdateProfile(UserProfileUpdateDTO dto, CancellationToken ct = default);
    Task<ServiceResponse> DeleteProfile(Guid id, CancellationToken ct = default);
}
