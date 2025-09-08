using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class UserProfileSpec : Specification<UserProfile>
{
    public UserProfileSpec(Guid userId)
    {
        Query.Where(p => p.UserId == userId);
    }
}
