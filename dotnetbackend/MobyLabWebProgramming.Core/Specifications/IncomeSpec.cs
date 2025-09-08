using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class IncomeSpec : Specification<Income>
{
    public IncomeSpec(Guid incomeId, Guid userId)
    {
        Query.Where(i => i.Id == incomeId && i.UserId == userId);
    }
}